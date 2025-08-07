import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { UserRole } from '../types';
import logger from '../config/logger';

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const payload = { id: userId };
  
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' } // 7 days
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '30d' } // 30 days
  );

  return { accessToken, refreshToken };
};

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role = UserRole.STAFF, profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role,
    profile: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      position: profile.position || '',
      permissions: profile.permissions || [],
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Update last login
  await user.update({ lastLogin: new Date() });

  logger.info(`New user registered: ${user.username} (${user.email})`);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Find user by username or email
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: username }, { username }],
    },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact administrator.', 401);
  }

  // Check password
  const isPasswordValid = await user.checkPassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Update last login
  await user.update({ lastLogin: new Date() });

  logger.info(`User logged in: ${user.username} (${user.email})`);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

// Get current user profile
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user.toJSON(),
    },
  });
});

// Update user profile
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, profile } = req.body;
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email is already taken', 400);
    }
  }

  // Update user
  const updateData: any = {};
  if (email) updateData.email = email;
  if (profile) {
    updateData.profile = {
      ...user.profile,
      ...profile,
    };
  }

  await user.update(updateData);

  logger.info(`User profile updated: ${user.username} (${user.email})`);

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: user.toJSON(),
    },
  });
});

// Change password
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check current password
  const isCurrentPasswordValid = await user.checkPassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  await user.update({ password: newPassword });

  logger.info(`Password changed for user: ${user.username} (${user.email})`);

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully',
  });
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
    
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        tokens,
      },
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
});

// Logout (client-side token removal)
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  logger.info(`User logged out: ${req.user.username} (${req.user.email})`);
  
  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
  });
});

// Admin: Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const { count, rows: users } = await User.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    data: {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
      },
    },
  });
});

// Admin: Update user status
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.update({ isActive });

  logger.info(`User status updated: ${user.username} - Active: ${isActive}`);

  res.status(200).json({
    status: 'success',
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      user: user.toJSON(),
    },
  });
});

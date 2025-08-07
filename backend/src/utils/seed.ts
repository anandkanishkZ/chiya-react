import { Sequelize } from 'sequelize';
import User from '../models/User';
import { UserRole } from '../types';
import logger from '../config/logger';

const createAdminUser = async (sequelize: Sequelize) => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      logger.info('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@chiyashop.com',
      password: 'chiya123', // This will be hashed automatically
      role: UserRole.SUPER_ADMIN,
      profile: {
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+977-9876543210',
        position: 'System Administrator',
        permissions: ['*'], // All permissions
      },
      isActive: true,
    });

    logger.info('Admin user created successfully:', {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
    });
  } catch (error) {
    logger.error('Error creating admin user:', error);
    throw error;
  }
};

export { createAdminUser };

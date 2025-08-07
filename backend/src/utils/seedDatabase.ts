import User from '../models/User';
import { UserRole } from '../types';
import logger from '../config/logger';

export const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('🌱 Seeding database with initial data...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      logger.info('✅ Admin user already exists, skipping seed');
      return;
    }

    // Create default admin user
    await User.create({
      username: 'admin',
      email: 'admin@chiyashop.com',
      password: 'admin123', // Will be hashed by the model hook
      role: UserRole.ADMIN,
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        phone: '+977-9876543210',
        position: 'Administrator',
        permissions: ['all'],
      },
      isActive: true,
    });

    // Create chiya_admin user for frontend compatibility
    await User.create({
      username: 'chiya_admin',
      email: 'chiya@chiyashop.com',
      password: 'chiya123', // Will be hashed by the model hook
      role: UserRole.ADMIN,
      profile: {
        firstName: 'Chiya',
        lastName: 'Admin',
        phone: '+977-9876543211',
        position: 'Manager',
        permissions: ['all'],
      },
      isActive: true,
    });

    // Create staff user for testing
    await User.create({
      username: 'staff1',
      email: 'staff@chiyashop.com',
      password: 'chiya123', // Will be hashed by the model hook
      role: UserRole.STAFF,
      profile: {
        firstName: 'Staff',
        lastName: 'Member',
        phone: '+977-9876543212',
        position: 'Waiter',
        permissions: ['orders', 'tables'],
      },
      isActive: true,
    });

    logger.info('✅ Database seeded successfully with default users');
    logger.info('📝 Default login credentials:');
    logger.info('   - admin / admin123');
    logger.info('   - chiya_admin / chiya123');
    logger.info('   - staff1 / chiya123');

  } catch (error) {
    logger.error('❌ Failed to seed database:', error);
    throw error;
  }
};

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './logger';

// Load environment variables FIRST
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'chiya_shop_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres', // Default postgres password
  dialect: 'postgres' as const,
  logging: isProduction ? false : (sql: string) => logger.debug(sql),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
  },
  dialectOptions: {
    // Add SSL configuration for production
    ...(isProduction && {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }),
  },
};

// Create Sequelize instance
export const sequelize = new Sequelize(dbConfig);

// Test connection function
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    if (!isProduction && !isTest) {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Close connection function
export const closeDB = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

export default sequelize;

// Debug Sequelize connection specifically
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Load environment variables
dotenv.config();

console.log('🔍 Sequelize Debug:');
console.log('==================');

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'chiya_shop_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  dialect: 'postgres',
  logging: console.log, // Enable logging to see what's happening
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const testSequelize = async () => {
  try {
    console.log('🔧 Testing Sequelize connection...');
    console.log('Connection config:');
    console.log({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: '***' + (process.env.DB_PASSWORD?.slice(-3) || ''),
    });
    
    await sequelize.authenticate();
    console.log('✅ Sequelize connection successful!');
    
    await sequelize.close();
  } catch (error: any) {
    console.log('❌ Sequelize connection failed:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.parent?.code || 'unknown');
    console.log('Full error:', error);
  }
};

testSequelize();

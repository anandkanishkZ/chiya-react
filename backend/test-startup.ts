// Simplified server test to isolate the issue
import dotenv from 'dotenv';
import { connectDB } from './src/config/database';
import logger from './src/config/logger';

// Load environment variables
dotenv.config();

console.log('🚀 Testing server startup components...');

const testStartup = async () => {
  try {
    console.log('\n1️⃣ Testing database connection...');
    await connectDB();
    console.log('✅ Database connection successful!');
    
    console.log('\n2️⃣ Testing Redis connection...');
    try {
      const { redisClient } = await import('./src/config/redis');
      await redisClient.connect();
      console.log('✅ Redis connection successful!');
      await redisClient.disconnect();
    } catch (redisError: any) {
      console.log('⚠️ Redis connection failed (this is okay for now):', redisError.message);
    }
    
    console.log('\n3️⃣ Testing user model import...');
    try {
      const User = await import('./src/models/User');
      console.log('✅ User model imported successfully!');
    } catch (modelError: any) {
      console.log('❌ User model import failed:', modelError.message);
    }
    
    console.log('\n4️⃣ Testing auth routes import...');
    try {
      const authRoutes = await import('./src/routes/auth.routes');
      console.log('✅ Auth routes imported successfully!');
    } catch (routeError: any) {
      console.log('❌ Auth routes import failed:', routeError.message);
    }
    
    console.log('\n🎉 All components tested!');
    
  } catch (error: any) {
    console.log('❌ Startup test failed:', error.message);
    console.log('Stack:', error.stack);
  }
};

testStartup();

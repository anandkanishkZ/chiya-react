import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import 'express-async-errors';
import dotenv from 'dotenv';

// Import configurations and middleware
import { connectDB } from './config/database';
import { redisClient } from './config/redis';
import logger from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';
import { seedDatabase } from './utils/seedDatabase';

// Import routes
import authRoutes from './routes/auth.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chiya Shop API',
      version: '1.0.0',
      description: 'Restaurant Management System API',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW!) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX!) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}
app.use(requestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes);

// TODO: Add other routes when they are implemented
// app.use(`/api/${apiVersion}/users`, userRoutes);
// app.use(`/api/${apiVersion}/restaurants`, restaurantRoutes);
// app.use(`/api/${apiVersion}/tables`, tableRoutes);
// app.use(`/api/${apiVersion}/menu`, menuRoutes);
// app.use(`/api/${apiVersion}/orders`, orderRoutes);
// app.use(`/api/${apiVersion}/inventory`, inventoryRoutes);
// app.use(`/api/${apiVersion}/staff`, staffRoutes);
// app.use(`/api/${apiVersion}/expenses`, expenseRoutes);
// app.use(`/api/${apiVersion}/reports`, reportRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-restaurant', (restaurantId: string) => {
    socket.join(`restaurant-${restaurantId}`);
    logger.info(`Socket ${socket.id} joined restaurant ${restaurantId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available throughout the app
app.set('io', io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info('Database connected successfully');

    // Seed database with initial data
    await seedDatabase();

    // Connect to Redis (optional for development)
    try {
      const redisConnectPromise = redisClient.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 3000)
      );
      
      await Promise.race([redisConnectPromise, timeoutPromise]);
      logger.info('✅ Redis connected successfully');
    } catch (redisError) {
      logger.warn('⚠️  Redis connection failed - continuing without Redis cache');
      logger.info('💡 Note: Install and start Redis server for caching features');
    }

    // Start server
    server.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 CHIYA SHOP BACKEND SERVER STARTED SUCCESSFULLY!');
      console.log('='.repeat(60));
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/v1/auth`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log('='.repeat(60));
      console.log('📝 DEFAULT LOGIN CREDENTIALS:');
      console.log('   👨‍💼 Admin: username="admin", password="admin123"');
      console.log('   � Chiya Admin: username="chiya_admin", password="chiya123"');
      console.log('='.repeat(60));
      console.log('✅ Backend is ready for frontend connections!');
      console.log('');
      
      // Also log to logger
      logger.info(`� Server running on port ${PORT}`);
      logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      logger.info('🎉 Chiya Shop Backend is ready!');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  try {
    await redisClient.disconnect();
  } catch (error) {
    // Redis might not be connected
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  try {
    await redisClient.disconnect();
  } catch (error) {
    // Redis might not be connected
  }
  process.exit(0);
});

startServer();

export { app, io };

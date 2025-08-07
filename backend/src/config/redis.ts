import { createClient } from 'redis';
import logger from './logger';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

export const redisClient = createClient({
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  },
  password: redisConfig.password,
});

redisClient.on('error', (err) => {
  // Suppress Redis connection errors in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Redis Client Error (development):', err.code);
  } else {
    logger.error('Redis Client Error:', err);
  }
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('end', () => {
  logger.info('Redis client disconnected');
});

// Cache helper functions
export const cacheGet = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: string,
  expireInSeconds?: number
): Promise<void> => {
  try {
    if (expireInSeconds) {
      await redisClient.setEx(key, expireInSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
  }
};

export const cacheFlush = async (): Promise<void> => {
  try {
    await redisClient.flushAll();
    logger.info('Cache flushed successfully');
  } catch (error) {
    logger.error('Error flushing cache:', error);
  }
};

export default redisClient;

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response
  res.send = function(data: any) {
    const duration = Date.now() - start;
    const contentLength = res.get('Content-Length') || 0;

    // Log request details
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: `${contentLength}b`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous',
    });

    // Call original send method
    return originalSend.call(this, data);
  };

  next();
};

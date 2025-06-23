
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = {
  handleError: (error: Error | AppError) => {
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // In production, you might want to send errors to a logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service (e.g., Sentry, LogRocket, etc.)
    }
  },

  createError: (message: string, statusCode: number = 500) => {
    return new AppError(message, statusCode);
  },

  isOperationalError: (error: Error): boolean => {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
};

import { Request, Response, NextFunction } from "express";

/**
 * Custom Error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Global error handling middleware
 * Should be used last in the middleware chain
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] | undefined;

  // Handle custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Handle MongoDB CastError
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    errors = [{ field: "id", message: "Invalid MongoDB ObjectId" }];
  }
  // Handle MongoDB ValidationError
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // Handle MongoDB DuplicateKey Error
  else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate Entry";
    const field = Object.keys(err.keyPattern)[0];
    errors = [{ field, message: `${field} already exists` }];
  }
  // Handle JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }
  // Handle other errors
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {
    message = err.message;
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found error handler - should be called before error handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ApiError(
    404,
    `Route ${req.originalUrl} not found`
  );
  next(error);
};

/**
 * Validation error helper
 */
export const throwValidationError = (
  errors: { field: string; message: string }[]
) => {
  throw new ApiError(400, "Validation failed", errors);
};

/**
 * Not found resource helper
 */
export const throwNotFound = (resource: string) => {
  throw new ApiError(404, `${resource} not found`);
};

/**
 * Unauthorized error helper
 */
export const throwUnauthorized = () => {
  throw new ApiError(401, "Unauthorized");
};

/**
 * Forbidden error helper
 */
export const throwForbidden = () => {
  throw new ApiError(403, "Forbidden");
};

/**
 * Conflict error helper (duplicate, etc.)
 */
export const throwConflict = (message: string) => {
  throw new ApiError(409, message);
};

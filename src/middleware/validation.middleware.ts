import { Request, Response, NextFunction } from "express";

/**
 * Validate required fields in request body
 */
export const validateRequiredFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        missingFields,
        error: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    next();
  };
};

/**
 * Validate email format
 */
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Validation Error",
      error: "Invalid email format"
    });
  }

  next();
};

/**
 * Validate enum fields
 */
export const validateEnum = (field: string, validValues: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field] ?? req.query[field];

    if (value && !validValues.includes(value as string)) {
      return res.status(400).json({
        message: "Validation Error",
        error: `Invalid value for ${field}. Must be one of: ${validValues.join(", ")}`
      });
    }

    next();
  };
};

/**
 * Validate numeric fields
 */
export const validateNumeric = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];

    if (value !== undefined && value !== null && isNaN(Number(value))) {
      return res.status(400).json({
        message: "Validation Error",
        error: `${field} must be a number`
      });
    }

    next();
  };
};

/**
 * Validate array fields
 */
export const validateArray = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];

    if (value !== undefined && !Array.isArray(value)) {
      return res.status(400).json({
        message: "Validation Error",
        error: `${field} must be an array`
      });
    }

    next();
  };
};

/**
 * Validate request body is not empty
 */
export const validateBodyNotEmpty = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Validation Error",
      error: "Request body cannot be empty"
    });
  }

  next();
};

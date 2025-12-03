// middleware/mongooseErrorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';

export const mongooseErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. ValidationError
  if (err instanceof Error.ValidationError) {
    const errors = Object.values(err.errors).reduce((acc, e) => {
      acc[e.path] = e.message;
      return acc;
    }, {} as Record<string, string>);

    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Validation failed',
      errors,
      data: null,
    });
  }

  // 2. CastError
  if (err instanceof Error.CastError) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: `Invalid value '${err.value}' for field '${err.path}'`,
      data: null,
    });
  }

  // 3. E11000 Duplicate Key — Works for ANY unique field
  if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
    const mongoError = err as {
      code: number;
      keyValue?: Record<string, any>;
      keyPattern?: Record<string, any>;
    };

    // Try keyValue first (most common), fallback to keyPattern
    const duplicateField = mongoError.keyValue
      ? Object.keys(mongoError.keyValue)[0]
      : mongoError.keyPattern
      ? Object.keys(mongoError.keyPattern)[0]
      : 'field';

    const duplicateValue = mongoError.keyValue?.[duplicateField] ?? 'unknown';

    // Human-readable field name
    const fieldName = duplicateField
      .split('.')
      .pop()!
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    return res.status(409).json({
      success: false,
      status: 409,
      message: `${fieldName} '${duplicateValue}' is already in use`,
      field: duplicateField,
      value: duplicateValue,
      data: null,
    });
  }

  // 4. VersionError
  if (err instanceof Error.VersionError) {
    return res.status(409).json({
      success: false,
      status: 409,
      message: 'Data was modified by another user. Please refresh and try again.',
      data: null,
    });
  }

  // Unknown error → go to 500 handler
  next(err);
};
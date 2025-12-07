import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateFeedback = [
  body('locationId')
    .trim()
    .notEmpty()
    .withMessage('locationId is required')
    .isString()
    .withMessage('locationId must be a string'),

  body('rating')
    .notEmpty()
    .withMessage('rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('rating must be an integer between 1 and 5'),

  body('comment')
    .optional()
    .isString()
    .withMessage('comment must be a string')
    .isLength({ max: 500 })
    .withMessage('comment must not exceed 500 characters'),

  body('submittedAt')
    .notEmpty()
    .withMessage('submittedAt is required')
    .isISO8601()
    .withMessage('submittedAt must be a valid ISO 8601 timestamp'),

  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: Error & { status?: number; errors?: unknown[] } = new Error(
        'Validation failed'
      );
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    next();
  },
];

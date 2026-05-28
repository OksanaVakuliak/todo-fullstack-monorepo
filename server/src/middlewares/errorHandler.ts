import { Request, Response, NextFunction } from 'express';

type AppError = Error & {
  statusCode?: number;
};

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode ?? 500;
  const isProd = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};

import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './errorHandler';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError(`路由 ${req.method} ${req.path} 未找到`);
  next(error);
};
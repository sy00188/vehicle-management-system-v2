import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 创建常用错误类型
export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = '资源未找到') {
    super(message, 404);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = '未授权访问') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = '禁止访问') {
    super(message, 403);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = '资源冲突') {
    super(message, 409);
  }
}

// 错误处理中间件
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // 处理Prisma错误
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = '数据已存在，违反唯一性约束';
        break;
      case 'P2025':
        statusCode = 404;
        message = '记录未找到';
        break;
      case 'P2003':
        statusCode = 400;
        message = '外键约束失败';
        break;
      default:
        statusCode = 400;
        message = '数据库操作失败';
    }
  }

  // 处理JWT错误
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的访问令牌';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '访问令牌已过期';
  }

  // 处理验证错误
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = '数据验证失败';
  }

  // 处理Multer错误
  if (error.name === 'MulterError') {
    const multerError = error as any;
    switch (multerError.code) {
      case 'LIMIT_FILE_SIZE':
        statusCode = 413;
        message = '文件大小超出限制';
        break;
      case 'LIMIT_FILE_COUNT':
        statusCode = 413;
        message = '文件数量超出限制';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        statusCode = 400;
        message = '不支持的文件类型';
        break;
      default:
        statusCode = 400;
        message = '文件上传失败';
    }
  }

  // 记录错误
  console.error(`[${new Date().toISOString()}] ${error.name}: ${message}`);
  if (config.nodeEnv === 'development') {
    console.error(error.stack);
  }

  // 响应错误
  const errorResponse: any = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // 开发环境下返回错误堆栈
  if (config.nodeEnv === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.error = error;
  }

  res.status(statusCode).json(errorResponse);
};

// 异步错误包装器
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
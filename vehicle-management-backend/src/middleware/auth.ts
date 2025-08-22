import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, extractTokenFromHeader, JwtPayload } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

const prisma = new PrismaClient();

// 定义用户角色类型
type UserRole = 'ADMIN' | 'MANAGER' | 'USER' | 'DRIVER';

// 扩展Request接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
      };
    }
  }
}

// JWT认证中间件
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('缺少访问令牌');
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    
    if (!token) {
      throw new UnauthorizedError('访问令牌无效');
    }

    // 验证JWT令牌
    const decoded = verifyAccessToken(token);
    
    // 从数据库获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        status: true
      }
    });

    if (!user) {
      throw new UnauthorizedError('用户不存在');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenError('用户账户已被禁用');
    }

    // 将用户信息添加到请求对象
    req.user = user;
    
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('invalid') || error.message.includes('malformed')) {
        next(new UnauthorizedError('访问令牌无效'));
      } else if (error.message.includes('expired')) {
        next(new UnauthorizedError('访问令牌已过期'));
      } else {
        next(new UnauthorizedError('认证失败'));
      }
    } else {
      next(error);
    }
  }
};

// 角色权限检查中间件
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('用户未认证');
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('权限不足');
    }

    next();
  };
};

// 管理员权限检查
export const requireAdmin = requireRole(['ADMIN']);

// 管理员或经理权限检查
export const requireManager = requireRole(['ADMIN', 'MANAGER']);

// 驾驶员权限检查
export const requireDriver = requireRole(['ADMIN', 'MANAGER', 'DRIVER']);

// 可选认证中间件（不强制要求认证）
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        const decoded = verifyAccessToken(token);
        
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            role: true,
            status: true
          }
        });

        if (user && user.status === 'ACTIVE') {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // 可选认证失败时不抛出错误，继续执行
    next();
  }
};
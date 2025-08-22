import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * 生成访问令牌
 * @param payload JWT载荷
 * @returns 访问令牌
 */
export const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(
    payload,
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions
  );
};

/**
 * 生成刷新令牌
 * @param payload JWT载荷
 * @returns 刷新令牌
 */
export const generateRefreshToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(
    payload,
    config.jwtSecret,
    {
      expiresIn: config.jwtRefreshExpiresIn,
    } as jwt.SignOptions
  );
};

/**
 * 验证访问令牌
 * @param token 访问令牌
 * @returns JWT载荷
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('访问令牌无效');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('访问令牌已过期');
    } else {
      throw new Error('令牌验证失败');
    }
  }
};

/**
 * 验证刷新令牌
 * @param token 刷新令牌
 * @returns JWT载荷
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('刷新令牌无效');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('刷新令牌已过期');
    } else {
      throw new Error('令牌验证失败');
    }
  }
};

/**
 * 从请求头中提取令牌
 * @param authHeader Authorization头
 * @returns 提取的令牌或null
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
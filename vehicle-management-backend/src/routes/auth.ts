import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, UnauthorizedError, ConflictError } from '../middleware/errorHandler';
// import { loginRateLimit, registerRateLimit } from '../middleware/rateLimit'; // 开发阶段暂时禁用限流
import { authMiddleware } from '../middleware/auth';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';

const router = express.Router();
const prisma = new PrismaClient();

// 生成JWT令牌
const generateTokens = (user: any) => {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

// 用户注册
router.post('/register', /* registerRateLimit, */ asyncHandler(async (req, res) => {
  const { email, username, password, name, phone, role = 'USER' } = req.body;

  // 验证必填字段
  if (!email || !username || !password || !name) {
    throw new ValidationError('邮箱、用户名、密码和姓名为必填项');
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('邮箱格式不正确');
  }

  // 验证密码强度
  if (password.length < 6) {
    throw new ValidationError('密码长度至少为6位');
  }

  // 检查用户是否已存在
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictError('邮箱已被注册');
    }
    if (existingUser.username === username) {
      throw new ConflictError('用户名已被使用');
    }
  }

  // 加密密码
  const hashedPassword = await hashPassword(password);

  // 创建用户
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      name,
      phone,
      role: role.toUpperCase()
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true
    }
  });

  // 生成令牌
  const tokens = generateTokens(user);

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: {
      user,
      ...tokens
    }
  });
}));

// 用户登录
router.post('/login', /* loginRateLimit, */ asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 验证必填字段
  if (!email || !password) {
    throw new ValidationError('邮箱和密码为必填项');
  }

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new UnauthorizedError('邮箱或密码错误');
  }

  // 检查用户状态
  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedError('账户已被禁用');
  }

  // 验证密码
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('邮箱或密码错误');
  }

  // 生成令牌
  const tokens = generateTokens(user);

  // 返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: '登录成功',
    data: {
      user: userWithoutPassword,
      ...tokens
    }
  });
}));

// 刷新令牌
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('刷新令牌为必填项');
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    // 获取用户信息
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

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedError('用户不存在或已被禁用');
    }

    // 生成新的令牌
    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: '令牌刷新成功',
      data: tokens
    });
  } catch (error) {
    throw new UnauthorizedError('刷新令牌无效或已过期');
  }
}));

// 获取当前用户信息
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    data: user
  });
}));

// 修改密码
router.put('/change-password', authMiddleware, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('当前密码和新密码为必填项');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('新密码长度至少为6位');
  }

  // 获取用户当前密码
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id }
  });

  if (!user) {
    throw new UnauthorizedError('用户不存在');
  }

  // 验证当前密码
  const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError('当前密码错误');
  }

  // 加密新密码
  const hashedNewPassword = await hashPassword(newPassword);

  // 更新密码
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { password: hashedNewPassword }
  });

  res.json({
    success: true,
    message: '密码修改成功'
  });
}));

// 验证令牌有效性
router.get('/validate', authMiddleware, asyncHandler(async (req, res) => {
  // 如果通过了authMiddleware，说明token有效
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user || user.status !== 'ACTIVE') {
    throw new UnauthorizedError('用户不存在或已被禁用');
  }

  res.json({
    success: true,
    data: {
      valid: true,
      user
    }
  });
}));

// 登出（客户端处理，服务端记录日志）
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
  // 这里可以添加日志记录
  console.log(`用户 ${req.user!.email} 已登出`);

  res.json({
    success: true,
    message: '登出成功'
  });
}));

export default router;
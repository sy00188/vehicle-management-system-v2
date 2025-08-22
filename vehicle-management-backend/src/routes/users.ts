import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError, ConflictError } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 获取用户列表（分页）
router.get('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const search = req.query.search as string;
  const role = req.query.role as string;
  const status = req.query.status as string;

  const skip = (page - 1) * pageSize;

  // 构建查询条件
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { username: { contains: search } },
      { phone: { contains: search } }
    ];
  }

  if (role) {
    where.role = role.toUpperCase();
  }

  if (status) {
    where.status = status.toUpperCase();
  }

  // 获取总数和用户列表
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
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
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  });
}));

// 获取单个用户详情
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user!;

  // 检查权限：只有管理员或用户本人可以查看详情
  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER' && currentUser.id !== id) {
    throw new ValidationError('无权限查看该用户信息');
  }

  const user = await prisma.user.findUnique({
    where: { id },
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

  if (!user) {
    throw new NotFoundError('用户不存在');
  }

  res.json({
    success: true,
    data: user
  });
}));

// 创建用户
router.post('/', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
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
  const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

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

  res.status(201).json({
    success: true,
    message: '用户创建成功',
    data: user
  });
}));

// 更新用户信息
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user!;
  const { name, phone, avatar } = req.body;

  // 检查权限：只有管理员或用户本人可以更新信息
  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER' && currentUser.id !== id) {
    throw new ValidationError('无权限修改该用户信息');
  }

  // 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new NotFoundError('用户不存在');
  }

  // 构建更新数据
  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (avatar !== undefined) updateData.avatar = avatar;

  // 更新用户
  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    message: '用户信息更新成功',
    data: user
  });
}));

// 更新用户角色和状态（仅管理员）
router.patch('/:id/admin', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  // 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new NotFoundError('用户不存在');
  }

  // 构建更新数据
  const updateData: any = {};
  if (role !== undefined) {
    const validRoles = ['USER', 'DRIVER', 'MANAGER', 'ADMIN'];
    if (!validRoles.includes(role.toUpperCase())) {
      throw new ValidationError('无效的用户角色');
    }
    updateData.role = role.toUpperCase();
  }
  
  if (status !== undefined) {
    const validStatuses = ['ACTIVE', 'INACTIVE'];
    if (!validStatuses.includes(status.toUpperCase())) {
      throw new ValidationError('无效的用户状态');
    }
    updateData.status = status.toUpperCase();
  }

  // 更新用户
  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    message: '用户信息更新成功',
    data: user
  });
}));

// 重置用户密码（仅管理员）
router.patch('/:id/reset-password', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ValidationError('新密码为必填项');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('密码长度至少为6位');
  }

  // 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new NotFoundError('用户不存在');
  }

  // 加密新密码
  const hashedPassword = await bcrypt.hash(newPassword, config.bcryptRounds);

  // 更新密码
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  });

  res.json({
    success: true,
    message: '密码重置成功'
  });
}));

// 删除用户（仅管理员）
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user!;

  // 不能删除自己
  if (currentUser.id === id) {
    throw new ValidationError('不能删除自己的账户');
  }

  // 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new NotFoundError('用户不存在');
  }

  // 软删除：将状态设为INACTIVE
  await prisma.user.update({
    where: { id },
    data: { status: 'INACTIVE' }
  });

  res.json({
    success: true,
    message: '用户删除成功'
  });
}));

// 获取用户统计信息
router.get('/stats/overview', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const [totalUsers, activeUsers, usersByRole] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    })
  ]);

  const roleStats = usersByRole.reduce((acc: Record<string, number>, item: any) => {
    acc[item.role] = item._count.role;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleStats
    }
  });
}));

export default router;
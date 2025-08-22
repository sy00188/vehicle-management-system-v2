import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 获取费用记录列表（分页）
router.get('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const search = req.query.search as string;
  const type = req.query.type as string;
  const vehicleId = req.query.vehicleId as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  const skip = (page - 1) * pageSize;

  // 构建查询条件
  const where: any = {};

  if (search) {
    where.OR = [
      { description: { contains: search } },
      { vendor: { contains: search } },
      { vehicle: { plateNumber: { contains: search } } },
      { vehicle: { brand: { contains: search } } },
      { vehicle: { model: { contains: search } } }
    ];
  }

  if (type) {
    where.type = type.toUpperCase();
  }

  if (vehicleId) {
    where.vehicleId = vehicleId;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      where.date.gte = new Date(startDate);
    }
    if (endDate) {
      where.date.lte = new Date(endDate);
    }
  }

  // 获取总数和费用记录列表
  const [total, expenses] = await Promise.all([
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            brand: true,
            model: true,
            fuelType: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  res.json({
    success: true,
    data: {
      expenses,
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

// 获取单个费用记录详情
router.get('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      vehicle: {
        select: {
          id: true,
          plateNumber: true,
          brand: true,
          model: true,
          fuelType: true
        }
      }
    }
  });

  if (!expense) {
    throw new NotFoundError('费用记录不存在');
  }

  res.json({
    success: true,
    data: expense
  });
}));

// 创建费用记录
router.post('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const {
    vehicleId,
    type,
    amount,
    description,
    vendor,
    date,
    receiptNumber,
    notes
  } = req.body;

  // 验证必填字段
  if (!vehicleId || !type || !amount || !description) {
    throw new ValidationError('车辆ID、费用类型、金额和描述为必填项');
  }

  // 检查车辆是否存在
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  });

  if (!vehicle) {
    throw new NotFoundError('指定的车辆不存在');
  }

  // 验证金额
  const expenseAmount = parseFloat(amount);
  if (expenseAmount <= 0) {
    throw new ValidationError('费用金额必须大于0');
  }

  // 验证日期
  const expenseDate = date ? new Date(date) : new Date();
  const now = new Date();
  if (expenseDate > now) {
    throw new ValidationError('费用日期不能是未来日期');
  }

  // 创建费用记录
  const expense = await prisma.expense.create({
    data: {
      title: `${type} - ${vehicle.plateNumber}`,
      vehicleId,
      type: type.toUpperCase(),
      amount: expenseAmount,
      description,
      vendor,
      date: expenseDate,
      invoiceNumber: receiptNumber,
      notes,
      createdById: req.user!.id
    },
    include: {
      vehicle: {
        select: {
          id: true,
          plateNumber: true,
          brand: true,
          model: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: '费用记录创建成功',
    data: expense
  });
}));

// 更新费用记录
router.put('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    type,
    amount,
    description,
    vendor,
    date,
    receipt,
    notes
  } = req.body;

  // 检查费用记录是否存在
  const existingExpense = await prisma.expense.findUnique({
    where: { id }
  });

  if (!existingExpense) {
    throw new NotFoundError('费用记录不存在');
  }

  // 验证金额（如果提供）
  if (amount !== undefined) {
    const expenseAmount = parseFloat(amount);
    if (expenseAmount <= 0) {
      throw new ValidationError('费用金额必须大于0');
    }
  }

  // 验证日期（如果提供）
  if (date !== undefined) {
    const expenseDate = new Date(date);
    const now = new Date();
    if (expenseDate > now) {
      throw new ValidationError('费用日期不能是未来日期');
    }
  }

  // 构建更新数据
  const updateData: any = {};
  if (type !== undefined) updateData.type = type.toUpperCase();
  if (amount !== undefined) updateData.amount = parseFloat(amount);
  if (description !== undefined) updateData.description = description;
  if (vendor !== undefined) updateData.vendor = vendor;
  if (date !== undefined) updateData.date = new Date(date);
  if (receipt !== undefined) updateData.receipt = receipt;
  if (notes !== undefined) updateData.notes = notes;

  // 更新费用记录
  const expense = await prisma.expense.update({
    where: { id },
    data: updateData,
    include: {
      vehicle: {
        select: {
          id: true,
          plateNumber: true,
          brand: true,
          model: true
        }
      }
    }
  });

  res.json({
    success: true,
    message: '费用记录更新成功',
    data: expense
  });
}));

// 删除费用记录
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 检查费用记录是否存在
  const existingExpense = await prisma.expense.findUnique({
    where: { id }
  });

  if (!existingExpense) {
    throw new NotFoundError('费用记录不存在');
  }

  // 删除费用记录
  await prisma.expense.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: '费用记录删除成功'
  });
}));

// 获取费用统计信息
router.get('/stats/overview', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const [totalExpenses, expensesByType, monthlyExpenses, totalAmount] = await Promise.all([
    prisma.expense.count(),
    prisma.expense.groupBy({
      by: ['type'],
      _count: { type: true },
      _sum: { amount: true }
    }),
    prisma.expense.groupBy({
      by: ['date'],
      _sum: { amount: true },
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
        }
      }
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      _avg: { amount: true }
    })
  ]);

  const typeStats = expensesByType.reduce((acc: Record<string, any>, item: any) => {
    acc[item.type] = {
      count: item._count.type,
      totalAmount: item._sum.amount || 0
    };
    return acc;
  }, {} as Record<string, any>);

  // 处理月度费用数据
  const monthlyStats = monthlyExpenses.reduce((acc: Record<string, number>, item: any) => {
    const month = new Date(item.date).toISOString().slice(0, 7); // YYYY-MM格式
    acc[month] = (acc[month] || 0) + (item._sum.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      totalExpenses,
      typeStats,
      monthlyStats,
      totalAmount: totalAmount._sum.amount || 0,
      averageAmount: totalAmount._avg.amount || 0
    }
  });
}));

// 获取车辆费用历史
router.get('/vehicle/:vehicleId/history', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const type = req.query.type as string;

  const skip = (page - 1) * pageSize;

  // 检查车辆是否存在
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  });

  if (!vehicle) {
    throw new NotFoundError('车辆不存在');
  }

  const where: any = { vehicleId };
  if (type) {
    where.type = type.toUpperCase();
  }

  const [total, expenses, totalAmount] = await Promise.all([
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { date: 'desc' }
    }),
    prisma.expense.aggregate({
      where,
      _sum: { amount: true }
    })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  res.json({
    success: true,
    data: {
      vehicle: {
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        brand: vehicle.brand,
        model: vehicle.model
      },
      expenses,
      totalAmount: totalAmount._sum.amount || 0,
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

// 获取费用报告
router.get('/reports/summary', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  const vehicleId = req.query.vehicleId as string;

  // 构建查询条件
  const where: any = {};

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      where.date.gte = new Date(startDate);
    }
    if (endDate) {
      where.date.lte = new Date(endDate);
    }
  }

  if (vehicleId) {
    where.vehicleId = vehicleId;
  }

  const [expensesByType, expensesByVehicle, totalStats] = await Promise.all([
    prisma.expense.groupBy({
      by: ['type'],
      where,
      _count: { type: true },
      _sum: { amount: true },
      _avg: { amount: true }
    }),
    prisma.expense.groupBy({
      by: ['vehicleId'],
      where,
      _count: { vehicleId: true },
      _sum: { amount: true }
    }),
    prisma.expense.aggregate({
      where,
      _count: true,
      _sum: { amount: true },
      _avg: { amount: true }
    })
  ]);

  // 获取车辆信息
  const vehicleIds = expensesByVehicle.map((item: any) => item.vehicleId);
  const vehicles = await prisma.vehicle.findMany({
    where: {
      id: { in: vehicleIds }
    },
    select: {
      id: true,
      plateNumber: true,
      brand: true,
      model: true
    }
  });

  const vehicleMap = vehicles.reduce((acc: Record<string, any>, vehicle: any) => {
    acc[vehicle.id] = vehicle;
    return acc;
  }, {} as Record<string, any>);

  const vehicleStats = expensesByVehicle.map((item: any) => ({
    vehicle: vehicleMap[item.vehicleId],
    count: item._count.vehicleId,
    totalAmount: item._sum.amount || 0
  }));

  const typeStats = expensesByType.reduce((acc: Record<string, any>, item: any) => {
    acc[item.type] = {
      count: item._count.type,
      totalAmount: item._sum.amount || 0,
      averageAmount: item._avg.amount || 0
    };
    return acc;
  }, {} as Record<string, any>);

  res.json({
    success: true,
    data: {
      summary: {
        totalCount: totalStats._count,
        totalAmount: totalStats._sum.amount || 0,
        averageAmount: totalStats._avg.amount || 0
      },
      typeStats,
      vehicleStats
    }
  });
}));

export default router;
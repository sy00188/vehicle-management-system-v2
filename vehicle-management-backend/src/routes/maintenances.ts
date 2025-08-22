import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 获取维护记录列表（分页）
router.get('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const search = req.query.search as string;
  const status = req.query.status as string;
  const type = req.query.type as string;
  const vehicleId = req.query.vehicleId as string;

  const skip = (page - 1) * pageSize;

  // 构建查询条件
  const where: any = {};

  if (search) {
    where.OR = [
      { description: { contains: search } },
      { serviceProvider: { contains: search } },
      { vehicle: { plateNumber: { contains: search } } },
      { vehicle: { brand: { contains: search } } },
      { vehicle: { model: { contains: search } } }
    ];
  }

  if (status) {
    where.status = status.toUpperCase();
  }

  if (type) {
    where.type = type.toUpperCase();
  }

  if (vehicleId) {
    where.vehicleId = vehicleId;
  }

  // 获取总数和维护记录列表
  const [total, maintenances] = await Promise.all([
    prisma.maintenance.count({ where }),
    prisma.maintenance.findMany({
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
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  res.json({
    success: true,
    data: {
      maintenances,
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

// 获取单个维护记录详情
router.get('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const maintenance = await prisma.maintenance.findUnique({
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

  if (!maintenance) {
    throw new NotFoundError('维护记录不存在');
  }

  res.json({
    success: true,
    data: maintenance
  });
}));

// 创建维护记录
router.post('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const {
    vehicleId,
    type,
    description,
    scheduledDate,
    completedDate,
    mileage,
    cost,
    serviceProvider,
    notes,
  } = req.body;

  // 验证必填字段
  if (!vehicleId || !type || !description) {
    throw new ValidationError('车辆ID、维护类型和描述为必填项');
  }

  // 检查车辆是否存在
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  });

  if (!vehicle) {
    throw new NotFoundError('指定的车辆不存在');
  }

  // 验证日期
  if (scheduledDate && completedDate) {
    const scheduled = new Date(scheduledDate);
    const completed = new Date(completedDate);
    
    if (completed < scheduled) {
      throw new ValidationError('完成日期不能早于计划日期');
    }
  }

  // 验证里程数
  if (mileage && mileage < 0) {
    throw new ValidationError('维护里程数不能为负数');
  }

  // 创建维护记录
  const maintenance = await prisma.maintenance.create({
    data: {
      title: `${type} - ${vehicle.plateNumber}`,
      vehicleId,
      type: type.toUpperCase(),
      description,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      completedDate: completedDate ? new Date(completedDate) : null,
      mileage: mileage ? parseInt(mileage) : null,
      cost: cost ? parseFloat(cost) : 0,
      vendor: serviceProvider,
      notes,
      createdById: req.user!.id,
      status: completedDate ? 'COMPLETED' : 'PENDING'
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
    message: '维护记录创建成功',
    data: maintenance
  });
}));

// 更新维护记录
router.put('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    type,
    description,
    scheduledDate,
    completedDate,
    mileage,
    cost,
    serviceProvider,
    notes,

    status
  } = req.body;

  // 检查维护记录是否存在
  const existingMaintenance = await prisma.maintenance.findUnique({
    where: { id },
    include: {
      vehicle: true
    }
  });

  if (!existingMaintenance) {
    throw new NotFoundError('维护记录不存在');
  }

  // 验证日期
  if (scheduledDate && completedDate) {
    const scheduled = new Date(scheduledDate);
    const completed = new Date(completedDate);
    
    if (completed < scheduled) {
      throw new ValidationError('完成日期不能早于计划日期');
    }
  }

  // 验证里程数
  if (mileage && mileage < 0) {
    throw new ValidationError('维护里程数不能为负数');
  }

  // 构建更新数据
  const updateData: any = {};
  if (type !== undefined) updateData.type = type.toUpperCase();
  if (description !== undefined) updateData.description = description;
  if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
  if (completedDate !== undefined) updateData.completedDate = completedDate ? new Date(completedDate) : null;
  if (mileage !== undefined) updateData.mileage = mileage ? parseInt(mileage) : null;
  if (cost !== undefined) updateData.cost = cost ? parseFloat(cost) : null;
  if (serviceProvider !== undefined) updateData.serviceProvider = serviceProvider;
  if (notes !== undefined) updateData.notes = notes;

  if (status !== undefined) updateData.status = status.toUpperCase();

  // 更新维护记录
  const maintenance = await prisma.maintenance.update({
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
    message: '维护记录更新成功',
    data: maintenance
  });
}));

// 删除维护记录
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 检查维护记录是否存在
  const existingMaintenance = await prisma.maintenance.findUnique({
    where: { id }
  });

  if (!existingMaintenance) {
    throw new NotFoundError('维护记录不存在');
  }

  // 删除维护记录
  await prisma.maintenance.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: '维护记录删除成功'
  });
}));

// 完成维护
router.post('/:id/complete', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completedDate, mileage, cost, notes } = req.body;

  // 检查维护记录是否存在
  const maintenance = await prisma.maintenance.findUnique({
    where: { id },
    include: {
      vehicle: true
    }
  });

  if (!maintenance) {
    throw new NotFoundError('维护记录不存在');
  }

  if (maintenance.status === 'COMPLETED') {
    throw new ValidationError('维护记录已经完成');
  }

  // 验证完成日期
  const completed = completedDate ? new Date(completedDate) : new Date();
  if (maintenance.scheduledDate && completed < maintenance.scheduledDate) {
    throw new ValidationError('完成日期不能早于计划日期');
  }

  // 验证里程数
  if (mileage && mileage < 0) {
    throw new ValidationError('维护里程数不能为负数');
  }

  // 更新维护记录为完成状态
  const updatedMaintenance = await prisma.maintenance.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      completedDate: completed,
      mileage: mileage ? parseInt(mileage) : maintenance.mileage,
      cost: cost ? parseFloat(cost) : maintenance.cost,
      notes: notes || maintenance.notes
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

  res.json({
    success: true,
    message: '维护记录已标记为完成',
    data: updatedMaintenance
  });
}));

// 获取维护统计信息
router.get('/stats/overview', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const [totalMaintenances, maintenancesByStatus, maintenancesByType, costStats] = await Promise.all([
    prisma.maintenance.count(),
    prisma.maintenance.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.maintenance.groupBy({
      by: ['type'],
      _count: { type: true }
    }),
    prisma.maintenance.aggregate({
      _sum: { cost: true },
      _avg: { cost: true },
      where: {
        cost: { gt: 0 }
      }
    })
  ]);

  const statusStats = maintenancesByStatus.reduce((acc: Record<string, number>, item: any) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  const typeStats = maintenancesByType.reduce((acc: Record<string, number>, item: any) => {
    acc[item.type] = item._count.type;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      totalMaintenances,
      statusStats,
      typeStats,
      costStats: {
        totalCost: costStats._sum?.cost || 0,
        averageCost: costStats._avg?.cost || 0
      }
    }
  });
}));

// 获取车辆维护历史
router.get('/vehicle/:vehicleId/history', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);

  const skip = (page - 1) * pageSize;

  // 检查车辆是否存在
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  });

  if (!vehicle) {
    throw new NotFoundError('车辆不存在');
  }

  const [total, maintenances] = await Promise.all([
    prisma.maintenance.count({ where: { vehicleId } }),
    prisma.maintenance.findMany({
      where: { vehicleId },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
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
      maintenances,
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

// 获取即将到期的维护
router.get('/upcoming/list', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days as string) || 30; // 默认30天内
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const upcomingMaintenances = await prisma.maintenance.findMany({
    where: {
      status: 'PENDING',
      scheduledDate: {
        lte: futureDate
      }
    },
    include: {
      vehicle: {
        select: {
          id: true,
          plateNumber: true,
          brand: true,
          model: true,

        }
      }
    },
    orderBy: {
      scheduledDate: 'asc'
    }
  });

  res.json({
    success: true,
    data: {
      upcomingMaintenances,
      count: upcomingMaintenances.length
    }
  });
}));

export default router;
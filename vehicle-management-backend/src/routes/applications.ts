import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError, ConflictError } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 获取申请列表（分页）
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const search = req.query.search as string;
  const status = req.query.status as string;
  const type = req.query.type as string;
  const userId = req.query.userId as string;

  const skip = (page - 1) * pageSize;

  // 构建查询条件
  const where: any = {};
  
  // 普通用户只能查看自己的申请
  if (req.user?.role === 'USER') {
    where.applicantId = req.user.id;
  } else if (userId) {
    where.applicantId = userId;
  }

  if (search) {
    where.OR = [
      { purpose: { contains: search } },
      { destination: { contains: search } },
      { user: { name: { contains: search } } },
      { vehicle: { plateNumber: { contains: search } } }
    ];
  }

  if (status) {
    where.status = status.toUpperCase();
  }

  if (type) {
    where.type = type.toUpperCase();
  }

  // 获取总数和申请列表
  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        },
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            brand: true,
            model: true,
            fuelType: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            licenseNumber: true,
            phone: true
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
      applications,
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

// 获取单个申请详情
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
          phone: true
        }
      },
      vehicle: {
        select: {
          id: true,
          plateNumber: true,
          brand: true,
          model: true,
          fuelType: true,
          seats: true
        }
      },
      driver: {
        select: {
          id: true,
          name: true,
          licenseNumber: true,
          phone: true
        }
      }
    }
  });

  if (!application) {
    throw new NotFoundError('申请不存在');
  }

  // 权限检查：普通用户只能查看自己的申请
  if (req.user?.role === 'USER' && application.applicantId !== req.user.id) {
    throw new ValidationError('无权查看此申请');
  }

  res.json({
    success: true,
    data: application
  });
}));

// 创建申请
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const {
    title,
    vehicleId,
    driverId,
    purpose,
    destination,
    passengers,
    startTime,
    endTime,
    notes
  } = req.body;

  // 验证必填字段
  if (!title || !purpose || !destination || !startTime || !endTime) {
    throw new ValidationError('申请标题、用途、目的地、开始时间和结束时间为必填项');
  }

  // 验证时间
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (start <= now) {
    throw new ValidationError('开始时间必须晚于当前时间');
  }

  if (end <= start) {
    throw new ValidationError('结束时间必须晚于开始时间');
  }

  // 如果指定了车辆，检查车辆可用性
  if (vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      throw new NotFoundError('指定的车辆不存在');
    }

    if (vehicle.status !== 'AVAILABLE') {
      throw new ValidationError('指定的车辆当前不可用');
    }

    // 检查时间冲突
    const conflictingApplication = await prisma.application.findFirst({
      where: {
        vehicleId,
        status: {
          in: ['PENDING', 'APPROVED']
        },
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gte: start } }
            ]
          },
          {
            AND: [
              { startTime: { lte: end } },
              { endTime: { gte: end } }
            ]
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } }
            ]
          }
        ]
      }
    });

    if (conflictingApplication) {
      throw new ConflictError('指定时间段内车辆已被申请');
    }
  }

  // 如果指定了驾驶员，检查驾驶员可用性
  if (driverId) {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!driver) {
      throw new NotFoundError('指定的驾驶员不存在');
    }

    if (driver.status !== 'AVAILABLE' && driver.status !== 'BUSY') {
      throw new ValidationError('指定的驾驶员当前不可用');
    }

    // 检查驾驶员时间冲突
    const conflictingApplication = await prisma.application.findFirst({
      where: {
        driverId,
        status: {
          in: ['PENDING', 'APPROVED']
        },
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gte: start } }
            ]
          },
          {
            AND: [
              { startTime: { lte: end } },
              { endTime: { gte: end } }
            ]
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } }
            ]
          }
        ]
      }
    });

    if (conflictingApplication) {
      throw new ConflictError('指定时间段内驾驶员已被申请');
    }
  }

  // 创建申请
  const application = await prisma.application.create({
    data: {
      applicantId: req.user!.id,
      title,
      vehicleId,
      driverId,
      purpose,
      destination,
      passengers: passengers ? parseInt(passengers) : undefined,
      startTime: start,
      endTime: end,
      notes
    },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true
        }
      },
      vehicle: {
        select: {
          id: true,
          plateNumber: true,
          brand: true,
          model: true
        }
      },
      driver: {
        select: {
          id: true,
          name: true,
          licenseNumber: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: '申请提交成功',
    data: application
  });
}));

// 更新申请
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    type,
    vehicleId,
    driverId,
    purpose,
    destination,
    passengers,
    startTime,
    endTime,
    estimatedMileage,
    notes
  } = req.body;

  // 检查申请是否存在
  const existingApplication = await prisma.application.findUnique({
    where: { id }
  });

  if (!existingApplication) {
    throw new NotFoundError('申请不存在');
  }

  // 权限检查：只有申请人或管理员可以修改
  if (req.user?.role === 'USER' && existingApplication.applicantId !== req.user.id) {
    throw new ValidationError('无权修改此申请');
  }

  // 只有待审批状态的申请可以修改
  if (existingApplication.status !== 'PENDING') {
    throw new ValidationError('只有待审批状态的申请可以修改');
  }

  // 验证时间（如果提供）
  if (startTime || endTime) {
    const start = startTime ? new Date(startTime) : existingApplication.startTime;
    const end = endTime ? new Date(endTime) : existingApplication.endTime;
    const now = new Date();

    if (start <= now) {
      throw new ValidationError('开始时间必须晚于当前时间');
    }

    if (end <= start) {
      throw new ValidationError('结束时间必须晚于开始时间');
    }
  }

  // 构建更新数据
  const updateData: any = {};
  if (type !== undefined) updateData.type = type.toUpperCase();
  if (vehicleId !== undefined) updateData.vehicleId = vehicleId;
  if (driverId !== undefined) updateData.driverId = driverId;
  if (purpose !== undefined) updateData.purpose = purpose;
  if (destination !== undefined) updateData.destination = destination;
  if (passengers !== undefined) updateData.passengers = passengers ? parseInt(passengers) : null;
  if (startTime !== undefined) updateData.startTime = new Date(startTime);
  if (endTime !== undefined) updateData.endTime = new Date(endTime);
  if (estimatedMileage !== undefined) updateData.estimatedMileage = estimatedMileage ? parseFloat(estimatedMileage) : null;
  if (notes !== undefined) updateData.notes = notes;

  // 更新申请
  const application = await prisma.application.update({
    where: { id },
    data: updateData,
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true
        }
      },
      vehicle: {
        select: {
          id: true,
          plateNumber: true,
          brand: true,
          model: true
        }
      },
      driver: {
        select: {
          id: true,
          name: true,
          licenseNumber: true
        }
      }
    }
  });

  res.json({
    success: true,
    message: '申请更新成功',
    data: application
  });
}));

// 取消申请
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 检查申请是否存在
  const existingApplication = await prisma.application.findUnique({
    where: { id }
  });

  if (!existingApplication) {
    throw new NotFoundError('申请不存在');
  }

  // 权限检查：只有申请人或管理员可以取消
  if (req.user?.role === 'USER' && existingApplication.applicantId !== req.user.id) {
    throw new ValidationError('无权取消此申请');
  }

  // 只有待审批或已批准状态的申请可以取消
  if (!['PENDING', 'APPROVED'].includes(existingApplication.status)) {
    throw new ValidationError('当前状态的申请无法取消');
  }

  // 更新申请状态为已取消
  await prisma.application.update({
    where: { id },
    data: { status: 'CANCELLED' }
  });

  res.json({
    success: true,
    message: '申请已取消'
  });
}));

// 审批申请
router.post('/:id/approve', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, comments } = req.body;

  if (!action || !['APPROVE', 'REJECT'].includes(action.toUpperCase())) {
    throw new ValidationError('审批动作必须是APPROVE或REJECT');
  }

  // 检查申请是否存在
  const application = await prisma.application.findUnique({
    where: { id },
    include: {

      vehicle: true,
      driver: true
    }
  });

  if (!application) {
    throw new NotFoundError('申请不存在');
  }

  // 只有待审批状态的申请可以审批
  if (application.status !== 'PENDING') {
    throw new ValidationError('只有待审批状态的申请可以审批');
  }



  const approvalAction = action.toUpperCase();
  let newStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' = application.status;

  // 创建审批记录
  // 审批记录功能暂时移除
  /*
  await prisma.approval.create({
    data: {
      applicationId: id,
      approverId: req.user!.id,
      action: approvalAction,
      comments
    }
  });
  */

  // 根据审批结果更新申请状态
  if (approvalAction === 'APPROVE') {
    newStatus = 'APPROVED';
    
    // 如果批准，创建使用记录
    // 创建使用记录功能暂时移除
    /*
    await prisma.usageRecord.create({
      data: {
        applicationId: id,
        userId: application.applicantId,
        vehicleId: application.vehicleId,
        driverId: application.driverId,
        purpose: application.purpose,
        destination: application.destination,
        startTime: application.startTime,
        endTime: application.endTime,
        status: 'SCHEDULED'
      }
    });
    */
  } else {
    newStatus = 'REJECTED';
  }

  // 更新申请状态
  const updatedApplication = await prisma.application.update({
    where: { id },
    data: { status: newStatus },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },

    }
  });

  res.json({
    success: true,
    message: `申请${approvalAction === 'APPROVE' ? '批准' : '拒绝'}成功`,
    data: updatedApplication
  });
}));

// 获取申请统计信息
router.get('/stats/overview', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const [totalApplications, applicationsByStatus, applicationsByType] = await Promise.all([
    prisma.application.count(),
    prisma.application.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.application.groupBy({
      by: ['status'],
      _count: { status: true }
    })
  ]);

  const statusStats = applicationsByStatus.reduce((acc: Record<string, number>, item: any) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  const typeStats = applicationsByType.reduce((acc: Record<string, number>, item: any) => {
    acc[item.type] = item._count.type;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      totalApplications,
      statusStats,
      typeStats
    }
  });
}));

// 获取我的申请列表
router.get('/my/list', authMiddleware, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const status = req.query.status as string;

  const skip = (page - 1) * pageSize;

  const where: any = {
    applicantId: req.user!.id
  };

  if (status) {
    where.status = status.toUpperCase();
  }

  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        vehicle: {
          select: {
            id: true,
            plateNumber: true,
            brand: true,
            model: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },

      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  res.json({
    success: true,
    data: {
      applications,
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

export default router;
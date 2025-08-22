import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError, ConflictError } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 获取驾驶员列表（分页）
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const search = req.query.search as string;
  const status = req.query.status as string;

  const skip = (page - 1) * pageSize;

  // 构建查询条件
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { licenseNumber: { contains: search } },
      { phone: { contains: search } },
      { idCard: { contains: search } }
    ];
  }

  if (status) {
    where.status = status.toUpperCase();
  }

  // 获取总数和驾驶员列表
  const [total, drivers] = await Promise.all([
    prisma.driver.count({ where }),
    prisma.driver.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        assignments: {
          where: {
            status: 'ACTIVE'
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
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(total / pageSize);

  res.json({
    success: true,
    data: {
      drivers,
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

// 获取单个驾驶员详情
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const driver = await prisma.driver.findUnique({
    where: { id },
    include: {
      assignments: {
        orderBy: { createdAt: 'desc' },
        take: 10,
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
      }
    }
  });

  if (!driver) {
    throw new NotFoundError('驾驶员不存在');
  }

  res.json({
    success: true,
    data: driver
  });
}));

// 创建驾驶员
router.post('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const {
    name,
    licenseNumber,
    licenseType,
    licenseExpiry,
    phone,
    idCard,
    address,
    emergencyContact,
    emergencyPhone,
    hireDate,
    salary
  } = req.body;

  // 验证必填字段
  if (!name || !licenseNumber || !licenseType || !licenseExpiry || !phone || !idCard) {
    throw new ValidationError('姓名、驾驶证号、驾驶证类型、驾驶证到期日期、电话和身份证号为必填项');
  }

  // 检查驾驶证号是否已存在
  const existingDriverByLicense = await prisma.driver.findUnique({
    where: { licenseNumber }
  });

  if (existingDriverByLicense) {
    throw new ConflictError('驾驶证号已存在');
  }

  // 检查身份证号是否已存在
  const existingDriverByIdCard = await prisma.driver.findUnique({
    where: { idCard }
  });

  if (existingDriverByIdCard) {
    throw new ConflictError('身份证号已存在');
  }

  // 检查电话号码是否已存在
  const existingDriverByPhone = await prisma.driver.findFirst({
    where: { phone }
  });

  if (existingDriverByPhone) {
    throw new ConflictError('电话号码已存在');
  }

  // 创建驾驶员
  const driver = await prisma.driver.create({
    data: {
      name,
      licenseNumber,
      licenseType: licenseType.toUpperCase(),
      licenseExpiry: new Date(licenseExpiry),
      phone,
      idCard,
      address,
      emergencyContact,
      emergencyPhone,
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      salary: salary ? parseFloat(salary) : null,
      createdById: req.user!.id
    }
  });

  res.status(201).json({
    success: true,
    message: '驾驶员创建成功',
    data: driver
  });
}));

// 更新驾驶员信息
router.put('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    licenseNumber,
    licenseType,
    licenseExpiry,
    phone,
    idCard,
    address,
    emergencyContact,
    emergencyPhone,
    hireDate,
    salary,
    status
  } = req.body;

  // 检查驾驶员是否存在
  const existingDriver = await prisma.driver.findUnique({
    where: { id }
  });

  if (!existingDriver) {
    throw new NotFoundError('驾驶员不存在');
  }

  // 检查驾驶证号冲突
  if (licenseNumber && licenseNumber !== existingDriver.licenseNumber) {
    const duplicateDriver = await prisma.driver.findUnique({
      where: { licenseNumber }
    });

    if (duplicateDriver) {
      throw new ConflictError('驾驶证号已存在');
    }
  }

  // 检查身份证号冲突
  if (idCard && idCard !== existingDriver.idCard) {
    const duplicateDriver = await prisma.driver.findUnique({
      where: { idCard }
    });

    if (duplicateDriver) {
      throw new ConflictError('身份证号已存在');
    }
  }

  // 检查电话号码冲突
  if (phone && phone !== existingDriver.phone) {
    const duplicateDriver = await prisma.driver.findFirst({
      where: { phone }
    });

    if (duplicateDriver) {
      throw new ConflictError('电话号码已存在');
    }
  }

  // 构建更新数据
  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (licenseNumber !== undefined) updateData.licenseNumber = licenseNumber;
  if (licenseType !== undefined) updateData.licenseType = licenseType.toUpperCase();
  if (licenseExpiry !== undefined) updateData.licenseExpiry = new Date(licenseExpiry);
  if (phone !== undefined) updateData.phone = phone;
  if (idCard !== undefined) updateData.idCard = idCard;
  if (address !== undefined) updateData.address = address;
  if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
  if (emergencyPhone !== undefined) updateData.emergencyPhone = emergencyPhone;
  if (hireDate !== undefined) updateData.hireDate = hireDate ? new Date(hireDate) : null;
  if (salary !== undefined) updateData.salary = salary ? parseFloat(salary) : null;
  if (status !== undefined) updateData.status = status.toUpperCase();
  
  // 添加更新者ID
  updateData.updatedById = req.user!.id;

  // 更新驾驶员
  const driver = await prisma.driver.update({
    where: { id },
    data: updateData,
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
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
      }
    }
  });

  res.json({
    success: true,
    message: '驾驶员信息更新成功',
    data: driver
  });
}));

// 删除驾驶员
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 检查驾驶员是否存在
  const existingDriver = await prisma.driver.findUnique({
    where: { id },
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
        }
      }
    }
  });

  if (!existingDriver) {
    throw new NotFoundError('驾驶员不存在');
  }

  // 检查是否有活跃的车辆分配
  if (existingDriver.assignments.length > 0) {
    throw new ValidationError('驾驶员当前有分配的车辆，无法删除');
  }

  // 软删除：将状态设为INACTIVE
  await prisma.driver.update({
    where: { id },
    data: { status: 'INACTIVE' }
  });

  res.json({
    success: true,
    message: '驾驶员删除成功'
  });
}));

// 获取驾驶员统计信息
router.get('/stats/overview', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const [totalDrivers, driversByStatus] = await Promise.all([
    prisma.driver.count(),
    prisma.driver.groupBy({
      by: ['status'],
      _count: { status: true }
    })
  ]);

  const statusStats = driversByStatus.reduce((acc: Record<string, number>, item: any) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      totalDrivers,
      statusStats
    }
  });
}));

// 获取可用驾驶员列表
router.get('/available/list', authMiddleware, asyncHandler(async (req, res) => {
  const drivers = await prisma.driver.findMany({
    where: {
      status: 'AVAILABLE'
    },
    select: {
      id: true,
      name: true,
      licenseNumber: true,
      licenseType: true,
      phone: true
    },
    orderBy: { name: 'asc' }
  });

  res.json({
    success: true,
    data: drivers
  });
}));

// 分配车辆给驾驶员
router.post('/:id/assign-vehicle', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vehicleId } = req.body;

  if (!vehicleId) {
    throw new ValidationError('车辆ID为必填项');
  }

  // 检查驾驶员是否存在且可用
  const driver = await prisma.driver.findUnique({
    where: { id }
  });

  if (!driver) {
    throw new NotFoundError('驾驶员不存在');
  }

  if (driver.status !== 'AVAILABLE') {
    throw new ValidationError('驾驶员当前不可用');
  }

  // 检查车辆是否存在且可用
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
        }
      }
    }
  });

  if (!vehicle) {
    throw new NotFoundError('车辆不存在');
  }

  if (vehicle.status !== 'AVAILABLE') {
    throw new ValidationError('车辆当前不可用');
  }

  if (vehicle.assignments.length > 0) {
    throw new ValidationError('车辆已分配给其他驾驶员');
  }

  // 分配车辆
  await Promise.all([
    prisma.driver.update({
      where: { id },
      data: { status: 'BUSY' }
    }),
    prisma.driverVehicleAssignment.create({
      data: {
        driverId: id,
        vehicleId: vehicleId,
        status: 'ACTIVE',
        startDate: new Date()
      }
    }),
    prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'IN_USE' }
    })
  ]);

  res.json({
    success: true,
    message: '车辆分配成功'
  });
}));

// 取消驾驶员的车辆分配
router.post('/:id/unassign-vehicle', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 检查驾驶员是否存在
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
        },
        include: {
          vehicle: true
        }
      }
    }
  });

  if (!driver) {
    throw new NotFoundError('驾驶员不存在');
  }

  if (driver.assignments.length === 0) {
    throw new ValidationError('驾驶员当前没有分配车辆');
  }

  const activeAssignment = driver.assignments[0];

  // 取消分配
  await Promise.all([
    prisma.driver.update({
      where: { id },
      data: { status: 'AVAILABLE' }
    }),
    prisma.driverVehicleAssignment.update({
      where: { id: activeAssignment.id },
      data: {
        status: 'COMPLETED',
        endDate: new Date()
      }
    }),
    prisma.vehicle.update({
      where: { id: activeAssignment.vehicle.id },
      data: { status: 'AVAILABLE' }
    })
  ]);

  res.json({
    success: true,
    message: '车辆分配已取消'
  });
}));

export default router;
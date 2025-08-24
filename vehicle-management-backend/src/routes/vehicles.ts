import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError, ConflictError } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 获取车辆列表（分页）
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || config.defaultPageSize, config.maxPageSize);
  const search = req.query.search as string;
  const status = req.query.status as string;
  const type = req.query.type as string;

  const skip = (page - 1) * pageSize;

  // 构建查询条件
  const where: any = {};
  
  if (search) {
    where.OR = [
      { plateNumber: { contains: search } },
      { brand: { contains: search } },
      { model: { contains: search } },
      { vin: { contains: search } }
    ];
  }

  if (status) {
    where.status = status.toUpperCase();
  }

  if (type) {
    where.type = type.toUpperCase();
  }

  // 获取总数和车辆列表
  const [total, vehicles] = await Promise.all([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        assignments: {
          where: {
            status: 'ACTIVE'
          },
          select: {
            driver: {
              select: {
                id: true,
                name: true,
                licenseNumber: true
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
      vehicles,
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

// 获取单个车辆详情
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
        },
        select: {
          driver: {
            select: {
              id: true,
              name: true,
              licenseNumber: true,
              phone: true
            }
          }
        }
      },
      maintenances: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!vehicle) {
    throw new NotFoundError('车辆不存在');
  }

  res.json({
    success: true,
    data: vehicle
  });
}));

// 创建车辆
router.post('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const {
    plateNumber,
    brand,
    model,
    year,
    color,
    vin,
    type,
    seats,
    fuelType,
    displacement,
    purchaseDate,
    purchasePrice,
    insuranceExpiry,
    inspectionExpiry,
    driverId
  } = req.body;

  // 验证必填字段
  if (!plateNumber || !brand || !model || !year || !type) {
    throw new ValidationError('车牌号、品牌、型号、年份和车辆类型为必填项');
  }

  // 检查车牌号是否已存在
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { plateNumber }
  });

  if (existingVehicle) {
    throw new ConflictError('车牌号已存在');
  }

  // 如果指定了驾驶员，检查驾驶员是否存在且可用
  if (driverId) {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!driver) {
      throw new NotFoundError('指定的驾驶员不存在');
    }

    if (driver.status !== 'AVAILABLE') {
      throw new ValidationError('指定的驾驶员当前不可用');
    }
  }

  // 创建车辆
  const vehicle = await prisma.vehicle.create({
    data: {
      plateNumber,
      brand,
      model,
      year: parseInt(year),
      color,
      vin,
      fuelType: fuelType?.toUpperCase(),
      seats: seats ? parseInt(seats) : 4,
      displacement: displacement ? parseFloat(displacement) : null,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
      insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
      inspectionExpiry: inspectionExpiry ? new Date(inspectionExpiry) : null,
      createdById: req.user!.id
    },
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
        },
        select: {
          driver: {
            select: {
              id: true,
              name: true,
              licenseNumber: true
            }
          }
        }
      }
    }
  });

  // 如果分配了驾驶员，更新驾驶员状态
  if (driverId) {
    await prisma.driver.update({
      where: { id: driverId },
      data: { status: 'BUSY' }
    });
  }

  res.status(201).json({
    success: true,
    message: '车辆创建成功',
    data: vehicle
  });
}));

// 更新车辆信息
router.put('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    plateNumber,
    brand,
    model,
    year,
    color,
    vin,
    type,
    seats,
    fuelType,
    displacement,
    purchaseDate,
    purchasePrice,
    insuranceExpiry,
    inspectionExpiry,
    status,
    driverId
  } = req.body;

  // 检查车辆是否存在
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
        },
        select: {
          driver: true
        }
      }
    }
  });

  if (!existingVehicle) {
    throw new NotFoundError('车辆不存在');
  }

  // 如果更新车牌号，检查是否与其他车辆冲突
  if (plateNumber && plateNumber !== existingVehicle.plateNumber) {
    const duplicateVehicle = await prisma.vehicle.findUnique({
      where: { plateNumber }
    });

    if (duplicateVehicle) {
      throw new ConflictError('车牌号已存在');
    }
  }

  // 处理驾驶员变更
  const oldDriverId = existingVehicle.assignments[0]?.driver?.id;
  const newDriverId = driverId;

  if (oldDriverId !== newDriverId) {
    // 如果有新驾驶员，检查其可用性
    if (newDriverId) {
      const newDriver = await prisma.driver.findUnique({
        where: { id: newDriverId }
      });

      if (!newDriver) {
        throw new NotFoundError('指定的驾驶员不存在');
      }

      if (newDriver.status !== 'AVAILABLE') {
        throw new ValidationError('指定的驾驶员当前不可用');
      }
    }
  }

  // 构建更新数据
  const updateData: any = {};
  if (plateNumber !== undefined) updateData.plateNumber = plateNumber;
  if (brand !== undefined) updateData.brand = brand;
  if (model !== undefined) updateData.model = model;
  if (year !== undefined) updateData.year = parseInt(year);
  if (color !== undefined) updateData.color = color;
  if (vin !== undefined) updateData.vin = vin;
  if (seats !== undefined) updateData.seats = seats ? parseInt(seats) : 4;
  if (fuelType !== undefined) updateData.fuelType = fuelType?.toUpperCase();
  if (displacement !== undefined) updateData.displacement = displacement ? parseFloat(displacement) : null;
  if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate ? new Date(purchaseDate) : null;
  if (purchasePrice !== undefined) updateData.purchasePrice = purchasePrice ? parseFloat(purchasePrice) : null;
  if (insuranceExpiry !== undefined) updateData.insuranceExpiry = insuranceExpiry ? new Date(insuranceExpiry) : null;
  if (inspectionExpiry !== undefined) updateData.inspectionExpiry = inspectionExpiry ? new Date(inspectionExpiry) : null;
  if (status !== undefined) updateData.status = status.toUpperCase();
  // driverId will be handled separately through DriverVehicleAssignment

  // 更新车辆
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: updateData,
    include: {
      assignments: {
        where: {
          status: 'ACTIVE'
        },
        select: {
          driver: {
            select: {
              id: true,
              name: true,
              licenseNumber: true
            }
          }
        }
      }
    }
  });

  // 更新驾驶员分配
  if (oldDriverId !== newDriverId) {
    // 结束原有分配
    if (oldDriverId) {
      const oldAssignment = await prisma.driverVehicleAssignment.findFirst({
        where: {
          vehicleId: id,
          driverId: oldDriverId,
          status: 'ACTIVE'
        }
      });

      if (oldAssignment) {
        await prisma.driverVehicleAssignment.update({
          where: { id: oldAssignment.id },
          data: {
            status: 'COMPLETED',
            endDate: new Date()
          }
        });

        await prisma.driver.update({
          where: { id: oldDriverId },
          data: { status: 'AVAILABLE' }
        });
      }
    }

    // 创建新分配
    if (newDriverId) {
      await prisma.driverVehicleAssignment.create({
        data: {
          driverId: newDriverId,
          vehicleId: id,
          startDate: new Date(),
          status: 'ACTIVE'
        }
      });

      await prisma.driver.update({
        where: { id: newDriverId },
        data: { status: 'BUSY' }
      });
    }
  }

  res.json({
    success: true,
    message: '车辆信息更新成功',
    data: vehicle
  });
}));

// 删除车辆
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 检查车辆是否存在
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      applications: true,
      assignments: {
        where: {
          status: 'ACTIVE'
        }
      }
    }
  });

  if (!existingVehicle) {
    throw new NotFoundError('车辆不存在');
  }

  // 检查是否有未完成的申请或活跃的驾驶员分配
  const hasActiveAssignments = existingVehicle.assignments.length > 0;
  const hasActiveApplications = existingVehicle.applications.some(
    (app: any) => app.status === 'PENDING' || app.status === 'APPROVED'
  );

  if (hasActiveAssignments || hasActiveApplications) {
    throw new ValidationError('车辆有未完成的申请或活跃的驾驶员分配，无法删除');
  }

  // 释放驾驶员 - 通过DriverVehicleAssignment关系
  const activeAssignment = await prisma.driverVehicleAssignment.findFirst({
    where: {
      vehicleId: id,
      status: 'ACTIVE'
    }
  });

  if (activeAssignment) {
    // 结束当前分配
    await prisma.driverVehicleAssignment.update({
      where: { id: activeAssignment.id },
      data: {
        status: 'COMPLETED',
        endDate: new Date()
      }
    });

    // 更新驾驶员状态为可用
    await prisma.driver.update({
      where: { id: activeAssignment.driverId },
      data: { status: 'AVAILABLE' }
    });
  }

  // 软删除：将状态设为SCRAPPED
  await prisma.vehicle.update({
    where: { id },
    data: { status: 'RETIRED' }
  });

  res.json({
    success: true,
    message: '车辆删除成功'
  });
}));

// 获取车辆统计信息
router.get('/stats/overview', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const [totalVehicles, vehiclesByStatus, vehiclesByType] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.vehicle.groupBy({
      by: ['fuelType'],
      _count: { fuelType: true }
    })
  ]);

  const statusStats = vehiclesByStatus.reduce((acc: Record<string, number>, item: any) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  const typeStats = vehiclesByType.reduce((acc: Record<string, number>, item: any) => {
    acc[item.fuelType] = item._count.fuelType;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      total: totalVehicles,
      available: statusStats.AVAILABLE || 0,
      inUse: statusStats.IN_USE || 0,
      maintenance: statusStats.MAINTENANCE || 0,
      utilizationRate: totalVehicles > 0 ? Math.round(((statusStats.IN_USE || 0) / totalVehicles) * 100) : 0
    }
  });
}));

// 获取可用车辆列表
router.get('/available/list', authMiddleware, asyncHandler(async (req, res) => {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: 'AVAILABLE'
    },
    select: {
      id: true,
      plateNumber: true,
      brand: true,
      model: true,
      fuelType: true,
      seats: true,
      assignments: {
        where: {
          status: 'ACTIVE'
        },
        select: {
          driver: {
            select: {
              id: true,
              name: true,
              licenseNumber: true
            }
          }
        }
      }
    },
    orderBy: { plateNumber: 'asc' }
  });

  res.json({
    success: true,
    data: vehicles
  });
}));

export default router;
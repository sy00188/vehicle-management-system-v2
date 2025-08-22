import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

// 通知类型定义
interface NotificationData {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  message?: string;
  userId: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  relatedId?: string; // 关联的业务ID（如申请ID、车辆ID等）
  relatedType?: string; // 关联的业务类型
}

// 获取用户通知列表
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const unreadOnly = req.query.unreadOnly === 'true';
  const type = req.query.type as string;

  const skip = (page - 1) * limit;

  const where: any = {
    userId: userId
  };

  if (unreadOnly) {
    where.read = false;
  }

  if (type) {
    where.type = type;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.notification.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
}));

// 获取未读通知数量
router.get('/unread-count', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const unreadCount = await prisma.notification.count({
    where: {
      userId: userId,
      read: false
    }
  });

  res.json({
    success: true,
    data: { unreadCount }
  });
}));

// 标记通知为已读
router.patch('/:id/read', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: userId
    }
  });

  if (!notification) {
    res.status(404).json({
      success: false,
      message: '通知不存在'
    });
    return;
  }

  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { read: true }
  });

  res.json({
    success: true,
    message: '通知已标记为已读',
    data: updatedNotification
  });
}));

// 标记所有通知为已读
router.patch('/mark-all-read', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  await prisma.notification.updateMany({
    where: {
      userId: userId,
      read: false
    },
    data: { read: true }
  });

  res.json({
    success: true,
    message: '所有通知已标记为已读'
  });
}));

// 删除通知
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: userId
    }
  });

  if (!notification) {
    res.status(404).json({
      success: false,
      message: '通知不存在'
    });
    return;
  }

  await prisma.notification.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: '通知删除成功'
  });
}));

// 清空所有通知
router.delete('/clear-all', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  await prisma.notification.deleteMany({
    where: {
      userId: userId
    }
  });

  res.json({
    success: true,
    message: '所有通知已清空'
  });
}));

// 创建通知（管理员功能）
router.post('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const {
    type,
    title,
    message,
    userId,
    userIds, // 批量发送
    relatedId,
    relatedType
  } = req.body;

  // 验证必填字段
  if (!type || !title) {
    res.status(400).json({
      success: false,
      message: '通知类型和标题为必填项'
    });
    return;
  }

  // 验证通知类型
  const validTypes = ['SUCCESS', 'ERROR', 'WARNING', 'INFO'];
  if (!validTypes.includes(type)) {
    res.status(400).json({
      success: false,
      message: '无效的通知类型'
    });
    return;
  }

  let notifications;

  if (userIds && Array.isArray(userIds)) {
    // 批量创建通知
    const notificationData = userIds.map((uid: string) => ({
      type,
      title,
      message,
      userId: uid,
      relatedId,
      relatedType,
      read: false
    }));

    notifications = await prisma.notification.createMany({
      data: notificationData
    });
  } else if (userId) {
    // 单个用户通知
    notifications = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        relatedId,
        relatedType,
        read: false
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: '必须指定接收通知的用户'
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: '通知创建成功',
    data: notifications
  });
}));

// 获取通知统计信息（管理员功能）
router.get('/stats', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const [totalNotifications, unreadNotifications, notificationsByType] = await Promise.all([
    prisma.notification.count(),
    prisma.notification.count({ where: { read: false } }),
    prisma.notification.groupBy({
      by: ['type'],
      _count: { type: true }
    })
  ]);

  const typeStats = notificationsByType.reduce((acc: Record<string, number>, item: any) => {
    acc[item.type] = item._count.type;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      totalNotifications,
      unreadNotifications,
      typeStats
    }
  });
}));

// 通知服务工具函数
export const notificationService = {
  // 创建申请相关通知
  async createApplicationNotification(
    type: 'SUCCESS' | 'INFO' | 'WARNING',
    title: string,
    message: string,
    userId: string,
    applicationId: string
  ) {
    return await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        relatedId: applicationId,
        relatedType: 'application',
        read: false
      }
    });
  },

  // 创建车辆相关通知
  async createVehicleNotification(
    type: 'SUCCESS' | 'INFO' | 'WARNING',
    title: string,
    message: string,
    userId: string,
    vehicleId: string
  ) {
    return await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        relatedId: vehicleId,
        relatedType: 'vehicle',
        read: false
      }
    });
  },

  // 创建维护相关通知
  async createMaintenanceNotification(
    type: 'SUCCESS' | 'INFO' | 'WARNING',
    title: string,
    message: string,
    userId: string,
    maintenanceId: string
  ) {
    return await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        relatedId: maintenanceId,
        relatedType: 'maintenance',
        read: false
      }
    });
  },

  // 批量创建通知
  async createBulkNotifications(
    type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR',
    title: string,
    message: string,
    userIds: string[],
    relatedId?: string,
    relatedType?: string
  ) {
    const notificationData = userIds.map(userId => ({
      type,
      title,
      message,
      userId,
      relatedId,
      relatedType,
      read: false
    }));

    return await prisma.notification.createMany({
      data: notificationData
    });
  }
};

export default router;
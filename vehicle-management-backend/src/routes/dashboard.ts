import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

// 定义活动类型接口
interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

// 定义待办事项接口
interface Todo {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueDate?: string;
}

// 定义快捷操作接口
interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  action: string;
}

const router = express.Router();
const prisma = new PrismaClient();

// 获取仪表板统计数据
router.get('/stats', authMiddleware, asyncHandler(async (req, res) => {
  const [vehicleStats, applicationStats, expenseStats, maintenanceStats] = await Promise.all([
    // 车辆统计
    prisma.vehicle.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    // 申请统计
    prisma.application.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    // 费用统计（当月）
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      }
    }),
    // 维护统计
    prisma.maintenance.groupBy({
      by: ['status'],
      _count: { status: true }
    })
  ]);

  // 处理车辆统计
  const vehicleStatusStats = vehicleStats.reduce((acc: Record<string, number>, item: { status: string; _count: { status: number } }) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  // 处理申请统计
  const applicationStatusStats = applicationStats.reduce((acc: Record<string, number>, item: { status: string; _count: { status: number } }) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  // 处理维护统计
  const maintenanceStatusStats = maintenanceStats.reduce((acc: Record<string, number>, item: { status: string; _count: { status: number } }) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  // 计算上月费用用于比较
  const lastMonthExpense = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  });

  const currentMonthExpense = expenseStats._sum?.amount || 0;
  const lastMonthExpenseAmount = lastMonthExpense._sum?.amount || 0;
  const expenseChange = lastMonthExpenseAmount > 0 
    ? ((currentMonthExpense - lastMonthExpenseAmount) / lastMonthExpenseAmount) * 100 
    : 0;

  // 计算使用率
  const totalVehicles = (Object.values(vehicleStatusStats) as number[]).reduce((sum: number, count: number) => sum + count, 0);
  const inUseVehicles = vehicleStatusStats['IN_USE'] || 0;
  const usageRate = totalVehicles > 0 ? Math.round((inUseVehicles / totalVehicles) * 100) : 0;

  const dashboardStats = {
    totalVehicles,
    availableVehicles: vehicleStatusStats['AVAILABLE'] || 0,
    inUseVehicles,
    maintenanceVehicles: vehicleStatusStats['MAINTENANCE'] || 0,
    pendingApplications: applicationStatusStats['PENDING'] || 0,
    monthlyExpenses: currentMonthExpense,
    expenseChange: Math.round(expenseChange),
    usageRate
  };

  res.json({
    success: true,
    data: dashboardStats
  });
}));

// 获取最近活动记录
router.get('/activities', authMiddleware, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;

  // 获取最近的申请、审批、维护等活动
  const [recentApplications, recentMaintenances, recentExpenses] = await Promise.all([
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        applicant: { select: { name: true } },
        vehicle: { select: { plateNumber: true } }
      }
    }),
    prisma.maintenance.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { plateNumber: true } }
      }
    }),
    prisma.expense.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { plateNumber: true } }
      }
    })
  ]);

  const activities: Activity[] = [];

  // 添加申请活动
  recentApplications.forEach((app: any) => {
    activities.push({
      id: `app_${app.id}`,
      type: 'application',
      title: `新的用车申请`,
      description: `${app.applicant.name} 申请使用 ${app.vehicle.plateNumber}`,
      timestamp: app.createdAt.toISOString(),
      icon: 'file-text',
      iconColor: 'blue'
    });
  });

  // 添加维护活动
  recentMaintenances.forEach((maintenance: any) => {
    activities.push({
      id: `maintenance_${maintenance.id}`,
      type: 'maintenance',
      title: `车辆维护`,
      description: `${maintenance.vehicle.plateNumber} - ${maintenance.description}`,
      timestamp: maintenance.createdAt.toISOString(),
      icon: 'tool',
      iconColor: 'orange'
    });
  });

  // 添加费用活动
  recentExpenses.forEach((expense: any) => {
    activities.push({
      id: `expense_${expense.id}`,
      type: 'expense',
      title: `新增费用`,
      description: `${expense.vehicle.plateNumber} - ¥${expense.amount}`,
      timestamp: expense.createdAt.toISOString(),
      icon: 'dollar-sign',
      iconColor: 'green'
    });
  });

  // 按时间排序并限制数量
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const limitedActivities = activities.slice(0, limit);

  res.json({
    success: true,
    data: limitedActivities
  });
}));

// 获取待办事项
router.get('/todos', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  const todos = [];

  // 管理员和经理可以看到待审批的申请
  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    const pendingApplicationsCount = await prisma.application.count({
      where: { status: 'PENDING' }
    });

    if (pendingApplicationsCount > 0) {
      todos.push({
        id: 'pending_applications',
        title: `审批 ${pendingApplicationsCount} 个用车申请`,
        priority: 'urgent',
        status: 'pending'
      });
    }

    // 即将到期的维护
    const upcomingMaintenances = await prisma.maintenance.count({
      where: {
        status: 'PENDING',
        scheduledDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天内
        }
      }
    });

    if (upcomingMaintenances > 0) {
      todos.push({
        id: 'upcoming_maintenances',
        title: `${upcomingMaintenances} 个车辆维护即将到期`,
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      });
    }

    // 未处理的费用记录
    const pendingExpenses = await prisma.expense.count({
      where: { status: 'PENDING' }
    });

    if (pendingExpenses > 0) {
      todos.push({
        id: 'pending_expenses',
        title: `处理 ${pendingExpenses} 个费用记录`,
        priority: 'medium',
        status: 'pending'
      });
    }
  }

  // 普通用户可以看到自己的申请状态
  if (userRole === 'USER') {
    const userApplications = await prisma.application.count({
      where: {
        applicantId: userId,
        status: 'PENDING'
      }
    });

    if (userApplications > 0) {
      todos.push({
        id: 'my_applications',
        title: `您有 ${userApplications} 个申请待审批`,
        priority: 'medium',
        status: 'in-progress'
      });
    }
  }

  res.json({
    success: true,
    data: todos
  });
}));

// 获取快捷操作
router.get('/quick-actions', authMiddleware, asyncHandler(async (req, res) => {
  const userRole = req.user?.role;

  const quickActions = [
    {
      id: 'new_application',
      title: '新建申请',
      icon: 'plus',
      color: 'blue',
      action: '/applications/new'
    }
  ];

  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    quickActions.push(
      {
        id: 'add_vehicle',
        title: '添加车辆',
        icon: 'car',
        color: 'green',
        action: '/vehicles/new'
      },
      {
        id: 'add_driver',
        title: '添加驾驶员',
        icon: 'user-plus',
        color: 'purple',
        action: '/drivers/new'
      },
      {
        id: 'expense_report',
        title: '费用报告',
        icon: 'chart-bar',
        color: 'orange',
        action: '/expenses/report'
      }
    );
  }

  res.json({
    success: true,
    data: quickActions
  });
}));

// 获取使用率图表数据
router.get('/usage-chart', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const months = 6; // 最近6个月
  const usageData = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const [totalVehicles, , usedVehicles] = await Promise.all([
      prisma.vehicle.count({
        where: {
          createdAt: { lt: endDate }
        }
      }),
      prisma.application.count({
        where: {
          status: 'APPROVED',
          startTime: {
            gte: startDate,
            lt: endDate
          }
        }
      }),
      prisma.application.groupBy({
         by: ['vehicleId'],
         where: {
           status: 'APPROVED',
           startTime: {
             gte: startDate,
             lt: endDate
           }
         }
       }).then((results: any[]) => results.length)
    ]);

    const usageRate = totalVehicles > 0 ? Math.round((usedVehicles / totalVehicles) * 100) : 0;

    usageData.push({
      month: `${month + 1}月`,
      usageRate
    });
  }

  res.json({
    success: true,
    data: usageData
  });
}));

// 获取费用图表数据
router.get('/expense-chart', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const months = 6; // 最近6个月
  const expenseData = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const monthlyExpense = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    expenseData.push({
      month: `${month + 1}月`,
      amount: monthlyExpense._sum?.amount || 0
    });
  }

  res.json({
    success: true,
    data: expenseData
  });
}));

// 获取所有仪表板数据（聚合接口）
router.get('/data', authMiddleware, asyncHandler(async (req, res) => {
  const [stats, activities, todos, quickActions, usageData, expenseData] = await Promise.all([
    // 重用上面的逻辑，但这里为了简化，我们调用内部函数
    // 在实际应用中，可以将这些逻辑提取为服务函数
    fetch(`${req.protocol}://${req.get('host')}/api/dashboard/stats`, {
      headers: { Authorization: req.headers.authorization || '' }
    }).then(res => res.json()).then((data: any) => data.data),
    
    fetch(`${req.protocol}://${req.get('host')}/api/dashboard/activities`, {
      headers: { Authorization: req.headers.authorization || '' }
    }).then(res => res.json()).then((data: any) => data.data),
    
    fetch(`${req.protocol}://${req.get('host')}/api/dashboard/todos`, {
      headers: { Authorization: req.headers.authorization || '' }
    }).then(res => res.json()).then((data: any) => data.data),
    
    fetch(`${req.protocol}://${req.get('host')}/api/dashboard/quick-actions`, {
      headers: { Authorization: req.headers.authorization || '' }
    }).then(res => res.json()).then((data: any) => data.data),
    
    req.user?.role === 'ADMIN' || req.user?.role === 'MANAGER' 
      ? fetch(`${req.protocol}://${req.get('host')}/api/dashboard/usage-chart`, {
          headers: { Authorization: req.headers.authorization || '' }
        }).then(res => res.json()).then((data: any) => data.data)
      : [],
    
    req.user?.role === 'ADMIN' || req.user?.role === 'MANAGER'
      ? fetch(`${req.protocol}://${req.get('host')}/api/dashboard/expense-chart`, {
          headers: { Authorization: req.headers.authorization || '' }
        }).then(res => res.json()).then((data: any) => data.data)
      : []
  ]);

  res.json({
    success: true,
    data: {
      stats,
      activities,
      todos,
      quickActions,
      usageData,
      expenseData
    }
  });
}));

export default router;
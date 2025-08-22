import type {
  DashboardStats,
  ActivityRecord,
  TodoItem,
  QuickAction,
  UsageChartData,
  ExpenseChartData
} from '../types';
import { ApiService } from '../utils/api';

// 获取仪表板统计数据
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await ApiService.get<{success: boolean; data: DashboardStats}>('/dashboard/stats');
  return response.data.data;
};

// 获取最近活动
export const getRecentActivities = async (): Promise<ActivityRecord[]> => {
  const response = await ApiService.get<{success: boolean; data: ActivityRecord[]}>('/dashboard/activities');
  return response.data.data;
};

// 获取待办事项
export const getTodoItems = async (): Promise<TodoItem[]> => {
  const response = await ApiService.get<{success: boolean; data: TodoItem[]}>('/dashboard/todos');
  return response.data.data;
};

// 获取快捷操作
export const getQuickActions = async (): Promise<QuickAction[]> => {
  const response = await ApiService.get<{success: boolean; data: QuickAction[]}>('/dashboard/quick-actions');
  return response.data.data;
};

// 获取使用率图表数据
export const getUsageChartData = async (): Promise<UsageChartData[]> => {
  const response = await ApiService.get<{success: boolean; data: UsageChartData[]}>('/dashboard/usage-chart');
  return response.data.data;
};

// 获取费用分布图表数据
export const getExpenseChartData = async (): Promise<ExpenseChartData[]> => {
  const response = await ApiService.get<{success: boolean; data: ExpenseChartData[]}>('/dashboard/expense-chart');
  return response.data.data;
};

// 获取完整仪表板数据
export const getDashboardData = async () => {
  try {
    const [stats, activities, todos, quickActions, usageData, expenseData] = await Promise.all([
      getDashboardStats(),
      getRecentActivities(),
      getTodoItems(),
      getQuickActions(),
      getUsageChartData(),
      getExpenseChartData()
    ]);

    return {
      stats,
      activities,
      todos,
      quickActions,
      usageData,
      expenseData
    };
  } catch (error) {
    console.error('获取仪表板数据失败:', error);
    // 返回默认数据以防止undefined错误
    return {
      stats: {
        totalVehicles: 0,
        availableVehicles: 0,
        inUseVehicles: 0,
        maintenanceVehicles: 0,
        pendingApplications: 0,
        monthlyExpenses: 0,
        expenseChange: 0,
        usageRate: 0
      },
      activities: [],
      todos: [],
      quickActions: [],
      usageData: [],
      expenseData: []
    };
  }
};
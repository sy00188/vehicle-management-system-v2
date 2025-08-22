import { QueryClient } from '@tanstack/react-query';
import { ERROR_MESSAGES } from './constants';

// 创建 React Query 客户端
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据保持新鲜的时间（5分钟）
      staleTime: 5 * 60 * 1000,
      // 缓存时间（10分钟）
      gcTime: 10 * 60 * 1000,
      // 重试配置
      retry: (failureCount, error: any) => {
        // 对于 4xx 错误不重试
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // 最多重试 3 次
        return failureCount < 3;
      },
      // 重试延迟（指数退避）
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 窗口重新获得焦点时重新获取数据
      refetchOnWindowFocus: false,
      // 网络重连时重新获取数据
      refetchOnReconnect: true,
    },
    mutations: {
      // 变更重试配置
      retry: (failureCount, error: any) => {
        // 对于客户端错误不重试
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      // 变更重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// 查询键工厂
export const queryKeys = {
  // 用户相关
  user: {
    all: ['users'] as const,
    lists: () => [...queryKeys.user.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.user.lists(), { filters }] as const,
    details: () => [...queryKeys.user.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.user.details(), id] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
  
  // 车辆相关
  vehicle: {
    all: ['vehicles'] as const,
    lists: () => [...queryKeys.vehicle.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.vehicle.lists(), { filters }] as const,
    details: () => [...queryKeys.vehicle.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.vehicle.details(), id] as const,
    stats: () => [...queryKeys.vehicle.all, 'stats'] as const,
  },
  
  // 申请相关
  application: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.application.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.application.lists(), { filters }] as const,
    details: () => [...queryKeys.application.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.application.details(), id] as const,
    stats: () => [...queryKeys.application.all, 'stats'] as const,
  },
  
  // 驾驶员相关
  driver: {
    all: ['drivers'] as const,
    lists: () => [...queryKeys.driver.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.driver.lists(), { filters }] as const,
    details: () => [...queryKeys.driver.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.driver.details(), id] as const,
    stats: () => [...queryKeys.driver.all, 'stats'] as const,
  },
  
  // 费用相关
  expense: {
    all: ['expenses'] as const,
    lists: () => [...queryKeys.expense.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.expense.lists(), { filters }] as const,
    details: () => [...queryKeys.expense.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.expense.details(), id] as const,
    stats: () => [...queryKeys.expense.all, 'stats'] as const,
  },
  
  // 仪表板相关
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    charts: () => [...queryKeys.dashboard.all, 'charts'] as const,
    activities: () => [...queryKeys.dashboard.all, 'activities'] as const,
  },
};

// 错误处理函数
export const handleQueryError = (error: any): string => {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR;
  
  // 网络错误
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  const { status, data } = error.response;
  
  switch (status) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 422:
      return data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 500:
    default:
      return data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }
};

// 无效化查询的辅助函数
export const invalidateQueries = {
  // 无效化所有用户查询
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
  
  // 无效化特定用户查询
  user: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.user.detail(id) }),
  
  // 无效化所有车辆查询
  vehicles: () => queryClient.invalidateQueries({ queryKey: queryKeys.vehicle.all }),
  
  // 无效化特定车辆查询
  vehicle: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.vehicle.detail(id) }),
  
  // 无效化所有申请查询
  applications: () => queryClient.invalidateQueries({ queryKey: queryKeys.application.all }),
  
  // 无效化特定申请查询
  application: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.application.detail(id) }),
  
  // 无效化所有驾驶员查询
  drivers: () => queryClient.invalidateQueries({ queryKey: queryKeys.driver.all }),
  
  // 无效化特定驾驶员查询
  driver: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.driver.detail(id) }),
  
  // 无效化所有费用查询
  expenses: () => queryClient.invalidateQueries({ queryKey: queryKeys.expense.all }),
  
  // 无效化特定费用查询
  expense: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.expense.detail(id) }),
  
  // 无效化仪表板查询
  dashboard: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
};

// 预取数据的辅助函数
export const prefetchQueries = {
  // 预取车辆列表
  vehicles: (filters: Record<string, any> = {}) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.vehicle.list(filters),
      queryFn: () => {
        // 这里应该调用实际的 API 函数
        // 暂时返回空数组
        return Promise.resolve([]);
      },
    });
  },
  
  // 预取申请列表
  applications: (filters: Record<string, any> = {}) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.application.list(filters),
      queryFn: () => {
        // 这里应该调用实际的 API 函数
        // 暂时返回空数组
        return Promise.resolve([]);
      },
    });
  },
};
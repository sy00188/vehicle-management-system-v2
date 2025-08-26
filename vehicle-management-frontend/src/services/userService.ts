import type { User, PaginatedResponse, ApiResponse } from '../types';
import { ApiService } from '../utils/api';


// 用户过滤器接口
export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
}

// 获取用户列表
export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  filters?: UserFilters
): Promise<PaginatedResponse<User>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.status && { status: filters.status })
    });

    const response = await ApiService.get<{users: User[], pagination: {page: number, pageSize: number, total: number, totalPages: number, hasNext: boolean, hasPrev: boolean}}>(`/users?${params}`);
    
    if (response.success && response.data) {
      return {
        data: response.data.users,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.pageSize,
        totalPages: response.data.pagination.totalPages
      };
    } else {
      throw new Error(response.message || '获取用户列表失败');
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    };
  }
};

// 获取单个用户详情
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const response = await ApiService.get<User>(`/users/${id}`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取用户详情成功'
      };
    } else {
      throw new Error(response.message || '获取用户详情失败');
    }
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '获取用户详情失败'
    };
  }
};

// 创建用户
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> => {
  try {
    const response = await ApiService.post<User>('/users', userData);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '创建用户成功'
      };
    } else {
      throw new Error(response.message || '创建用户失败');
    }
  } catch (error) {
    console.error('创建用户失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '创建用户失败'
    };
  }
};

// 更新用户
export const updateUser = async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
  try {
    const response = await ApiService.put<User>(`/users/${id}`, userData);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '更新用户成功'
      };
    } else {
      throw new Error(response.message || '更新用户失败');
    }
  } catch (error) {
    console.error('更新用户失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '更新用户失败'
    };
  }
};

// 删除用户
export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await ApiService.delete(`/users/${id}`);
    
    if (response.success) {
      return {
        success: true,
        data: null,
        message: '删除用户成功'
      };
    } else {
      throw new Error(response.message || '删除用户失败');
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '删除用户失败'
    };
  }
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await ApiService.get<User>('/users/me');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取当前用户信息成功'
      };
    } else {
      throw new Error(response.message || '获取当前用户信息失败');
    }
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '获取当前用户信息失败'
    };
  }
};

// 更新用户密码
export const updateUserPassword = async (oldPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
  try {
    const response = await ApiService.post('/users/change-password', { oldPassword, newPassword });
    
    if (response.success) {
      return {
        success: true,
        data: null,
        message: '密码修改成功'
      };
    } else {
      throw new Error(response.message || '密码修改失败');
    }
  } catch (error) {
    console.error('密码更新失败:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '密码更新失败'
    };
  }
};

// 重置用户密码（管理员功能）
export const resetUserPassword = async (userId: string, newPassword: string): Promise<ApiResponse<null>> => {
  try {
    const response = await ApiService.post(`/users/${userId}/reset-password`, { newPassword });
    
    if (response.success) {
      return {
        success: true,
        data: null,
        message: '密码重置成功'
      };
    } else {
      throw new Error(response.message || '密码重置失败');
    }
  } catch (error) {
    console.error('密码重置失败:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '密码重置失败'
    };
  }
};

// 更新用户状态（管理员功能）
export const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<User>> => {
  try {
    const response = await ApiService.patch<User>(`/users/${userId}`, { status });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '用户状态更新成功'
      };
    } else {
      throw new Error(response.message || '用户状态更新失败');
    }
  } catch (error) {
    console.error('用户状态更新失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '用户状态更新失败'
    };
  }
};

// 获取用户统计信息
export const getUserStats = async (): Promise<ApiResponse<{
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleStats: Record<string, number>;
}>> => {
  try {
    const response = await ApiService.get<{
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      roleStats: Record<string, number>;
    }>('/users/stats/overview');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取用户统计成功'
      };
    } else {
      throw new Error(response.message || '获取用户统计失败');
    }
  } catch (error) {
    console.error('获取用户统计失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '获取用户统计失败'
    };
  }
};
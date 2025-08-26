import type { Role, Permission, ApiResponse, PaginatedResponse } from '../types';
import { ApiService } from '../utils/api';

// 角色过滤器接口
export interface RoleFilters {
  search?: string;
  isSystem?: boolean;
}

// 权限配置接口
export interface PermissionConfig {
  module: string;
  actions: string[];
}

// 角色创建/更新数据接口
export interface RoleData {
  name: string;
  description?: string;
  permissions?: string[];
  isSystem?: boolean;
}

// 获取角色列表
export const getRoles = async (
  page: number = 1,
  limit: number = 10,
  filters?: RoleFilters
): Promise<PaginatedResponse<Role>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.isSystem !== undefined && { isSystem: filters.isSystem.toString() })
    });

    const response = await ApiService.get<{
      roles: Role[], 
      pagination: {
        page: number, 
        pageSize: number, 
        total: number, 
        totalPages: number, 
        hasNext: boolean, 
        hasPrev: boolean
      }
    }>(`/roles?${params}`);
    
    if (response.success && response.data) {
      return {
        data: response.data.roles,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.pageSize,
        totalPages: response.data.pagination.totalPages
      };
    } else {
      throw new Error(response.message || '获取角色列表失败');
    }
  } catch (error) {
    console.error('获取角色列表失败:', error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0
    };
  }
};

// 根据ID获取角色详情
export const getRoleById = async (roleId: string): Promise<ApiResponse<Role>> => {
  try {
    const response = await ApiService.get<Role>(`/roles/${roleId}`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取角色详情成功'
      };
    } else {
      throw new Error(response.message || '获取角色详情失败');
    }
  } catch (error) {
    console.error('获取角色详情失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '获取角色详情失败'
    };
  }
};

// 创建角色
export const createRole = async (roleData: RoleData): Promise<ApiResponse<Role>> => {
  try {
    const response = await ApiService.post<Role>('/roles', roleData);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '角色创建成功'
      };
    } else {
      throw new Error(response.message || '角色创建失败');
    }
  } catch (error) {
    console.error('角色创建失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '角色创建失败'
    };
  }
};

// 更新角色
export const updateRole = async (roleId: string, roleData: Partial<RoleData>): Promise<ApiResponse<Role>> => {
  try {
    const response = await ApiService.put<Role>(`/roles/${roleId}`, roleData);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '角色更新成功'
      };
    } else {
      throw new Error(response.message || '角色更新失败');
    }
  } catch (error) {
    console.error('角色更新失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '角色更新失败'
    };
  }
};

// 删除角色
export const deleteRole = async (roleId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await ApiService.delete(`/roles/${roleId}`);
    
    if (response.success) {
      return {
        success: true,
        data: null,
        message: '角色删除成功'
      };
    } else {
      throw new Error(response.message || '角色删除失败');
    }
  } catch (error) {
    console.error('角色删除失败:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '角色删除失败'
    };
  }
};

// 获取所有权限列表
export const getPermissions = async (): Promise<ApiResponse<Permission[]>> => {
  try {
    const response = await ApiService.get<Permission[]>('/permissions');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取权限列表成功'
      };
    } else {
      throw new Error(response.message || '获取权限列表失败');
    }
  } catch (error) {
    console.error('获取权限列表失败:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : '获取权限列表失败'
    };
  }
};

// 更新角色权限
export const updateRolePermissions = async (
  roleId: string, 
  permissions: string[]
): Promise<ApiResponse<Role>> => {
  try {
    const response = await ApiService.put<Role>(`/roles/${roleId}/permissions`, {
      permissions
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '角色权限更新成功'
      };
    } else {
      throw new Error(response.message || '角色权限更新失败');
    }
  } catch (error) {
    console.error('角色权限更新失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '角色权限更新失败'
    };
  }
};

// 获取角色权限配置
export const getRolePermissions = async (roleId: string): Promise<ApiResponse<string[]>> => {
  try {
    const response = await ApiService.get<{ permissions: string[] }>(`/roles/${roleId}/permissions`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.permissions,
        message: '获取角色权限成功'
      };
    } else {
      throw new Error(response.message || '获取角色权限失败');
    }
  } catch (error) {
    console.error('获取角色权限失败:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : '获取角色权限失败'
    };
  }
};

// 批量更新角色权限配置
export const batchUpdateRolePermissions = async (
  rolePermissions: Array<{ roleId: string; permissions: string[] }>
): Promise<ApiResponse<null>> => {
  try {
    const response = await ApiService.post('/roles/batch-permissions', {
      rolePermissions
    });
    
    if (response.success) {
      return {
        success: true,
        data: null,
        message: '批量更新角色权限成功'
      };
    } else {
      throw new Error(response.message || '批量更新角色权限失败');
    }
  } catch (error) {
    console.error('批量更新角色权限失败:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '批量更新角色权限失败'
    };
  }
};

// 复制角色
export const copyRole = async (sourceRoleId: string, newRoleName: string): Promise<ApiResponse<Role>> => {
  try {
    const response = await ApiService.post<Role>(`/roles/${sourceRoleId}/copy`, {
      name: newRoleName
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '角色复制成功'
      };
    } else {
      throw new Error(response.message || '角色复制失败');
    }
  } catch (error) {
    console.error('角色复制失败:', error);
    return {
      success: false,
      data: null as any,
      message: error instanceof Error ? error.message : '角色复制失败'
    };
  }
};

// 获取角色统计信息
export const getRoleStats = async (): Promise<ApiResponse<{
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  totalPermissions: number;
}>> => {
  try {
    const response = await ApiService.get<{
      totalRoles: number;
      systemRoles: number;
      customRoles: number;
      totalPermissions: number;
    }>('/roles/stats');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        message: '获取角色统计成功'
      };
    } else {
      throw new Error(response.message || '获取角色统计失败');
    }
  } catch (error) {
    console.error('获取角色统计失败:', error);
    return {
      success: false,
      data: {
        totalRoles: 0,
        systemRoles: 0,
        customRoles: 0,
        totalPermissions: 0
      },
      message: error instanceof Error ? error.message : '获取角色统计失败'
    };
  }
};
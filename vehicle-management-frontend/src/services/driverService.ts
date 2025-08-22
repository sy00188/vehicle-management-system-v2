import type { Driver, PaginatedResponse, ApiResponse } from '../types';
import { ApiService } from '../utils/api';

// 获取司机统计数据
export const getDriverStats = async () => {
  try {
    const response = await ApiService.get('/drivers/stats/overview');
    return response.data;
  } catch (error) {
    console.error('获取司机统计失败:', error);
    throw error;
  }
};

// 获取司机列表（分页）
export const getDrivers = async (
  filters: { search?: string; status?: Driver['status'] } = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Driver>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });

    // 添加过滤条件
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);

    const response = await ApiService.get<PaginatedResponse<Driver>>(`/drivers?${params}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch drivers');
    }
    return response.data;
  } catch (error) {
    console.error('获取司机列表失败:', error);
    throw error;
  }
};

// 根据ID获取司机详情
export const getDriverById = async (id: string): Promise<Driver> => {
  try {
    const response = await ApiService.get<Driver>(`/drivers/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch driver');
    }
    return response.data;
  } catch (error) {
    console.error('获取司机详情失败:', error);
    throw error;
  }
};

// 创建司机
export const createDriver = async (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver> => {
  try {
    const response = await ApiService.post<Driver>('/drivers', driverData);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create driver');
    }
    return response.data;
  } catch (error) {
    console.error('创建司机失败:', error);
    throw error;
  }
};

// 更新司机
export const updateDriver = async (id: string, driverData: Partial<Driver>): Promise<Driver> => {
  try {
    const response = await ApiService.put<Driver>(`/drivers/${id}`, driverData);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update driver');
    }
    return response.data;
  } catch (error) {
    console.error('更新司机失败:', error);
    throw error;
  }
};

// 删除司机
export const deleteDriver = async (id: string): Promise<void> => {
  try {
    const response = await ApiService.delete<void>(`/drivers/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete driver');
    }
  } catch (error) {
    console.error('删除司机失败:', error);
    throw error;
  }
};

// 获取可用司机列表
export const getAvailableDrivers = async (): Promise<Driver[]> => {
  try {
    const response = await ApiService.get<Driver[]>('/drivers/available');
    
    if (!response.success) {
      throw new Error(response.message || '获取可用司机列表失败');
    }
    return response.data;
  } catch (error) {
    console.error('获取可用司机列表失败:', error);
    throw error;
  }
};

// 为司机分配车辆
export const assignVehicleToDriver = async (driverId: string, vehicleId: string): Promise<ApiResponse<null>> => {
  try {
    await ApiService.post<null>(`/drivers/${driverId}/assign-vehicle`, {
      vehicleId
    });

    return {
      success: true,
      data: null,
      message: '车辆分配成功'
    };
  } catch (error) {
    console.error('分配车辆失败:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '分配车辆失败'
    };
  }
};

// 取消司机车辆分配
export const unassignVehicleFromDriver = async (driverId: string): Promise<ApiResponse<null>> => {
  try {
    await ApiService.post<null>(`/drivers/${driverId}/unassign-vehicle`);

    return {
      success: true,
      data: null,
      message: '取消分配成功'
    };
  } catch (error) {
    console.error('取消车辆分配失败:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '取消车辆分配失败'
    };
  }
};
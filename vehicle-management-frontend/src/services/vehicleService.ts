import type { Vehicle, VehicleFilters, VehicleStats, CreateVehicleData, UpdateVehicleData } from '../types';
import { ApiService } from '../utils/api';




// 获取车辆统计信息
export const getVehicleStats = async (): Promise<VehicleStats> => {
  const response = await ApiService.get<VehicleStats>('/vehicles/stats/overview');
  return response.data;
};

// 获取车辆列表
export const getVehicles = async (
  filters?: VehicleFilters, 
  page: number = 1, 
  limit: number = 12
): Promise<{
  data: Vehicle[];
  total: number;
  totalPages: number;
  currentPage: number;
}> => {
  const params = new URLSearchParams();
  
  // 添加分页参数
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (filters) {
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.department) params.append('department', filters.department);
    if (filters.search) params.append('search', filters.search);
  }
  
  const queryString = params.toString();
  const url = `/vehicles?${queryString}`;
  
  const response = await ApiService.get<{
    success: boolean;
    data: {
      vehicles: Vehicle[];
      pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
  }>(url);
  
  // 转换返回格式以匹配前端期望的结构
  return {
    data: response.data.data?.vehicles || [],
    total: response.data.data?.pagination?.total || 0,
    totalPages: response.data.data?.pagination?.totalPages || 1,
    currentPage: response.data.data?.pagination?.page || page
  };
};

// 根据ID获取车辆
export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const response = await ApiService.get<{success: boolean; data: Vehicle}>(`/vehicles/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// 创建车辆
export const createVehicle = async (vehicleData: CreateVehicleData): Promise<{
  success: boolean;
  message?: string;
  data?: Vehicle;
}> => {
  try {
    const response = await ApiService.post<{success: boolean; data: Vehicle}>('/vehicles', vehicleData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '创建车辆失败'
    };
  }
};

// 更新车辆
export const updateVehicle = async (id: string, vehicleData: UpdateVehicleData): Promise<{
  success: boolean;
  message?: string;
  data?: Vehicle;
}> => {
  try {
    const response = await ApiService.put<{success: boolean; data: Vehicle}>(`/vehicles/${id}`, vehicleData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '更新车辆失败'
    };
  }
};

// 删除车辆
export const deleteVehicle = async (id: string): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    await ApiService.delete(`/vehicles/${id}`);
    return {
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '删除车辆失败'
    };
  }
};

// 批量删除车辆
export const deleteVehicles = async (ids: string[]): Promise<void> => {
  await ApiService.delete('/vehicles/batch', { data: { ids } });
};

// 导出服务对象
export const vehicleService = {
  getVehicleStats,
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  deleteVehicles
};
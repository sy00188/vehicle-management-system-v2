import type { MaintenanceRecord, MaintenanceFilters, PaginatedResponse } from '../types';
import { ApiService } from '../utils/api';

// 获取维护统计数据
export const getMaintenanceStats = async () => {
  const response = await ApiService.get<any>('/maintenances/stats/overview');
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch maintenance stats');
  }
  return response.data;
};

// 获取维护记录列表（分页）
export const getMaintenanceRecords = async (
  filters: MaintenanceFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<MaintenanceRecord>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  // 添加过滤条件
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.type) {
    params.append('type', filters.type);
  }
  if (filters.priority) {
    params.append('priority', filters.priority);
  }
  if (filters.vehicleId) {
    params.append('vehicleId', filters.vehicleId);
  }
  if (filters.serviceProvider) {
    params.append('serviceProvider', filters.serviceProvider);
  }
  if (filters.dateRange) {
    params.append('startDate', filters.dateRange.start);
    params.append('endDate', filters.dateRange.end);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }

  const response = await ApiService.get<{maintenances: MaintenanceRecord[], pagination: {page: number, pageSize: number, total: number, totalPages: number, hasNext: boolean, hasPrev: boolean}}>(`/maintenances?${params.toString()}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch maintenance records');
  }
  return {
    data: response.data.maintenances,
    total: response.data.pagination.total,
    page: response.data.pagination.page,
    limit: response.data.pagination.pageSize,
    totalPages: response.data.pagination.totalPages
  };
};

// 根据ID获取维护记录详情
export const getMaintenanceRecordById = async (id: string): Promise<MaintenanceRecord> => {
  const response = await ApiService.get<MaintenanceRecord>(`/maintenances/${id}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch maintenance record');
  }
  return response.data;
};

// 创建维护记录
export const createMaintenanceRecord = async (maintenanceData: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt' | 'vehicle'>): Promise<MaintenanceRecord> => {
  const response = await ApiService.post<MaintenanceRecord>('/maintenances', maintenanceData);
  if (!response.success) {
    throw new Error(response.message || 'Failed to create maintenance record');
  }
  return response.data;
};

// 更新维护记录
export const updateMaintenanceRecord = async (id: string, maintenanceData: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
  const response = await ApiService.put<MaintenanceRecord>(`/maintenances/${id}`, maintenanceData);
  if (!response.success) {
    throw new Error(response.message || 'Failed to update maintenance record');
  }
  return response.data;
};

// 删除维护记录
export const deleteMaintenanceRecord = async (id: string): Promise<void> => {
  const response = await ApiService.delete<null>(`/maintenances/${id}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to delete maintenance record');
  }
};

// 获取车辆维护历史
export const getVehicleMaintenanceHistory = async (
  vehicleId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<MaintenanceRecord>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  const response = await ApiService.get<{maintenances: MaintenanceRecord[], pagination: {page: number, pageSize: number, total: number, totalPages: number, hasNext: boolean, hasPrev: boolean}}>(`/maintenances/vehicle/${vehicleId}?${params.toString()}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch vehicle maintenance history');
  }
  return {
    data: response.data.maintenances,
    total: response.data.pagination.total,
    page: response.data.pagination.page,
    limit: response.data.pagination.pageSize,
    totalPages: response.data.pagination.totalPages
  };
};

// 获取维护报告摘要
export const getMaintenanceReportSummary = async (
  startDate?: string,
  endDate?: string,
  vehicleId?: string
) => {
  const params = new URLSearchParams();
  if (startDate) {
    params.append('startDate', startDate);
  }
  if (endDate) {
    params.append('endDate', endDate);
  }
  if (vehicleId) {
    params.append('vehicleId', vehicleId);
  }

  const response = await ApiService.get<any>(`/maintenances/report/summary?${params.toString()}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch maintenance report summary');
  }
  return response.data;
};

export const maintenanceService = {
  getMaintenanceStats,
  getMaintenanceRecords,
  getMaintenanceRecordById,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getVehicleMaintenanceHistory,
  getMaintenanceReportSummary
};
import type { Application, ApplicationFilters, PaginatedResponse } from '../types';
import { ApiService } from '../utils/api';

// 获取申请统计数据
export const getApplicationStats = async () => {
  try {
    const response = await ApiService.get('/applications/stats/overview');
    if (!response.success) {
      throw new Error(response.message || '获取申请统计失败');
    }
    return response.data;
  } catch (error) {
    console.error('获取申请统计失败:', error);
    throw error;
  }
};

// 获取申请列表（分页）
export const getApplications = async (
  filters: ApplicationFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Application>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });

    // 添加过滤条件
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.applicantId) {
      params.append('applicantId', filters.applicantId);
    }
    if (filters.vehicleId) {
      params.append('vehicleId', filters.vehicleId);
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const response = await ApiService.get<PaginatedResponse<Application>>(`/applications?${params}`);
    if (!response.success) {
      throw new Error(response.message || '获取申请列表失败');
    }
    return response.data;
  } catch (error) {
    console.error('获取申请列表失败:', error);
    throw error;
  }
};

// 根据ID获取申请详情
export const getApplicationById = async (id: string): Promise<Application> => {
  try {
    const response = await ApiService.get<Application>(`/applications/${id}`);
    if (!response.success) {
      throw new Error(response.message || '获取申请详情失败');
    }
    return response.data;
  } catch (error) {
    console.error('获取申请详情失败:', error);
    throw error;
  }
};

// 创建新申请
export const createApplication = async (applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'applicant' | 'vehicle' | 'approver'>): Promise<Application> => {
  try {
    const response = await ApiService.post<Application>('/applications', applicationData);
    if (!response.success) {
      throw new Error(response.message || '创建申请失败');
    }
    return response.data;
  } catch (error) {
    console.error('创建申请失败:', error);
    throw error;
  }
};

// 更新申请
export const updateApplication = async (id: string, applicationData: Partial<Application>): Promise<Application> => {
  try {
    const response = await ApiService.put<Application>(`/applications/${id}`, applicationData);
    if (!response.success) {
      throw new Error(response.message || '更新申请失败');
    }
    return response.data;
  } catch (error) {
    console.error('更新申请失败:', error);
    throw error;
  }
};

// 删除申请
export const deleteApplication = async (id: string): Promise<void> => {
  try {
    const response = await ApiService.delete<void>(`/applications/${id}`);
    if (!response.success) {
      throw new Error(response.message || '删除申请失败');
    }
  } catch (error) {
    console.error('删除申请失败:', error);
    throw error;
  }
};

// 审批申请
export const approveApplication = async (id: string, approved: boolean, reason?: string): Promise<Application> => {
  try {
    const response = await ApiService.post<Application>(`/applications/${id}/approve`, {
      approved,
      reason
    });
    if (!response.success) {
      throw new Error(response.message || '审批申请失败');
    }
    return response.data;
  } catch (error) {
    console.error('审批申请失败:', error);
    throw error;
  }
};

// 获取我的申请列表
export const getMyApplications = async (
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Application>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });

    const response = await ApiService.get<PaginatedResponse<Application>>(`/applications/my?${params}`);
    if (!response.success) {
      throw new Error(response.message || '获取我的申请列表失败');
    }
    return response.data;
  } catch (error) {
    console.error('获取我的申请列表失败:', error);
    throw error;
  }
};

export const applicationService = {
  getApplicationStats,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  approveApplication,
  getMyApplications
};
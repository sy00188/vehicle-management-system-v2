import type { Expense, ExpenseFilters, PaginatedResponse } from '../types';
import { ApiService } from '../utils/api';

// 获取费用统计数据
export const getExpenseStats = async () => {
  const response = await ApiService.get<any>('/expenses/stats/overview');
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch expense stats');
  }
  return response.data;
};

// 获取费用列表（分页）
export const getExpenses = async (
  filters: ExpenseFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Expense>> => {
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
  if (filters.vehicleId) {
    params.append('vehicleId', filters.vehicleId);
  }
  if (filters.createdBy) {
    params.append('createdBy', filters.createdBy);
  }
  if (filters.serviceProvider) {
    params.append('serviceProvider', filters.serviceProvider);
  }
  if (filters.dateRange) {
    params.append('startDate', filters.dateRange.start);
    params.append('endDate', filters.dateRange.end);
  }
  if (filters.amountRange) {
    params.append('minAmount', filters.amountRange.min.toString());
    params.append('maxAmount', filters.amountRange.max.toString());
  }
  if (filters.search) {
    params.append('search', filters.search);
  }

  const response = await ApiService.get<PaginatedResponse<Expense>>(`/expenses?${params.toString()}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch expenses');
  }
  return response.data;
};

// 根据ID获取费用详情
export const getExpenseById = async (id: string): Promise<Expense> => {
  const response = await ApiService.get<Expense>(`/expenses/${id}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch expense');
  }
  return response.data;
};

// 创建费用记录
export const createExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
  const response = await ApiService.post<Expense>('/expenses', expenseData);
  if (!response.success) {
    throw new Error(response.message || 'Failed to create expense');
  }
  return response.data;
};

// 更新费用记录
export const updateExpense = async (id: string, expenseData: Partial<Expense>): Promise<Expense> => {
  const response = await ApiService.put<Expense>(`/expenses/${id}`, expenseData);
  if (!response.success) {
    throw new Error(response.message || 'Failed to update expense');
  }
  return response.data;
};

// 删除费用记录
export const deleteExpense = async (id: string): Promise<void> => {
  const response = await ApiService.delete<null>(`/expenses/${id}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to delete expense');
  }
};

// 获取车辆费用历史
export const getVehicleExpenseHistory = async (
  vehicleId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Expense>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  const response = await ApiService.get<PaginatedResponse<Expense>>(`/expenses/vehicle/${vehicleId}?${params.toString()}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch vehicle expense history');
  }
  return response.data;
};

// 获取费用报告摘要
export const getExpenseReportSummary = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) {
    params.append('startDate', startDate);
  }
  if (endDate) {
    params.append('endDate', endDate);
  }

  const response = await ApiService.get<any>(`/expenses/report/summary?${params.toString()}`);
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch expense report summary');
  }
  return response.data;
};
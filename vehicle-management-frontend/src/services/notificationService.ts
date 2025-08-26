import { ApiService } from '../utils/api';
import type { Notification } from '../stores/appStore';

export interface NotificationFilters {
  status?: 'read' | 'unread';
  type?: 'success' | 'error' | 'warning' | 'info';
  startDate?: string;
  endDate?: string;
}

export interface NotificationSortOptions {
  field: 'createdAt' | 'type' | 'status';
  order: 'asc' | 'desc';
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  userId?: string;
}

class NotificationService {
  private baseUrl = '/api/v1/notifications';

  // 获取通知列表
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    filters?: NotificationFilters,
    sort?: NotificationSortOptions
  ): Promise<NotificationListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }

    if (sort) {
      params.append('sortBy', sort.field);
      params.append('sortOrder', sort.order);
    }

    const response = await ApiService.get<NotificationListResponse>(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  // 获取单个通知详情
  async getNotificationById(id: string): Promise<Notification> {
    const response = await ApiService.get<Notification>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // 标记通知为已读
  async markAsRead(id: string): Promise<Notification> {
    const response = await ApiService.patch<Notification>(`${this.baseUrl}/${id}/read`);
    return response.data;
  }

  // 批量标记通知为已读
  async markMultipleAsRead(ids: string[]): Promise<{ success: boolean; updatedCount: number }> {
    const response = await ApiService.patch<{ success: boolean; updatedCount: number }>(`${this.baseUrl}/batch/read`, { ids });
    return response.data;
  }

  // 标记所有通知为已读
  async markAllAsRead(): Promise<{ success: boolean; updatedCount: number }> {
    const response = await ApiService.patch<{ success: boolean; updatedCount: number }>(`${this.baseUrl}/all/read`);
    return response.data;
  }

  // 删除通知
  async deleteNotification(id: string): Promise<{ success: boolean }> {
    const response = await ApiService.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // 批量删除通知
  async deleteMultipleNotifications(ids: string[]): Promise<{ success: boolean; deletedCount: number }> {
    const response = await ApiService.delete<{ success: boolean; deletedCount: number }>(`${this.baseUrl}/batch`, { data: { ids } });
    return response.data;
  }

  // 清空所有通知
  async clearAllNotifications(): Promise<{ success: boolean; deletedCount: number }> {
    const response = await ApiService.delete<{ success: boolean; deletedCount: number }>(`${this.baseUrl}/all`);
    return response.data;
  }

  // 创建通知（管理员功能）
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const response = await ApiService.post<Notification>(this.baseUrl, data);
    return response.data;
  }

  // 获取未读通知数量
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await ApiService.get<{ count: number }>(`${this.baseUrl}/unread/count`);
    return response.data;
  }

  // 获取通知统计信息
  async getNotificationStats(): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    recent: number;
  }> {
    const response = await ApiService.get<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    recent: number;
  }>(`${this.baseUrl}/stats`);
    return response.data;
  }

  // 订阅实时通知（WebSocket或SSE）
  subscribeToNotifications(_callback: (notification: Notification) => void): () => void {
    // 这里可以实现WebSocket或Server-Sent Events连接
    // 暂时返回一个空的取消订阅函数
    console.log('通知订阅功能待实现');
    return () => {
      console.log('取消通知订阅');
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
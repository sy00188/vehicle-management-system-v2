import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { storage } from './index';
import type { ApiResponse } from '../types';
import { refreshToken } from '../services/authService';

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = storage.get<string>('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求时间戳
    if (!config.metadata) {
      config.metadata = {};
    }
    config.metadata.startTime = new Date();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 用于防止多个401请求同时触发刷新
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 计算请求耗时
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(`API请求耗时: ${duration}ms - ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 如果是刷新token的请求失败，直接跳转登录页
          if (originalRequest.url?.includes('/auth/refresh')) {
            storage.remove('auth_token');
            storage.remove('refresh_token');
            storage.remove('user_info');
            window.location.href = '/login';
            return Promise.reject(error);
          }
          
          // 如果已经重试过，直接跳转登录页
          if (originalRequest._retry) {
            storage.remove('auth_token');
            storage.remove('refresh_token');
            storage.remove('user_info');
            window.location.href = '/login';
            return Promise.reject(error);
          }
          
          // 如果正在刷新token，将请求加入队列
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }
          
          originalRequest._retry = true;
          isRefreshing = true;
          
          try {
            const refreshTokenValue = storage.get<string>('refresh_token');
            if (!refreshTokenValue) {
              throw new Error('No refresh token available');
            }
            
            // 调用刷新token接口
            const newToken = await refreshToken(refreshTokenValue);
            
            // 更新存储的token
            storage.set('auth_token', newToken);
            // refreshToken函数已经在内部更新了localStorage，这里只需要更新我们的storage
            
            // 更新请求头
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // 处理队列中的请求
            processQueue(null, newToken);
            
            // 重试原始请求
            return apiClient(originalRequest);
          } catch (refreshError) {
            // 刷新失败，清除所有token并跳转登录页
            processQueue(refreshError, null);
            storage.remove('auth_token');
            storage.remove('refresh_token');
            storage.remove('user_info');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
          
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求失败: ${status}`, data?.message || error.message);
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API请求方法封装
export class ApiService {
  // GET请求
  static async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data;
  }
  
  // POST请求
  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }
  
  // PUT请求
  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }
  
  // PATCH请求
  static async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }
  
  // DELETE请求
  static async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
  
  // 文件上传
  static async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
    
    return response.data;
  }
  
  // 文件下载
  static async download(
    url: string,
    filename?: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    const response = await apiClient.get(url, {
      ...config,
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// 导出axios实例供特殊情况使用
export { apiClient };
export default ApiService;

// 扩展axios类型以支持metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime?: Date;
    };
  }
}
import type { User } from '../types';
import { ApiService } from '../utils/api';
import { storage } from '../utils';

// API响应类型
interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN' | 'MANAGER';
  department?: string;
  phone?: string;
  employeeId?: string;
}

// 错误类型定义
export interface AuthError {
  type: 'NETWORK_ERROR' | 'SERVER_ERROR' | 'VALIDATION_ERROR' | 'AUTH_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: string;
  statusCode?: number;
}

// 创建自定义错误类
export class AuthenticationError extends Error {
  public readonly type: AuthError['type'];
  public readonly statusCode?: number;
  public readonly details?: string;

  constructor(error: AuthError) {
    super(error.message);
    this.name = 'AuthenticationError';
    this.type = error.type;
    this.statusCode = error.statusCode;
    this.details = error.details;
  }
}

// 错误处理辅助函数
const handleAuthError = (error: any): AuthenticationError => {
  // 网络错误
  if (!navigator.onLine) {
    return new AuthenticationError({
      type: 'NETWORK_ERROR',
      message: '网络连接失败，请检查您的网络设置',
      details: '设备当前处于离线状态'
    });
  }

  // Axios 错误
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new AuthenticationError({
          type: 'VALIDATION_ERROR',
          message: data?.message || '请求参数错误，请检查输入信息',
          statusCode: status,
          details: '邮箱格式或密码格式不正确'
        });
      case 401:
        return new AuthenticationError({
          type: 'AUTH_ERROR',
          message: data?.message || '邮箱或密码错误，请重新输入',
          statusCode: status,
          details: '身份验证失败'
        });
      case 403:
        return new AuthenticationError({
          type: 'AUTH_ERROR',
          message: '账户已被禁用，请联系管理员',
          statusCode: status,
          details: '账户权限不足或已被锁定'
        });
      case 429:
        return new AuthenticationError({
          type: 'SERVER_ERROR',
          message: '登录尝试过于频繁，请稍后再试',
          statusCode: status,
          details: '触发了速率限制保护'
        });
      case 500:
      case 502:
      case 503:
      case 504:
        return new AuthenticationError({
          type: 'SERVER_ERROR',
          message: '服务器暂时无法响应，请稍后重试',
          statusCode: status,
          details: '服务器内部错误或维护中'
        });
      default:
        return new AuthenticationError({
          type: 'SERVER_ERROR',
          message: data?.message || `服务器错误 (${status})`,
          statusCode: status,
          details: '未知的服务器响应状态'
        });
    }
  }

  // 网络请求错误（无响应）
  if (error.request) {
    return new AuthenticationError({
      type: 'NETWORK_ERROR',
      message: '无法连接到服务器，请检查网络连接',
      details: '请求超时或服务器无响应'
    });
  }

  // 其他错误
  return new AuthenticationError({
    type: 'UNKNOWN_ERROR',
    message: error.message || '登录过程中发生未知错误',
    details: '请重试或联系技术支持'
  });
};

/**
 * 用户登录
 * @param username 用户名或邮箱
 * @param password 密码
 * @returns Promise<LoginResponse>
 */
export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await ApiService.post<{ user: User; accessToken: string; refreshToken?: string }>('/auth/login', {
      email: username, // 后端使用email字段
      password
    });

    if (response.success && response.data) {
      const { user, accessToken, refreshToken } = response.data;
      
      // 存储令牌
      storage.set('auth_token', accessToken);
      if (refreshToken) {
        storage.set('refresh_token', refreshToken);
      }
      
      return {
        user,
        token: accessToken,
        refreshToken,
        message: response.message || '登录成功'
      };
    } else {
      throw new AuthenticationError({
        type: 'AUTH_ERROR',
        message: response.message || '登录失败，请检查邮箱和密码',
        details: '服务器返回了失败响应'
      });
    }
  } catch (error: any) {
    // 如果已经是 AuthenticationError，直接抛出
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    // 否则处理并转换为 AuthenticationError
    throw handleAuthError(error);
  }
};

/**
 * 用户登出
 * @returns Promise<void>
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // 调用后端登出接口（如果有的话）
    await ApiService.post('/auth/logout', {});
  } catch (error) {
    // 即使后端登出失败，也要清除本地存储
    console.warn('后端登出失败，但继续清除本地存储:', error);
  } finally {
    // 清除本地存储的token和用户信息
    storage.remove('auth_token');
    storage.remove('refresh_token');
    storage.remove('user');
  }
};

/**
 * 验证token有效性
 * @param token JWT token
 * @returns Promise<User | null> 返回用户信息或null
 */
export const validateToken = async (token: string): Promise<User | null> => {
  try {
    const response = await ApiService.get<{ valid: boolean; user?: User }>('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.success && response.data?.valid === true && response.data.user) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * 刷新token
 * @param refreshToken 刷新token
 * @returns Promise<string>
 */
export const refreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await ApiService.post<{ accessToken: string; refreshToken?: string }>('/auth/refresh', {
      refreshToken
    });
    
    if (response.success && response.data) {
      // 更新本地存储的token
      storage.set('auth_token', response.data.accessToken);
      if (response.data.refreshToken) {
        storage.set('refresh_token', response.data.refreshToken);
      }
      
      return response.data.accessToken;
    } else {
      throw new Error(response.message || '刷新token失败');
    }
  } catch (error: any) {
    throw new Error(error.message || '刷新token请求失败');
  }
};

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns Promise<void>
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  try {
    const response = await ApiService.post<{}>('/auth/change-password', {
      oldPassword,
      newPassword
    });
    
    if (!response.success) {
      throw new Error(response.message || '密码修改失败');
    }
  } catch (error: any) {
    throw new Error(error.message || '密码修改请求失败');
  }
};

/**
 * 忘记密码
 * @param email 邮箱地址
 * @returns Promise<void>
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await ApiService.post<{}>('/auth/forgot-password', {
      email
    });
    
    if (!response.success) {
      throw new Error(response.message || '发送重置邮件失败');
    }
  } catch (error: any) {
    throw new Error(error.message || '发送重置邮件请求失败');
  }
};

/**
 * 用户注册
 * @param registerData 注册数据
 * @returns Promise<User>
 */
export const registerUser = async (registerData: RegisterData): Promise<User> => {
  try {
    const response = await ApiService.post<{ user: User }>('/auth/register', {
      name: registerData.name,
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      role: registerData.role || 'USER',
      department: registerData.department,
      phone: registerData.phone,
      employeeId: registerData.employeeId
    });
    
    if (response.success && response.data) {
      return response.data.user;
    } else {
      throw new Error(response.message || '注册失败');
    }
  } catch (error: any) {
    throw new Error(error.message || '注册请求失败');
  }
};
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { validateToken, refreshToken } from '../services/authService';

import { storage } from '../utils';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  hasHydrated: boolean;
  tokenExpiresAt: number | null;
  
  // Actions
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  checkAuth: () => Promise<boolean>;
  refreshTokens: () => Promise<boolean>;
  clearAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setTokens: (token: string, refreshToken?: string, expiresAt?: number) => void;
  isTokenExpiringSoon: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isRefreshing: false,
      hasHydrated: false,
      tokenExpiresAt: null,
      
      login: (user: User, token: string, refreshTokenValue?: string) => {
        // 计算token过期时间（假设token有效期为1小时）
        const expiresAt = Date.now() + (60 * 60 * 1000);
        
        set({
          user,
          token,
          refreshToken: refreshTokenValue || null,
          isAuthenticated: true,
          isLoading: false,
          tokenExpiresAt: expiresAt,
        });
        
        // 使用storage工具保存到localStorage，确保格式一致
        storage.set('auth_token', token);
        if (refreshTokenValue) {
          storage.set('refresh_token', refreshTokenValue);
        }
        storage.set('user_info', user);
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          isRefreshing: false,
          tokenExpiresAt: null,
        });
        
        // 清除本地存储
        storage.remove('auth_token');
        storage.remove('refresh_token');
        storage.remove('user_info');
      },
      
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setRefreshing: (refreshing: boolean) => {
        set({ isRefreshing: refreshing });
      },
      
      checkAuth: async (): Promise<boolean> => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }
        
        try {
          set({ isLoading: true });
          const user = await validateToken(token);
          
          if (user) {
            set({
              user: user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            get().clearAuth();
            return false;
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          get().clearAuth();
          return false;
        }
      },
      
      refreshTokens: async (): Promise<boolean> => {
        const { refreshToken: currentRefreshToken, isRefreshing } = get();
        
        if (!currentRefreshToken || isRefreshing) {
          return false;
        }
        
        try {
          set({ isRefreshing: true });
          
          const newAccessToken = await refreshToken(currentRefreshToken);
          
          if (newAccessToken) {
            const accessToken = newAccessToken;
            const newRefreshToken = currentRefreshToken; // 保持当前refreshToken
            const expiresAt = Date.now() + (60 * 60 * 1000); // 1小时后过期
            
            set({
              token: accessToken,
              refreshToken: newRefreshToken || currentRefreshToken,
              tokenExpiresAt: expiresAt,
              isRefreshing: false,
            });
            
            // 更新本地存储
            storage.set('auth_token', accessToken);
            if (newRefreshToken) {
              storage.set('refresh_token', newRefreshToken);
            }
            
            return true;
          } else {
            get().clearAuth();
            return false;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          set({ isRefreshing: false });
          get().clearAuth();
          return false;
        }
      },
      
      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          isRefreshing: false,
          tokenExpiresAt: null,
        });
        
        // 清除本地存储
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
      },
      
      setHasHydrated: (hydrated: boolean) => {
        set({ hasHydrated: hydrated });
      },
      
      setTokens: (token: string, refreshTokenValue?: string, expiresAt?: number) => {
        set({
          token,
          refreshToken: refreshTokenValue || get().refreshToken,
          tokenExpiresAt: expiresAt || (Date.now() + (60 * 60 * 1000)),
        });
      },
      
      isTokenExpiringSoon: (): boolean => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return false;
        
        // 如果token在5分钟内过期，认为即将过期
        const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
        return tokenExpiresAt <= fiveMinutesFromNow;
      },
    }),
    {
      name: 'auth-storage',
      // 只持久化必要的字段，不持久化isAuthenticated状态
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      // 自定义存储
        storage: {
          getItem: (name: string) => {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: (name: string, value: any) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name: string) => {
            localStorage.removeItem(name);
          },
        },
        // 水合完成回调
        onRehydrateStorage: () => {
          return (state, error) => {
            console.log('Zustand rehydration completed', { state, error });
            // 无论是否有错误，都设置hasHydrated为true，因为水合过程已完成
            useAuthStore.getState().setHasHydrated(true);
          };
        },
    }
  )
);

// 辅助函数
export const authHelpers = {
  getCurrentUser: () => useAuthStore.getState().user,
  getCurrentToken: () => useAuthStore.getState().token,
  getCurrentRefreshToken: () => useAuthStore.getState().refreshToken,
  isAuthenticated: () => useAuthStore.getState().isAuthenticated,
  isRefreshing: () => useAuthStore.getState().isRefreshing,
  isTokenExpiringSoon: () => useAuthStore.getState().isTokenExpiringSoon(),
  checkRole: (role: string) => {
    const user = useAuthStore.getState().user;
    return user?.role === role;
  },
  checkPermission: (_permission: string) => {
    // User类型中没有permissions字段，暂时返回false
    return false;
  },
};
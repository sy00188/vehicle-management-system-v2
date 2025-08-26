import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // UI 状态
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  
  // 加载状态
  globalLoading: boolean;
  
  // 通知状态
  notifications: Notification[];
  
  // 操作
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'zh' | 'en') => void;
  setGlobalLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp?: number;
  read?: boolean;
  createdAt: string;
  data?: any;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      sidebarCollapsed: false,
      theme: 'light',
      language: 'zh',
      globalLoading: false,
      notifications: [],
      
      // 切换侧边栏
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
      
      // 设置侧边栏状态
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      // 设置主题
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        // 更新 HTML 类名
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // 设置语言
      setLanguage: (language: 'zh' | 'en') => {
        set({ language });
      },
      
      // 设置全局加载状态
      setGlobalLoading: (loading: boolean) => {
        set({ globalLoading: loading });
      },
      
      // 添加通知
      addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'createdAt'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const duration = notification.duration || 5000;
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now(),
          duration,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
        
        // 自动移除通知
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, duration);
        }
      },
      
      // 移除通知
      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      
      // 清除所有通知
      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'app-storage',
      // 只持久化UI相关的设置
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);

// 应用状态相关的辅助函数
export const appHelpers = {
  // 显示成功通知
  showSuccess: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'success',
      title,
      message,
    });
  },
  
  // 显示错误通知
  showError: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // 错误通知显示更长时间
    });
  },
  
  // 显示警告通知
  showWarning: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'warning',
      title,
      message,
    });
  },
  
  // 显示信息通知
  showInfo: (title: string, message?: string) => {
    useAppStore.getState().addNotification({
      type: 'info',
      title,
      message,
    });
  },
  
  // 获取当前主题
  getCurrentTheme: (): 'light' | 'dark' => {
    return useAppStore.getState().theme;
  },
  
  // 获取当前语言
  getCurrentLanguage: (): 'zh' | 'en' => {
    return useAppStore.getState().language;
  },
  
  // 初始化主题
  initializeTheme: () => {
    const theme = useAppStore.getState().theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
};

export type { Notification };
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import router from './router';
import { queryClient } from './utils/queryClient';
import { useAppStore } from './stores';
import { useAuthStore } from './stores/authStore';
import { validateToken } from './services/authService';
import { useTokenRefresh } from './hooks/useTokenRefresh';

function App() {
  const { theme } = useAppStore();
  const { token, isAuthenticated, hasHydrated, setLoading, login, clearAuth, setHasHydrated } = useAuthStore();
  
  // 启用令牌自动刷新功能
  useTokenRefresh();

  // 确保hasHydrated在组件挂载时被设置（备用方案）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasHydrated) {
        console.log('Forcing hasHydrated to true after timeout');
        setHasHydrated(true);
      }
    }, 100); // 100ms后强制设置
    
    return () => clearTimeout(timer);
  }, [hasHydrated, setHasHydrated]);

  // 应用主题到 HTML 根元素
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // 检查认证状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      // 等待水合完成后再进行认证检查
      if (!hasHydrated) {
        return;
      }
      
      if (token && !isAuthenticated) {
        setLoading(true);
        try {
          const user = await validateToken(token);
          if (user) {
            login(user, token);
          } else {
            clearAuth();
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          clearAuth();
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();
  }, [token, isAuthenticated, hasHydrated, setLoading, login, clearAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
      {/* React Query 开发工具 */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;

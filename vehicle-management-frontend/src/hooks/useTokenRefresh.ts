import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * 自定义hook，用于处理令牌的主动刷新
 * 当令牌即将过期时自动刷新
 */
export const useTokenRefresh = () => {
  const {
    isAuthenticated,
    isRefreshing,
    isTokenExpiringSoon,
    refreshTokens,
  } = useAuthStore();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    // 只有在用户已认证时才启动定时检查
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 定时检查令牌是否即将过期（每分钟检查一次）
    const checkTokenExpiration = async () => {
      // 防止重复检查
      if (isCheckingRef.current || isRefreshing) {
        return;
      }

      try {
        isCheckingRef.current = true;
        
        // 检查令牌是否即将过期
        if (isTokenExpiringSoon()) {
          console.log('Token is expiring soon, attempting to refresh...');
          const success = await refreshTokens();
          
          if (success) {
            console.log('Token refreshed successfully');
          } else {
            console.log('Token refresh failed, user will be logged out');
          }
        }
      } catch (error) {
        console.error('Error during proactive token refresh:', error);
      } finally {
        isCheckingRef.current = false;
      }
    };

    // 立即检查一次
    checkTokenExpiration();

    // 设置定时器，每分钟检查一次
    intervalRef.current = setInterval(checkTokenExpiration, 60 * 1000);

    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isCheckingRef.current = false;
    };
  }, [isAuthenticated, isRefreshing, isTokenExpiringSoon, refreshTokens]);

  // 手动触发令牌刷新的方法
  const manualRefresh = async () => {
    if (isRefreshing || !isAuthenticated) {
      return false;
    }

    try {
      const success = await refreshTokens();
      return success;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  return {
    isRefreshing,
    manualRefresh,
  };
};
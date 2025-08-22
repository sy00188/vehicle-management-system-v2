import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '../../utils';
import { useAppStore } from '../../stores';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ className }) => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* 侧边栏 */}
      <Sidebar />
      
      {/* 头部导航 */}
      <Header />
      
      {/* 主内容区域 */}
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
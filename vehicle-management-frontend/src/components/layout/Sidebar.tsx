import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  Users, 
  Wrench, 
  DollarSign, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils';
import { useAppStore } from '../../stores';
import { NAVIGATION_ITEMS } from '../../utils/constants';

// 图标映射
const iconMap = {
  dashboard: LayoutDashboard,
  vehicles: Car,
  applications: FileText,
  drivers: Users,
  maintenance: Wrench,
  expenses: DollarSign,
  settings: Settings,
};

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        'dark:bg-gray-900 dark:border-gray-700',
        sidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* 侧边栏头部 */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              车辆管理系统
            </span>
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
            sidebarCollapsed && 'mx-auto'
          )}
          aria-label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = location.pathname === item.path || 
            location.pathname.startsWith(item.path + '/');

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive: navIsActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  (isActive || navIsActive)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100',
                  sidebarCollapsed && 'justify-center px-2'
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className={cn('w-5 h-5 flex-shrink-0', !sidebarCollapsed && 'mr-3')} />}
              {!sidebarCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 侧边栏底部 */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            车辆管理系统 v1.0.0
          </div>
        </div>
      )}
    </aside>
  );
};
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ROUTES } from '../utils/constants';
import { useAuthStore } from '../stores/authStore';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

// 占位符组件
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        此页面正在开发中...
      </p>
    </div>
  </div>
);

// 导入页面组件
import Dashboard from '../pages/dashboard/Dashboard';
import Vehicles from '../pages/vehicles/Vehicles';
import Applications from '../pages/applications/Applications';
import ApplicationForm from '../pages/applications/ApplicationForm';
import Drivers from '../pages/drivers/Drivers';
import Maintenance from '../pages/maintenance/Maintenance';
import MaintenanceForm from '../pages/maintenance/MaintenanceForm';
import Expense from '../pages/expense/Expense';
import ExpenseForm from '../pages/expense/ExpenseForm';
import ExpenseDetail from '../pages/expense/ExpenseDetail';
import DriverForm from '../pages/driver/DriverForm';
import DriverDetail from '../pages/driver/DriverDetail';
import Settings from '../pages/settings/Settings';
import Reports from '../pages/reports/Reports';
import Notifications from '../pages/notifications/Notifications';

import VehicleDetail from '../pages/vehicles/VehicleDetail';
// 临时占位组件
// const TempApplicationForm = () => <PlaceholderPage title="申请表单" />;
// const TempMaintenanceList = () => <PlaceholderPage title="维修管理" />;
// const TempExpenseList = () => <PlaceholderPage title="费用管理" />;

// 路由保护组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, token, hasHydrated } = useAuthStore();
  
  // 如果persist还未完成水合，显示加载状态
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // 如果正在加载或有token但还未完成认证检查，显示加载状态
  if (isLoading || (token && !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return <>{children}</>;
};

// 错误边界组件
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense 
      fallback={
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <ErrorBoundary>
        <Login />
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <ErrorBoundary>
        <Register />
      </ErrorBoundary>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        ),
      },
      {
        path: ROUTES.VEHICLES,
        element: (
          <ErrorBoundary>
            <Vehicles />
          </ErrorBoundary>
        ),
      },
      {
        path: `${ROUTES.VEHICLES}/:id`,
        element: (
          <ErrorBoundary>
            <VehicleDetail />
          </ErrorBoundary>
        ),
      },
      {
        path: ROUTES.APPLICATIONS,
        element: (
          <ErrorBoundary>
            <Applications />
          </ErrorBoundary>
        ),
      },
      {
        path: `${ROUTES.APPLICATIONS}/new`,
        element: (
          <ErrorBoundary>
            <ApplicationForm />
          </ErrorBoundary>
        ),
      },
      {
        path: `${ROUTES.APPLICATIONS}/:id/edit`,
        element: (
          <ErrorBoundary>
            <ApplicationForm />
          </ErrorBoundary>
        ),
      },
      {
        path: ROUTES.DRIVERS,
        element: (
          <ErrorBoundary>
            <Drivers />
          </ErrorBoundary>
        ),
      },
      {
        path: '/maintenance',
        element: (
          <ErrorBoundary>
            <Maintenance />
          </ErrorBoundary>
        ),
      },
      {
        path: '/maintenance/new',
        element: (
          <ErrorBoundary>
            <MaintenanceForm />
          </ErrorBoundary>
        ),
      },
      {
        path: '/maintenance/:id/edit',
        element: (
          <ErrorBoundary>
            <MaintenanceForm />
          </ErrorBoundary>
        ),
      },
      {
        path: '/expenses',
        element: (
          <ErrorBoundary>
            <Expense />
          </ErrorBoundary>
        ),
      },
      {
        path: '/expenses/new',
        element: (
          <ErrorBoundary>
            <ExpenseForm />
          </ErrorBoundary>
        ),
      },
      {
        path: '/expenses/:id/edit',
        element: (
          <ErrorBoundary>
            <ExpenseForm />
          </ErrorBoundary>
        ),
      },
      {
          path: '/expenses/:id',
          element: (
            <ErrorBoundary>
              <ExpenseDetail />
            </ErrorBoundary>
          )
        },
        {
          path: '/drivers/new',
          element: (
            <ErrorBoundary>
              <DriverForm />
            </ErrorBoundary>
          )
        },
        {
          path: '/drivers/:id/edit',
          element: (
            <ErrorBoundary>
              <DriverForm />
            </ErrorBoundary>
          )
        },
        {
          path: '/drivers/:id',
          element: (
            <ErrorBoundary>
              <DriverDetail />
            </ErrorBoundary>
          )
        },
      {
        path: ROUTES.SETTINGS,
        element: (
          <ErrorBoundary>
            <Settings />
          </ErrorBoundary>
        ),
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: (
          <ErrorBoundary>
            <Notifications />
          </ErrorBoundary>
        ),
      },
      {
        path: '/reports',
        element: (
          <ErrorBoundary>
            <Reports />
          </ErrorBoundary>
        ),
      },
      {
        path: '*',
        element: <PlaceholderPage title="页面未找到" />,
      },
    ],
  },
]);

export default router;
import React, { useState, useEffect } from 'react';
import type { 
  DashboardStats, 
  ActivityRecord, 
  TodoItem, 
  QuickAction,
  UsageChartData,
  ExpenseChartData 
} from '../../types';
import { getDashboardData } from '../../services/dashboardService';
import StatsCards from './components/StatsCards';
import UsageChart from './components/UsageChart';
import ExpenseChart from './components/ExpenseChart';
import RecentActivities from './components/RecentActivities';
import TodoList from './components/TodoList';
import QuickActions from './components/QuickActions';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [usageData, setUsageData] = useState<UsageChartData[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseChartData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setStats(data.stats);
        setActivities(data.activities);
        setTodos(data.todos);
        setQuickActions(data.quickActions);
        setUsageData(data.usageData);
        setExpenseData(data.expenseData);
      } catch (err) {
        setError('加载仪表板数据失败');
        console.error('Dashboard data fetch error:', err);
        // 设置默认值以防止undefined错误
        setStats(null);
        setActivities([]);
        setTodos([]);
        setQuickActions([]);
        setUsageData([]);
        setExpenseData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            <i className="fas fa-sync-alt mr-2"></i>
            刷新
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <i className="fas fa-download mr-2"></i>
            导出报表
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      {stats && <StatsCards stats={stats} />}

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageChart data={usageData} />
        <ExpenseChart data={expenseData} />
      </div>

      {/* 活动和待办事项 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities activities={activities} />
        </div>
        <div className="space-y-6">
          <TodoList todos={todos} />
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
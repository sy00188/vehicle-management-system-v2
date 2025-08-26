import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Download, RefreshCw } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { getExpenseStats } from '../../services/expenseService';
import { maintenanceService } from '../../services/maintenanceService';
import { applicationService } from '../../services/applicationService';
import { getDashboardStats } from '../../services/dashboardService';
import VehicleUsageChart from './components/VehicleUsageChart';
import ExpenseAnalysisChart from './components/ExpenseAnalysisChart';
import MaintenanceChart from './components/MaintenanceChart';
import ApplicationChart from './components/ApplicationChart';
import ReportSummary from './components/ReportSummary';
import type { DashboardStats, VehicleStats, ExpenseStats, MaintenanceStats, ApplicationStats } from '../../types';

interface DateRange {
  start: string;
  end: string;
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // 统计数据状态
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [vehicleStats, setVehicleStats] = useState<VehicleStats | null>(null);
  const [expenseStats, setExpenseStats] = useState<ExpenseStats | null>(null);
  const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | null>(null);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats | null>(null);
  
  // 图表数据状态
  const [usageChartData, setUsageChartData] = useState<Array<{month: string; usageRate: number}>>([]);
  const [expenseChartData, setExpenseChartData] = useState<Array<{category: string; amount: number; color: string}>>([]);
  const [maintenanceChartData, setMaintenanceChartData] = useState<Array<{month: string; count: number; cost: number}>>([]);
  const [applicationChartData, setApplicationChartData] = useState<Array<{status: string; count: number; color: string}>>([]);

  // 加载所有报表数据
  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // 并行加载所有数据
      const [dashboardData, vehicleData, expenseData, maintenanceData, applicationData] = await Promise.all([
        getDashboardStats(),
        vehicleService.getVehicleStats(),
        getExpenseStats(),
        maintenanceService.getMaintenanceStats(),
        applicationService.getApplicationStats()
      ]);
      
      setDashboardStats(dashboardData);
      setVehicleStats(vehicleData);
      setExpenseStats(expenseData);
      setMaintenanceStats(maintenanceData);
      setApplicationStats(applicationData as unknown as ApplicationStats);
      console.log('Loaded data:', { dashboardData, vehicleData, expenseData, maintenanceData, applicationData });
      
      // 加载图表数据
      await loadChartData();
      
    } catch (error) {
      console.error('加载报表数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 加载图表数据
  const loadChartData = async () => {
    try {
      // 这里可以根据实际API调用获取图表数据
      // 暂时使用模拟数据
      // 设置图表数据
      setUsageChartData([
        { month: '1月', usageRate: 75 },
        { month: '2月', usageRate: 82 },
        { month: '3月', usageRate: 68 },
        { month: '4月', usageRate: 91 },
        { month: '5月', usageRate: 85 },
        { month: '6月', usageRate: 78 }
      ]);
      
      setExpenseChartData([
        { category: '燃油费', amount: 25000, color: '#3b82f6' },
        { category: '维修费', amount: 18000, color: '#ef4444' },
        { category: '保险费', amount: 12000, color: '#10b981' },
        { category: '其他费用', amount: 8000, color: '#f59e0b' }
      ]);
      
      setMaintenanceChartData([
        { month: '1月', count: 5, cost: 8000 },
        { month: '2月', count: 3, cost: 6000 },
        { month: '3月', count: 7, cost: 12000 },
        { month: '4月', count: 4, cost: 7000 },
        { month: '5月', count: 6, cost: 9000 },
        { month: '6月', count: 8, cost: 10000 }
      ]);
      
      setApplicationChartData([
        { status: '待审批', count: 15, color: '#f59e0b' },
        { status: '已批准', count: 45, color: '#10b981' },
        { status: '已拒绝', count: 8, color: '#ef4444' },
        { status: '已完成', count: 32, color: '#3b82f6' }
      ]);
      
    } catch (error) {
      console.error('加载图表数据失败:', error);
    }
  };
  
  // 导出报表
  const handleExportReport = () => {
    // 实现报表导出功能
    console.log('导出报表');
  };
  
  // 刷新数据
  const handleRefresh = () => {
    loadReportData();
  };
  
  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">加载报表数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
            报表与数据分析
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            车辆管理系统的全面数据分析和统计报表
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          {/* 日期范围选择 */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">至</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </button>
            
            <button
              onClick={handleExportReport}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4 mr-2" />
              导出报表
            </button>
          </div>
        </div>
      </div>
      
      {/* 报表概览 */}
      <ReportSummary 
        dashboardStats={dashboardStats}
        vehicleStats={vehicleStats}
        expenseStats={expenseStats}
        maintenanceStats={maintenanceStats}
        applicationStats={applicationStats}
      />
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 车辆使用率趋势 */}
        <VehicleUsageChart data={usageChartData} />
        
        {/* 费用分析 */}
        <ExpenseAnalysisChart data={expenseChartData} />
        
        {/* 维护统计 */}
        <MaintenanceChart data={maintenanceChartData} />
        
        {/* 申请统计 */}
        <ApplicationChart data={applicationChartData} />
      </div>
    </div>
  );
};

export default Reports;
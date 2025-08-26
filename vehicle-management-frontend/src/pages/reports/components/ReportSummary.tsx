import React from 'react';
import { TrendingUp, TrendingDown, Minus, Car, Wrench, FileText, DollarSign } from 'lucide-react';

import type { DashboardStats, VehicleStats, ExpenseStats, MaintenanceStats, ApplicationStats } from '../../../types';

interface ReportSummaryProps {
  dashboardStats: DashboardStats | null;
  vehicleStats: VehicleStats | null;
  expenseStats: ExpenseStats | null;
  maintenanceStats: MaintenanceStats | null;
  applicationStats: ApplicationStats | null;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ 
  dashboardStats, 
  vehicleStats, 
  expenseStats, 
  maintenanceStats, 
  applicationStats 
}) => {
  // 如果数据还在加载中，显示加载状态
  if (!dashboardStats || !vehicleStats || !expenseStats || !maintenanceStats || !applicationStats) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // 构建汇总数据 - 根据实际API接口映射属性
  const data = {
    totalVehicles: vehicleStats.total || 0,
    activeVehicles: vehicleStats.available || 0,
    totalApplications: applicationStats.total || 0,
    pendingApplications: applicationStats.pending || 0,
    totalMaintenance: maintenanceStats.total || 0,
    totalExpense: expenseStats.totalAmount || 0,
    monthlyExpense: expenseStats.monthlyAmount || 0,
    expenseChange: 0, // ExpenseStats接口中没有此字段，暂时设为0
    usageRate: vehicleStats.utilizationRate || 0,
    usageChange: 0 // VehicleStats接口中没有此字段，暂时设为0
  };
  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (change: number) => {
    if (change > 0) {
      return 'text-green-600';
    } else if (change < 0) {
      return 'text-red-600';
    } else {
      return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const summaryCards = [
    {
      title: '车辆总数',
      value: data.totalVehicles,
      subtitle: `活跃车辆: ${data.activeVehicles}`,
      icon: Car,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: '申请总数',
      value: data.totalApplications,
      subtitle: `待处理: ${data.pendingApplications}`,
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: '维护记录',
      value: data.totalMaintenance,
      subtitle: '本月维护次数',
      icon: Wrench,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: '总费用',
      value: formatCurrency(data.totalExpense),
      subtitle: `本月: ${formatCurrency(data.monthlyExpense)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: data.expenseChange,
      trendLabel: '较上月'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">数据概览</h3>
        <p className="text-sm text-gray-600">车辆管理系统关键指标汇总</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={`${card.bgColor} ${card.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.color} text-white p-2 rounded-lg`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                {card.trend !== undefined && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(card.trend)}
                    <span className={`text-xs font-medium ${getTrendColor(card.trend)}`}>
                      {Math.abs(card.trend)}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-600">{card.title}</h4>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">
                  {card.subtitle}
                  {card.trendLabel && (
                    <span className={`ml-1 ${getTrendColor(card.trend || 0)}`}>
                      {card.trendLabel}
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 使用率指标 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">车辆使用率</h4>
          <div className="flex items-center space-x-1">
            {getTrendIcon(data.usageChange)}
            <span className={`text-xs font-medium ${getTrendColor(data.usageChange)}`}>
              {Math.abs(data.usageChange)}% 较上月
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(data.usageRate, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-lg font-bold text-gray-900">{data.usageRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;
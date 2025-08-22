import React from 'react';
import type { DashboardStats } from '../../../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: '总车辆数',
      value: stats.totalVehicles,
      change: '+2 本月',
      changeType: 'positive' as const,
      icon: 'fas fa-car',
      iconColor: 'bg-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: '可用车辆',
      value: stats.availableVehicles,
      change: `${stats.usageRate}% 可用率`,
      changeType: 'neutral' as const,
      icon: 'fas fa-check-circle',
      iconColor: 'bg-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: '待审批申请',
      value: stats.pendingApplications,
      change: '需处理',
      changeType: 'warning' as const,
      icon: 'fas fa-file-alt',
      iconColor: 'bg-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      title: '本月费用',
      value: `¥${stats.monthlyExpenses.toLocaleString()}`,
      change: `+${stats.expenseChange}% 环比`,
      changeType: 'negative' as const,
      icon: 'fas fa-calculator',
      iconColor: 'bg-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];

  const getChangeColor = (type: 'positive' | 'negative' | 'warning' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (type: 'positive' | 'negative' | 'warning' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'fas fa-arrow-up';
      case 'negative':
        return 'fas fa-arrow-up';
      case 'warning':
        return 'fas fa-clock';
      case 'neutral':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className={`text-sm flex items-center ${getChangeColor(card.changeType)}`}>
                {getChangeIcon(card.changeType) && (
                  <i className={`${getChangeIcon(card.changeType)} mr-1`}></i>
                )}
                {card.change}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <i className={`${card.icon} text-white text-xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
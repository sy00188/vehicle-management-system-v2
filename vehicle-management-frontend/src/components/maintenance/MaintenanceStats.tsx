import React from 'react';
import type { MaintenanceStats } from '../../types';

interface MaintenanceStatsProps {
  stats: MaintenanceStats;
}

const MaintenanceStats: React.FC<MaintenanceStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: '总维修记录',
      value: stats.total,
      icon: '🔧',
      color: 'bg-blue-500',
    },
    {
      label: '待维修',
      value: stats.pending,
      icon: '⏳',
      color: 'bg-yellow-500',
    },
    {
      label: '维修中',
      value: stats.inProgress,
      icon: '🔄',
      color: 'bg-blue-600',
    },
    {
      label: '已完成',
      value: stats.completed,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      label: '总费用',
      value: `¥${stats.totalCost.toLocaleString()}`,
      icon: '💰',
      color: 'bg-purple-500',
    },
    {
      label: '平均费用',
      value: `¥${stats.averageCost.toLocaleString()}`,
      icon: '📊',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceStats;
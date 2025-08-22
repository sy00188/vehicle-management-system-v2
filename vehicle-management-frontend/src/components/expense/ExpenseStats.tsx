import React from 'react';
import type { ExpenseStats as ExpenseStatsType } from '../../types';
import { formatCurrency } from '../../utils/format';

interface ExpenseStatsProps {
  stats: ExpenseStatsType;
}

const ExpenseStats: React.FC<ExpenseStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: '本月总费用',
      value: formatCurrency(stats.monthlyAmount),
      icon: 'fas fa-chart-line',
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: '燃油费用',
      value: formatCurrency(stats.fuelCost),
      icon: 'fas fa-gas-pump',
      color: 'bg-orange-600',
      textColor: 'text-orange-600'
    },
    {
      title: '维修费用',
      value: formatCurrency(stats.maintenanceCost),
      icon: 'fas fa-wrench',
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: '待审批费用',
      value: formatCurrency(stats.pending),
      icon: 'fas fa-clock',
      color: 'bg-yellow-600',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
            </div>
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
              <i className={`${card.icon} text-white text-xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseStats;
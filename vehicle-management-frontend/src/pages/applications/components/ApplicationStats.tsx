import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import type { ApplicationStats as ApplicationStatsType } from '../../../types';

interface ApplicationStatsProps {
  stats: ApplicationStatsType;
}

const ApplicationStats: React.FC<ApplicationStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: '总申请数',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: '待审批',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: '已批准',
      value: stats.approved,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: '已拒绝',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: '通过率',
      value: `${stats.approvalRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationStats;
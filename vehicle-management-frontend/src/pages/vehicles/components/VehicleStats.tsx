import React from 'react';
import { Car, CheckCircle, Clock, Wrench } from 'lucide-react';
import type { VehicleStats as VehicleStatsType } from '../../../types';

interface VehicleStatsProps {
  stats: VehicleStatsType;
}

const VehicleStats: React.FC<VehicleStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: '总车辆数',
      value: stats.total,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: '空闲车辆',
      value: stats.available,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: '使用中',
      value: stats.inUse,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: '维护中',
      value: stats.maintenance,
      icon: Wrench,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`bg-white border ${item.borderColor} rounded-lg p-4 hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VehicleStats;
import React from 'react';
import { Users, UserCheck, UserX, Clock, Star } from 'lucide-react';
import { DRIVER_STATUS, DRIVER_STATUS_LABELS, DRIVER_STATUS_COLORS } from '../../utils/constants';

interface DriverStatsProps {
  stats: {
    total: number;
    available: number;
    busy: number;
    onLeave: number;
    inactive: number;
    averageRating: number;
  };
}

const DriverStats: React.FC<DriverStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: '总驾驶员',
      value: stats.total,
      icon: Users,
      color: 'primary',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: DRIVER_STATUS_LABELS[DRIVER_STATUS.AVAILABLE],
      value: stats.available,
      icon: UserCheck,
      color: DRIVER_STATUS_COLORS[DRIVER_STATUS.AVAILABLE],
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: DRIVER_STATUS_LABELS[DRIVER_STATUS.BUSY],
      value: stats.busy,
      icon: UserX,
      color: DRIVER_STATUS_COLORS[DRIVER_STATUS.BUSY],
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      label: DRIVER_STATUS_LABELS[DRIVER_STATUS.ON_LEAVE],
      value: stats.onLeave,
      icon: Clock,
      color: DRIVER_STATUS_COLORS[DRIVER_STATUS.ON_LEAVE],
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: '平均评分',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'warning',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      suffix: '分',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value}
                  {item.suffix && (
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {item.suffix}
                    </span>
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DriverStats;
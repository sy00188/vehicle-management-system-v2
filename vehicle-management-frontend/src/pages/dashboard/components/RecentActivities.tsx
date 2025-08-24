import React from 'react';
import type { ActivityRecord } from '../../../types';

interface RecentActivitiesProps {
  activities: ActivityRecord[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities = [] }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return '刚刚';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}小时前`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}天前`;
    }
  };

  const getActivityTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      application: '申请',
      approval: '审批',
      maintenance: '维护',
      vehicle_added: '车辆',
      expense: '费用'
    };
    return typeMap[type] || '其他';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">最近活动</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          查看全部
        </button>
      </div>

      <div className="space-y-4">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-inbox text-3xl mb-3"></i>
            <p>暂无活动记录</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 ${activity.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <i className={`${activity.icon} text-white text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {getActivityTypeText(activity.type)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {activities && activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 rounded-lg hover:bg-primary-50 transition-colors">
            查看更多活动
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
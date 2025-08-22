import React from 'react';
import { Phone, Mail, Calendar, Star, MapPin, Edit, Eye, UserPlus } from 'lucide-react';
import type { Driver } from '../../types';
import {
  DRIVER_STATUS_LABELS,
  LICENSE_TYPE_LABELS,
} from '../../utils/constants';

interface DriverCardProps {
  driver: Driver;
  onEdit: (driver: Driver) => void;
  onView: (driver: Driver) => void;
  onAssignTask: (driver: Driver) => void;
  onCall: (driver: Driver) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onEdit,
  onView,
  onAssignTask,
  onCall,
}) => {
  const getStatusBadgeColor = (status: string) => {
    const colorMap: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      on_leave: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {driver.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getStatusBadgeColor(driver.status)
              }`}
            >
              {DRIVER_STATUS_LABELS[driver.status]}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {renderStars(driver.rating)}
          <span className="text-sm text-gray-600 ml-1">({driver.rating})</span>
        </div>
      </div>

      {/* 联系信息 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          <span>{driver.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <span>{driver.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>驾照类型: {LICENSE_TYPE_LABELS[driver.licenseType as keyof typeof LICENSE_TYPE_LABELS]}</span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {driver.monthlyTasks}
          </div>
          <div className="text-xs text-gray-600">本月任务</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {driver.totalTasks}
          </div>
          <div className="text-xs text-gray-600">总任务数</div>
        </div>
      </div>

      {/* 当前状态信息 */}
      {driver.status === 'busy' && driver.currentTask && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center text-sm text-yellow-800">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="font-medium">当前任务:</span>
          </div>
          <div className="text-sm text-yellow-700 mt-1">
            {driver.currentTask}
          </div>
        </div>
      )}

      {driver.status === 'on_leave' && driver.leaveReason && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center text-sm text-blue-800">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">请假原因:</span>
          </div>
          <div className="text-sm text-blue-700 mt-1">
            {driver.leaveReason}
          </div>
          {driver.leaveEndDate && (
            <div className="text-xs text-blue-600 mt-1">
              预计返回: {new Date(driver.leaveEndDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        {driver.status === 'available' && (
          <button
            onClick={() => onAssignTask(driver)}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            分配任务
          </button>
        )}
        <button
          onClick={() => onEdit(driver)}
          className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          <Edit className="h-4 w-4 mr-1" />
          编辑
        </button>
        <button
          onClick={() => onView(driver)}
          className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          <Eye className="h-4 w-4 mr-1" />
          查看
        </button>
        <button
          onClick={() => onCall(driver)}
          className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 transition-colors"
        >
          <Phone className="h-4 w-4 mr-1" />
          拨打
        </button>
      </div>
    </div>
  );
};

export default DriverCard;
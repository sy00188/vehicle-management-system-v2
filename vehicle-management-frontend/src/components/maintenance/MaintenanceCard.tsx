import React from 'react';
import type { MaintenanceRecord } from '../../types';
import {
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_STATUS_COLORS,
  MAINTENANCE_TYPE_LABELS,
  MAINTENANCE_PRIORITY_LABELS,
  MAINTENANCE_PRIORITY_COLORS,
} from '../../utils/constants';

interface MaintenanceCardProps {
  maintenance: MaintenanceRecord;
  onEdit?: (maintenance: MaintenanceRecord) => void;
  onView?: (maintenance: MaintenanceRecord) => void;
  onDelete?: (maintenance: MaintenanceRecord) => void;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  maintenance,
  onEdit,
  onView,
  onDelete,
}) => {
  const statusColor = MAINTENANCE_STATUS_COLORS[maintenance.status as keyof typeof MAINTENANCE_STATUS_COLORS];
  const priorityColor = MAINTENANCE_PRIORITY_COLORS[maintenance.priority as keyof typeof MAINTENANCE_PRIORITY_COLORS];

  const getStatusBadgeClass = (color: string) => {
    const colorMap = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      primary: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadgeClass = (color: string) => {
    const colorMap = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      primary: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {maintenance.vehicle.plateNumber}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(statusColor)}`}>
              {MAINTENANCE_STATUS_LABELS[maintenance.status as keyof typeof MAINTENANCE_STATUS_LABELS]}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(priorityColor)}`}>
              {MAINTENANCE_PRIORITY_LABELS[maintenance.priority as keyof typeof MAINTENANCE_PRIORITY_LABELS]}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {maintenance.vehicle.brand} {maintenance.vehicle.model}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            ¥{maintenance.cost.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(maintenance.date)}
          </p>
        </div>
      </div>

      {/* 维修信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">维修类型</p>
          <p className="text-sm font-medium text-gray-900">
            {MAINTENANCE_TYPE_LABELS[maintenance.type as keyof typeof MAINTENANCE_TYPE_LABELS]}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">服务商</p>
          <p className="text-sm font-medium text-gray-900">
            {maintenance.serviceProvider}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">维修时里程</p>
          <p className="text-sm font-medium text-gray-900">
            {maintenance.mileageAtService.toLocaleString()} km
          </p>
        </div>
        {maintenance.completedDate && (
          <div>
            <p className="text-sm text-gray-500 mb-1">完成日期</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(maintenance.completedDate)}
            </p>
          </div>
        )}
      </div>

      {/* 描述 */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">维修描述</p>
        <p className="text-sm text-gray-900 line-clamp-2">
          {maintenance.description}
        </p>
      </div>

      {/* 配件信息 */}
      {maintenance.parts && maintenance.parts.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">更换配件</p>
          <div className="flex flex-wrap gap-1">
            {maintenance.parts.map((part, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {part}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 备注 */}
      {maintenance.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">备注</p>
          <p className="text-sm text-gray-900">
            {maintenance.notes}
          </p>
        </div>
      )}

      {/* 下次保养日期 */}
      {maintenance.nextMaintenanceDate && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">下次保养日期</p>
          <p className="text-sm font-medium text-blue-600">
            {formatDate(maintenance.nextMaintenanceDate)}
          </p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          创建者: {maintenance.creator.name} • {formatDate(maintenance.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={() => onView(maintenance)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              查看
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(maintenance)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
            >
              编辑
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(maintenance)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              删除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCard;
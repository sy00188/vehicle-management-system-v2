import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2, User, Calendar, Wrench } from 'lucide-react';
import type { Vehicle } from '../../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onAction: (action: string, vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onAction }) => {
  const [showActions, setShowActions] = useState(false);

  // 获取状态样式
  const getStatusStyle = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-use':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取状态文本
  const getStatusText = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return '空闲';
      case 'in-use':
        return '使用中';
      case 'maintenance':
        return '维护中';
      case 'retired':
        return '已退役';
      default:
        return '未知';
    }
  };

  // 获取车辆类型文本
  const getTypeText = (type: Vehicle['type']) => {
    switch (type) {
      case 'sedan':
        return '轿车';
      case 'suv':
        return 'SUV';
      case 'truck':
        return '卡车';
      case 'van':
        return '面包车';
      default:
        return '其他';
    }
  };

  // 格式化里程数
  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} km`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* 车辆图片 */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={vehicle.image || '/placeholder-vehicle.svg'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-vehicle.svg';
          }}
        />
        {/* 状态标签 */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(vehicle.status)}`}>
            {getStatusText(vehicle.status)}
          </span>
        </div>
        {/* 操作菜单 */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                <button
                  onClick={() => {
                    onAction('view', vehicle.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  查看详情
                </button>
                <button
                  onClick={() => {
                    onAction('edit', vehicle.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={() => {
                    onAction('delete', vehicle.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 车辆信息 */}
      <div className="p-4">
        {/* 车牌号 */}
        <div className="text-lg font-semibold text-gray-900 mb-1">
          {vehicle.plateNumber}
        </div>
        
        {/* 车辆型号 */}
        <div className="text-sm text-gray-600 mb-3">
          {vehicle.brand} {vehicle.model} ({vehicle.year}年)
        </div>

        {/* 基本信息 */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">车辆类型</span>
            <span className="text-gray-900">{getTypeText(vehicle.type)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">所属部门</span>
            <span className="text-gray-900">{vehicle.department}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">里程数</span>
            <span className="text-gray-900">{formatMileage(vehicle.mileage)}</span>
          </div>
        </div>

        {/* 状态相关信息 */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {vehicle.status === 'in-use' && vehicle.currentDriver ? (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">当前驾驶员:</span>
              <span className="text-gray-900">{vehicle.currentDriver.name}</span>
            </div>
          ) : vehicle.status === 'maintenance' ? (
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-500">维护类型:</span>
              <span className="text-gray-900">{vehicle.maintenanceType || '常规维护'}</span>
            </div>
          ) : vehicle.nextMaintenanceDate ? (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">下次保养:</span>
              <span className="text-gray-900">{formatDate(vehicle.nextMaintenanceDate)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
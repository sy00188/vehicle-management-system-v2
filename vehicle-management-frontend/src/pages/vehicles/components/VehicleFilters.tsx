import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import type { VehicleFilters as VehicleFiltersType } from '../../../types';

interface VehicleFiltersProps {
  filters: VehicleFiltersType;
  onFiltersChange: (filters: VehicleFiltersType) => void;
  onReset: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const handleInputChange = (field: keyof VehicleFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">筛选条件</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索车牌号、品牌、型号..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* 车辆状态 */}
        <div>
          <select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">全部状态</option>
            <option value="available">空闲</option>
            <option value="in-use">使用中</option>
            <option value="maintenance">维护中</option>
            <option value="retired">已退役</option>
          </select>
        </div>

        {/* 车辆类型 */}
        <div>
          <select
            value={filters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">全部类型</option>
            <option value="sedan">轿车</option>
            <option value="suv">SUV</option>
            <option value="truck">卡车</option>
            <option value="van">面包车</option>
          </select>
        </div>

        {/* 所属部门 */}
        <div>
          <select
            value={filters.department || ''}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">全部部门</option>
            <option value="行政部">行政部</option>
            <option value="销售部">销售部</option>
            <option value="技术部">技术部</option>
            <option value="财务部">财务部</option>
            <option value="人事部">人事部</option>
            <option value="市场部">市场部</option>
          </select>
        </div>

        {/* 重置按钮 */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            重置筛选
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;
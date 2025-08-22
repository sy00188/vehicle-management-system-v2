import React from 'react';
import type { ExpenseFilters as ExpenseFiltersType } from '../../types';
import {
  EXPENSE_STATUS_LABELS,
  EXPENSE_TYPE_LABELS
} from '../../utils/constants';

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFiltersChange: (filters: ExpenseFiltersType) => void;
  onReset: () => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const handleInputChange = (field: keyof ExpenseFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">筛选条件</h3>
        <button
          onClick={onReset}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          重置筛选
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* 搜索框 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            搜索
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索车牌号、服务商或描述..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* 状态筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            状态
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value || undefined)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部状态</option>
            {Object.entries(EXPENSE_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 类型筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            费用类型
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value || undefined)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部类型</option>
            {Object.entries(EXPENSE_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 车辆筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            车辆筛选
          </label>
          <input
            type="text"
            placeholder="输入车牌号..."
            value={filters.vehicleId || ''}
            onChange={(e) => handleInputChange('vehicleId', e.target.value || undefined)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 日期范围筛选 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            开始日期
          </label>
          <input
            type="date"
            value={filters.dateRange?.start || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange('dateRange', {
                start: value,
                end: filters.dateRange?.end || ''
              });
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            结束日期
          </label>
          <input
            type="date"
            value={filters.dateRange?.end || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange('dateRange', {
                start: filters.dateRange?.start || '',
                end: value
              });
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
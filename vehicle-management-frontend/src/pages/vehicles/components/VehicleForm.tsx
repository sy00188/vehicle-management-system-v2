import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Vehicle } from '../../../types';

interface VehicleFormProps {
  vehicle?: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vehicleData: Partial<Vehicle>) => void;
  isEdit?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    plateNumber: vehicle?.plateNumber || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || '',
    type: vehicle?.type || ('sedan' as Vehicle['type']),
    seats: vehicle?.seats || 5,
    fuelType: vehicle?.fuelType || ('gasoline' as Vehicle['fuelType']),
    mileage: vehicle?.mileage || 0,
    purchaseDate: vehicle?.purchaseDate || '',
    department: vehicle?.department || '',
    status: vehicle?.status || ('available' as Vehicle['status']),
    notes: vehicle?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        plateNumber: vehicle.plateNumber,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        type: vehicle.type,
        seats: vehicle.seats,
        fuelType: vehicle.fuelType,
        mileage: vehicle.mileage,
        purchaseDate: vehicle.purchaseDate,
        department: vehicle.department,
        status: vehicle.status,
        notes: vehicle.notes || ''
      });
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'seats' || name === 'mileage' ? parseInt(value) || 0 : value
    }));
    
    // 清除错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = '车牌号不能为空';
    }
    if (!formData.brand.trim()) {
      newErrors.brand = '品牌不能为空';
    }
    if (!formData.model.trim()) {
      newErrors.model = '型号不能为空';
    }
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = '请输入有效的年份';
    }
    if (!formData.color.trim()) {
      newErrors.color = '颜色不能为空';
    }
    if (!formData.department.trim()) {
      newErrors.department = '所属部门不能为空';
    }
    if (formData.seats < 1 || formData.seats > 50) {
      newErrors.seats = '座位数必须在1-50之间';
    }
    if (formData.mileage < 0) {
      newErrors.mileage = '里程数不能为负数';
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = '购买日期不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {vehicle ? '编辑车辆' : '添加车辆'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    车牌号 *
                  </label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.plateNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="如：京A12345"
                  />
                  {errors.plateNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.plateNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    品牌 *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="如：丰田"
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    型号 *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="如：凯美瑞"
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年份 *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    颜色 *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="如：白色"
                  />
                  {errors.color && (
                    <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    车辆类型
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sedan">轿车</option>
                    <option value="suv">SUV</option>
                    <option value="truck">卡车</option>
                    <option value="van">面包车</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 技术规格 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">技术规格</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    燃料类型
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gasoline">汽油</option>
                    <option value="diesel">柴油</option>
                    <option value="electric">电动</option>
                    <option value="hybrid">混合动力</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    座位数 *
                  </label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.seats ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                    max="50"
                  />
                  {errors.seats && (
                    <p className="mt-1 text-sm text-red-600">{errors.seats}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    里程数 (公里)
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mileage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="0"
                    placeholder="请输入里程数"
                  />
                  {errors.mileage && (
                    <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 购买信息 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">购买信息</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  购买日期 *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.purchaseDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>
                )}
              </div>
            </div>

            {/* 管理信息 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">管理信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    所属部门 *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入所属部门"
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    车辆状态
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">可用</option>
                    <option value="in-use">使用中</option>
                    <option value="maintenance">维护中</option>
                    <option value="retired">已退役</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入备注信息"
                />
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {vehicle ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EXPENSE_TYPES } from '../../constants';
import type { Vehicle } from '../../types';
import * as vehicleService from '../../services/vehicleService';
import * as expenseService from '../../services/expenseService';

interface ExpenseFormData {
  type: 'fuel' | 'maintenance' | 'insurance' | 'registration' | 'fine' | 'parking' | 'toll' | 'other';
  amount: number;
  description: string;
  vehicleId: string;
  serviceProvider: string;
  location: string;
  mileage: number;
  receiptDate: string;
  attachments: File[];
}

const ExpenseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  // 获取费用类型标签
  const getExpenseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fuel: '燃油费',
      maintenance: '维修费',
      insurance: '保险费',
      parking: '停车费',
      toll: '过路费',
      fine: '罚款',
      other: '其他费用'
    };
    return labels[type] || type;
  };

  const [formData, setFormData] = useState<ExpenseFormData>({
    type: 'fuel',
    amount: 0,
    description: '',
    vehicleId: '',
    serviceProvider: '',
    location: '',
    mileage: 0,
    receiptDate: new Date().toISOString().split('T')[0],
    attachments: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Load vehicles data
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await vehicleService.getVehicles();
        setVehicles(response.data);
      } catch (error) {
        console.error('获取车辆列表失败:', error);
        // Fallback to mock data
        const mockVehicles: Vehicle[] = [
          {
            id: '1',
            plateNumber: '京A12345',
            brand: '丰田',
            model: '凯美瑞',
            year: 2022,
            type: 'sedan',
            status: 'available',
            mileage: 15000,
            fuelType: 'gasoline',
            color: '白色',
            image: '/images/camry.jpg',
            purchaseDate: '2022-01-15',
            lastMaintenanceDate: '2024-01-15',
            nextMaintenanceDate: '2024-07-15',
            currentDriver: undefined,
            notes: '状态良好',
            department: '运营部',
            seats: 5,
            createdAt: '2022-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: '2',
            plateNumber: '京B67890',
            brand: '本田',
            model: '雅阁',
            year: 2021,
            type: 'sedan',
            status: 'in-use',
            mileage: 25000,
            fuelType: 'gasoline',
            color: '黑色',
            image: '/images/accord.jpg',
            purchaseDate: '2021-03-20',
            lastMaintenanceDate: '2024-02-01',
            nextMaintenanceDate: '2024-08-01',
            currentDriver: undefined,
            notes: '定期保养',
            department: '销售部',
            seats: 5,
            createdAt: '2021-03-20T00:00:00Z',
            updatedAt: '2024-02-01T00:00:00Z'
          }
        ];
        setVehicles(mockVehicles);
      }
    };
    
    loadVehicles();
  }, []);

  // Load expense data for editing
  useEffect(() => {
    if (isEdit && id) {
      const loadExpense = async () => {
        try {
          setLoading(true);
          const expense = await expenseService.getExpenseById(id);
          setFormData({
            type: expense.type as ExpenseFormData['type'],
            amount: expense.amount,
            description: expense.description,
            vehicleId: expense.vehicleId,
            serviceProvider: expense.serviceProvider || '',
            location: expense.location || '',
            mileage: expense.mileage || 0,
            receiptDate: expense.receiptDate ? expense.receiptDate.split('T')[0] : new Date().toISOString().split('T')[0],
            attachments: []
          });
        } catch (error) {
          console.error('加载费用数据失败:', error);
          // Fallback to mock data
          const mockExpense: Partial<ExpenseFormData> = {
            type: 'fuel' as const,
            amount: 350.00,
            description: '加油费用',
            vehicleId: '1',
            serviceProvider: '中石化加油站',
            location: '北京市朝阳区',
            mileage: 15500,
            receiptDate: '2024-01-15'
          };
          setFormData(prev => ({ ...prev, ...mockExpense }));
        } finally {
          setLoading(false);
        }
      };
      
      loadExpense();
    }
  }, [isEdit, id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!formData.type) {
      newErrors.type = '请选择费用类型';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = '请输入有效的金额';
    }
    if (!formData.description.trim()) {
      newErrors.description = '请输入费用描述';
    }
    if (!formData.vehicleId) {
      newErrors.vehicleId = '请选择车辆';
    }
    if (!formData.serviceProvider.trim()) {
      newErrors.serviceProvider = '请输入服务提供商';
    }
    if (!formData.location.trim()) {
      newErrors.location = '请输入地点';
    }
    if (!formData.receiptDate) {
      newErrors.receiptDate = '请选择日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string | number | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const expenseData = {
        type: formData.type,
        amount: formData.amount,
        description: formData.description,
        vehicleId: formData.vehicleId,
        serviceProvider: formData.serviceProvider || '',
        location: formData.location || '',
        mileage: formData.mileage || 0,
        date: formData.receiptDate,
        receiptDate: formData.receiptDate,
        status: 'pending' as const,
        createdBy: 'current-user-id',
        // Note: File attachments would need separate handling in a real implementation
        attachments: formData.attachments.map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size
        }))
      };

      if (isEdit && id) {
        await expenseService.updateExpense(id, expenseData);
        console.log('费用记录更新成功');
      } else {
        await expenseService.createExpense(expenseData);
        console.log('费用记录创建成功');
      }
      
      // Navigate back to expenses list
      navigate('/expenses');
    } catch (error) {
      console.error('提交费用记录失败:', error);
      // Show error message to user
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/expenses')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="返回费用列表"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEdit ? '编辑费用记录' : '新增费用记录'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">基本信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  费用类型 <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.type ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择费用类型</option>
                  {Object.entries(EXPENSE_TYPES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {getExpenseTypeLabel(value)}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  金额 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    value={formData.amount || ''}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Vehicle */}
              <div>
                <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-2">
                  车辆 <span className="text-red-500">*</span>
                </label>
                <select
                  id="vehicleId"
                  value={formData.vehicleId}
                  onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.vehicleId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择车辆</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>
                )}
              </div>

              {/* Receipt Date */}
              <div>
                <label htmlFor="receiptDate" className="block text-sm font-medium text-gray-700 mb-2">
                  发生日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="receiptDate"
                  value={formData.receiptDate}
                  onChange={(e) => handleInputChange('receiptDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.receiptDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.receiptDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.receiptDate}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                费用描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请详细描述费用用途和相关信息"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">详细信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Provider */}
              <div>
                <label htmlFor="serviceProvider" className="block text-sm font-medium text-gray-700 mb-2">
                  服务提供商 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="serviceProvider"
                  value={formData.serviceProvider}
                  onChange={(e) => handleInputChange('serviceProvider', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.serviceProvider ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="如：中石化加油站、4S店等"
                />
                {errors.serviceProvider && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceProvider}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  地点 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="如：北京市朝阳区"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Mileage */}
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
                  里程数
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="mileage"
                    min="0"
                    value={formData.mileage || ''}
                    onChange={(e) => handleInputChange('mileage', Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">附件上传</h2>
            
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      点击上传文件或拖拽文件到此处
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      支持 PDF、JPG、PNG 格式，单个文件不超过 10MB
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {/* Uploaded Files */}
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">已上传文件</h3>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <PaperClipIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="删除文件"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '保存中...' : (isEdit ? '更新费用' : '创建费用')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
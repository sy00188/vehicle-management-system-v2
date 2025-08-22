import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  AlertTriangle
} from 'lucide-react';
import type { User as UserType } from '../../types';
import * as driverService from '../../services/driverService';
import * as userService from '../../services/userService';
import {
  DRIVER_STATUS,
  DRIVER_STATUS_LABELS,
  LICENSE_TYPES,
  LICENSE_TYPE_LABELS,
} from '../../utils/constants';

// 创建选项数组
const DRIVER_STATUS_OPTIONS = Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => ({
  value: value as keyof typeof DRIVER_STATUS,
  label,
}));

const LICENSE_TYPE_OPTIONS = Object.entries(LICENSE_TYPE_LABELS).map(([value, label]) => ({
  value: value as keyof typeof LICENSE_TYPES,
  label,
}));

interface DriverFormData {
  userId: string;
  name: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  experience: number;
  status: 'available' | 'busy' | 'on_leave' | 'inactive';
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  user?: UserType;
  rating?: number;
  monthlyTasks?: number;
  totalTasks?: number;
}

const DriverForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState<DriverFormData>({
    userId: '',
    name: '',
    licenseNumber: '',
    licenseType: 'C1',
    licenseExpiry: '',
    experience: 0,
    status: 'available',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 加载用户列表
  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
      // 使用模拟数据
      const mockUsers: UserType[] = [
        {
          id: 'user1',
          username: 'zhangsan',
          email: 'zhangsan@company.com',
          name: '张三',
          role: 'user',
          department: '运输部',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: 'user2',
          username: 'lisi',
          email: 'lisi@company.com',
          name: '李四',
          role: 'user',
          department: '运输部',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];
      setUsers(mockUsers);
    }
  };

  // 加载司机详情（编辑模式）
  const loadDriverDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const driver = await driverService.getDriverById(id);
      
      setFormData({
        userId: driver.userId,
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseType: driver.licenseType,
        licenseExpiry: driver.licenseExpiry,
        experience: driver.experience,
        status: driver.status,
        phone: driver.phone,
        email: driver.email,
        emergencyContact: driver.emergencyContact,
        emergencyPhone: driver.emergencyPhone,
      });
    } catch (err) {
      console.error('Failed to load driver detail:', err);
      setError('加载司机信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.userId) {
      errors.userId = '请选择关联用户';
    }
    
    if (!formData.name.trim()) {
      errors.name = '请输入姓名';
    }
    
    if (!formData.licenseNumber.trim()) {
      errors.licenseNumber = '请输入驾照号码';
    }
    
    if (!formData.licenseExpiry) {
      errors.licenseExpiry = '请选择驾照到期日期';
    } else {
      const expiryDate = new Date(formData.licenseExpiry);
      const today = new Date();
      if (expiryDate <= today) {
        errors.licenseExpiry = '驾照到期日期不能早于今天';
      }
    }
    
    if (formData.experience < 0) {
      errors.experience = '驾驶经验不能为负数';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      errors.phone = '请输入有效的手机号码';
    }
    
    if (!formData.email.trim()) {
      errors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.emergencyContact.trim()) {
      errors.emergencyContact = '请输入紧急联系人';
    }
    
    if (!formData.emergencyPhone.trim()) {
      errors.emergencyPhone = '请输入紧急联系人电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.emergencyPhone)) {
      errors.emergencyPhone = '请输入有效的紧急联系人电话';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // 构建提交数据，包含所有必需字段
      const selectedUser = users.find(u => u.id === formData.userId);
      const submitData = {
        userId: formData.userId,
        user: selectedUser || {
          id: formData.userId,
          username: '',
          email: formData.email,
          name: formData.name,
          role: 'user' as const,
          department: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        name: formData.name,
        licenseNumber: formData.licenseNumber,
        licenseType: formData.licenseType,
        licenseExpiry: formData.licenseExpiry,
        experience: formData.experience,
        status: formData.status,
        phone: formData.phone,
        email: formData.email,
        rating: 5.0, // 默认评分
        monthlyTasks: 0, // 默认月度任务数
        totalTasks: 0, // 默认总任务数
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
      };
      
      if (isEdit && id) {
        await driverService.updateDriver(id, submitData);
      } else {
        await driverService.createDriver(submitData);
      }
      
      navigate('/drivers');
    } catch (err) {
      console.error('Failed to save driver:', err);
      setError(isEdit ? '更新司机信息失败' : '创建司机失败');
    } finally {
      setSaving(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof DriverFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除对应字段的验证错误
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 处理用户选择变化
  const handleUserChange = (userId: string) => {
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        userId,
        name: selectedUser.name,
        email: selectedUser.email,
      }));
    }
  };

  useEffect(() => {
    loadUsers();
    if (isEdit) {
      loadDriverDetail();
    }
  }, [id, isEdit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/drivers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? '编辑司机' : '添加司机'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? '修改司机信息' : '创建新的司机档案'}
            </p>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">基本信息</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 关联用户 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                关联用户 *
              </label>
              <select
                value={formData.userId}
                onChange={(e) => handleUserChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.userId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isEdit} // 编辑模式下不允许修改关联用户
              >
                <option value="">请选择用户</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.username})
                  </option>
                ))}
              </select>
              {validationErrors.userId && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.userId}</p>
              )}
            </div>

            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入姓名"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* 手机号码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号码 *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入手机号码"
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>

            {/* 邮箱地址 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址 *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入邮箱地址"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* 驾照信息 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">驾照信息</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 驾照号码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                驾照号码 *
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入驾照号码"
              />
              {validationErrors.licenseNumber && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.licenseNumber}</p>
              )}
            </div>

            {/* 驾照类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                驾照类型 *
              </label>
              <select
                value={formData.licenseType}
                onChange={(e) => handleInputChange('licenseType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {LICENSE_TYPE_OPTIONS.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 驾照到期日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                驾照到期日期 *
              </label>
              <input
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.licenseExpiry ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.licenseExpiry && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.licenseExpiry}</p>
              )}
            </div>

            {/* 驾驶经验 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                驾驶经验（年）*
              </label>
              <input
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.experience ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入驾驶经验年数"
              />
              {validationErrors.experience && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.experience}</p>
              )}
            </div>
          </div>
        </div>

        {/* 其他信息 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">其他信息</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态 *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {DRIVER_STATUS_OPTIONS.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 紧急联系人 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                紧急联系人 *
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.emergencyContact ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入紧急联系人姓名"
              />
              {validationErrors.emergencyContact && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.emergencyContact}</p>
              )}
            </div>

            {/* 紧急联系人电话 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                紧急联系人电话 *
              </label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.emergencyPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入紧急联系人电话"
              />
              {validationErrors.emergencyPhone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.emergencyPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/drivers')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? '保存中...' : '创建中...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? '保存修改' : '创建司机'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;
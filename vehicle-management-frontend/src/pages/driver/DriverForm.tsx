import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  StarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { DRIVER_STATUS, LICENSE_TYPES } from '../../constants';
import type { Driver } from '../../types';

interface DriverFormData {
  name: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  experience: string;
  status: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  avatar?: File;
}

const DriverForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<DriverFormData>({
    name: '',
    licenseNumber: '',
    licenseType: 'C1',
    licenseExpiry: '',
    experience: '0',
    status: 'available',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const isEditing = Boolean(id);

  // Mock data for editing
  const mockDriver: Driver = {
    id: '1',
    userId: 'user1',
    user: {
      id: 'user1',
      username: 'zhangsan',
      email: 'zhangsan@company.com',
      name: '张三',
      role: 'user',
      department: '运营部',
      avatar: '/images/avatar-1.jpg',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    name: '张三',
    licenseNumber: 'B123456789012345',
    licenseType: 'C1',
    licenseExpiry: '2026-12-31',
    experience: 5,
    status: 'available',
    phone: '13800138001',
    email: 'zhangsan@company.com',
    rating: 4.8,
    monthlyTasks: 15,
    totalTasks: 180,
    emergencyContact: '李四',
    emergencyPhone: '13900139001',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  };

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFormData({
          name: mockDriver.name,
          licenseNumber: mockDriver.licenseNumber,
          licenseType: mockDriver.licenseType,
          licenseExpiry: mockDriver.licenseExpiry,
          experience: mockDriver.experience.toString(),
          status: mockDriver.status,
          phone: mockDriver.phone,
          email: mockDriver.email,
          emergencyContact: mockDriver.emergencyContact,
          emergencyPhone: mockDriver.emergencyPhone
        });
        if (mockDriver.user.avatar) {
          setAvatarPreview(mockDriver.user.avatar);
        }
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditing]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入驾驶员姓名';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = '请输入驾驶证号码';
    } else if (!/^[A-Z0-9]{15,18}$/.test(formData.licenseNumber)) {
      newErrors.licenseNumber = '驾驶证号码格式不正确';
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = '请选择驾驶证有效期';
    } else {
      const expiryDate = new Date(formData.licenseExpiry);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.licenseExpiry = '驾驶证有效期不能早于今天';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '手机号码格式不正确';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱地址格式不正确';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = '请输入紧急联系人';
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = '请输入紧急联系人电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = '紧急联系人电话格式不正确';
    }

    const experience = parseInt(formData.experience);
    if (isNaN(experience) || experience < 0 || experience > 50) {
      newErrors.experience = '驾驶经验应在0-50年之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof DriverFormData, value: string | File) => {
    if (field === 'avatar' && value instanceof File) {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value as string }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: '请选择图片文件' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: '图片大小不能超过5MB' }));
        return;
      }
      
      handleInputChange('avatar', file);
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      navigate('/drivers');
    } catch (error) {
      console.error('Submit failed:', error);
      setErrors({ submit: '提交失败，请重试' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: '可用',
      busy: '忙碌',
      on_leave: '请假',
      inactive: '停用'
    };
    return labels[status] || status;
  };

  const getLicenseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      A1: 'A1 - 大型客车',
      A2: 'A2 - 牵引车',
      A3: 'A3 - 城市公交车',
      B1: 'B1 - 中型客车',
      B2: 'B2 - 大型货车',
      C1: 'C1 - 小型汽车',
      C2: 'C2 - 小型自动挡汽车',
      C3: 'C3 - 低速载货汽车',
      C4: 'C4 - 三轮汽车',
      D: 'D - 普通三轮摩托车',
      E: 'E - 普通二轮摩托车',
      F: 'F - 轻便摩托车',
      M: 'M - 轮式自行机械车',
      N: 'N - 无轨电车',
      P: 'P - 有轨电车'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/drivers')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? '编辑驾驶员' : '新增驾驶员'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? '修改驾驶员信息和资质' : '添加新的驾驶员信息'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="h-4 w-4 inline mr-1" />
                    驾驶员姓名 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入驾驶员姓名"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                    手机号码 *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入手机号码"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                    邮箱地址 *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入邮箱地址"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <StarIcon className="h-4 w-4 inline mr-1" />
                    驾驶经验（年）*
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入驾驶经验年数"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.experience}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">驾驶证信息</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IdentificationIcon className="h-4 w-4 inline mr-1" />
                    驾驶证号码 *
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value.toUpperCase())}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入驾驶证号码"
                    maxLength={18}
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                    驾驶证类型 *
                  </label>
                  <select
                    value={formData.licenseType}
                    onChange={(e) => handleInputChange('licenseType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(LICENSE_TYPES).map(([value]) => (
                      <option key={value} value={value}>
                        {getLicenseTypeLabel(value)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    驾驶证有效期 *
                  </label>
                  <input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.licenseExpiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.licenseExpiry && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.licenseExpiry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(DRIVER_STATUS).map(([value]) => (
                      <option key={value} value={value}>
                        {getStatusLabel(value)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">紧急联系人</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="h-4 w-4 inline mr-1" />
                    联系人姓名 *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入紧急联系人姓名"
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                    联系人电话 *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入紧急联系人电话"
                  />
                  {errors.emergencyPhone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.emergencyPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">头像</h2>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="头像预览"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                <div className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <PhotoIcon className="h-4 w-4 mr-2" />
                    选择头像
                  </label>
                  {errors.avatar && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.avatar}
                    </p>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  支持 JPG、PNG 格式，文件大小不超过 5MB
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  )}
                  {submitLoading ? '保存中...' : (isEditing ? '更新驾驶员' : '创建驾驶员')}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/drivers')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
              </div>
              
              {errors.submit && (
                <p className="mt-4 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.submit}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;
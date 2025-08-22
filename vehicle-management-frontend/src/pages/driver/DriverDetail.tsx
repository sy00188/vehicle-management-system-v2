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
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import type { Driver, Vehicle } from '../../types';

interface TaskHistory {
  id: string;
  applicationId: string;
  vehicleId: string;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  destination: string;
  distance: number;
  status: 'completed' | 'in_progress' | 'cancelled';
  rating?: number;
  feedback?: string;
}

interface PerformanceStats {
  totalTasks: number;
  completedTasks: number;
  averageRating: number;
  totalDistance: number;
  onTimeRate: number;
  safetyScore: number;
}

const DriverDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'tasks' | 'performance'>('info');

  // Mock data
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

  const mockTaskHistory: TaskHistory[] = [
    {
      id: '1',
      applicationId: 'app1',
      vehicleId: 'vehicle1',
      vehicle: {
        id: 'vehicle1',
        plateNumber: '京A12345',
        brand: '丰田',
        model: '凯美瑞',
        year: 2022,
        color: '白色',
        type: 'sedan' as const,
        fuelType: 'gasoline' as const,
        seats: 5,
        mileage: 15000,
        status: 'available' as const,
        department: '销售部',
        purchaseDate: '2022-01-15',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      startDate: '2024-01-15T09:00:00Z',
      endDate: '2024-01-15T17:00:00Z',
      destination: '客户公司A',
      distance: 120,
      status: 'completed',
      rating: 5,
      feedback: '服务态度很好，驾驶平稳'
    },
    {
      id: '2',
      applicationId: 'app2',
      vehicleId: 'vehicle2',
      vehicle: {
        id: 'vehicle2',
        plateNumber: '京B67890',
        brand: '本田',
        model: '雅阁',
        year: 2021,
        color: '黑色',
        type: 'sedan' as const,
        fuelType: 'gasoline' as const,
        seats: 5,
        mileage: 25000,
        status: 'available' as const,
        department: '市场部',
        purchaseDate: '2021-06-10',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      startDate: '2024-01-14T08:30:00Z',
      endDate: '2024-01-14T18:30:00Z',
      destination: '展会中心',
      distance: 85,
      status: 'completed',
      rating: 4,
      feedback: '准时到达，车辆整洁'
    },
    {
      id: '3',
      applicationId: 'app3',
      vehicleId: 'vehicle1',
      vehicle: {
        id: 'vehicle1',
        plateNumber: '京C11111',
        brand: '丰田',
        model: '凯美瑞',
        year: 2022,
        color: '白色',
        type: 'sedan' as const,
        fuelType: 'gasoline' as const,
        seats: 5,
        mileage: 15000,
        status: 'available' as const,
        department: '销售部',
        purchaseDate: '2022-01-15',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      startDate: '2024-01-16T10:00:00Z',
      endDate: '2024-01-16T16:00:00Z',
      destination: '机场接送',
      distance: 60,
      status: 'in_progress'
    }
  ];

  const mockPerformanceStats: PerformanceStats = {
    totalTasks: 180,
    completedTasks: 175,
    averageRating: 4.8,
    totalDistance: 15600,
    onTimeRate: 98.5,
    safetyScore: 95.2
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setDriver(mockDriver);
        setTaskHistory(mockTaskHistory);
        setPerformanceStats(mockPerformanceStats);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      on_leave: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: '可用',
      busy: '忙碌',
      on_leave: '请假',
      inactive: '停用'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTaskStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStatusLabel = (status: string) => {
    const labels = {
      completed: '已完成',
      in_progress: '进行中',
      cancelled: '已取消'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">驾驶员信息未找到</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/drivers')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">驾驶员详情</h1>
            <p className="text-gray-600">查看驾驶员的详细信息和工作记录</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/drivers/${id}/edit`)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          编辑信息
        </button>
      </div>

      {/* Driver Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {driver.user.avatar ? (
              <img
                src={driver.user.avatar}
                alt={driver.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{driver.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driver.status)}`}>
                {getStatusLabel(driver.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">驾驶证号</p>
                  <p className="font-medium">{driver.licenseNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">驾驶证类型</p>
                  <p className="font-medium">{driver.licenseType}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">有效期至</p>
                  <p className="font-medium">{new Date(driver.licenseExpiry).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">驾驶经验</p>
                  <p className="font-medium">{driver.experience}年</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">联系电话</p>
                  <p className="font-medium">{driver.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">邮箱地址</p>
                  <p className="font-medium">{driver.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">紧急联系人</p>
                  <p className="font-medium">{driver.emergencyContact} ({driver.emergencyPhone})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            基本信息
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            任务历史
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            绩效统计
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">个人信息</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">姓名</span>
                <span className="font-medium">{driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">用户名</span>
                <span className="font-medium">{driver.user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">部门</span>
                <span className="font-medium">{driver.user.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">角色</span>
                <span className="font-medium">{driver.user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">注册时间</span>
                <span className="font-medium">{formatDate(driver.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最后更新</span>
                <span className="font-medium">{formatDate(driver.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">驾驶证信息</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">驾驶证号码</span>
                <span className="font-medium">{driver.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">驾驶证类型</span>
                <span className="font-medium">{driver.licenseType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">有效期至</span>
                <span className="font-medium">{new Date(driver.licenseExpiry).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">驾驶经验</span>
                <span className="font-medium">{driver.experience}年</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">当前状态</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                  {getStatusLabel(driver.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">任务历史</h3>
            <p className="text-gray-600">查看驾驶员的所有任务记录</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {taskHistory.map((task) => (
              <div key={task.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-medium text-gray-900">{task.destination}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                        {getTaskStatusLabel(task.status)}
                      </span>
                      {task.rating && renderStars(task.rating)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="h-4 w-4" />
                        <span>{task.vehicle.plateNumber} ({task.vehicle.brand} {task.vehicle.model})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{task.distance} 公里</span>
                      </div>
                    </div>
                    
                    {task.feedback && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">反馈：</span>{task.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && performanceStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Performance Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">完成任务</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceStats.completedTasks}/{performanceStats.totalTasks}
                </p>
                <p className="text-sm text-green-600">
                  完成率 {((performanceStats.completedTasks / performanceStats.totalTasks) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">平均评分</p>
                <p className="text-2xl font-bold text-gray-900">{performanceStats.averageRating}</p>
                <div className="flex items-center space-x-1">
                  {renderStars(performanceStats.averageRating)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">总里程</p>
                <p className="text-2xl font-bold text-gray-900">{performanceStats.totalDistance.toLocaleString()}</p>
                <p className="text-sm text-gray-600">公里</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">准时率</p>
                <p className="text-2xl font-bold text-gray-900">{performanceStats.onTimeRate}%</p>
                <p className="text-sm text-green-600">表现优秀</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">安全评分</p>
                <p className="text-2xl font-bold text-gray-900">{performanceStats.safetyScore}</p>
                <p className="text-sm text-green-600">安全驾驶</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">本月任务</p>
                <p className="text-2xl font-bold text-gray-900">{driver.monthlyTasks}</p>
                <p className="text-sm text-gray-600">个任务</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDetail;
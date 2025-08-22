import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Star,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  AlertTriangle,
  Car,
  FileText
} from 'lucide-react';
import type { Driver, Vehicle, Application } from '../../types';
import * as driverService from '../../services/driverService';
import * as vehicleService from '../../services/vehicleService';
import {
  DRIVER_STATUS_LABELS,
  LICENSE_TYPE_LABELS,
} from '../../utils/constants';

const DriverDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [assignedVehicles, setAssignedVehicles] = useState<Vehicle[]>([]);
  const [, ] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载司机详情数据
  const loadDriverDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 并行加载数据
      const [driverData, vehiclesData] = await Promise.all([
        driverService.getDriverById(id),
        vehicleService.getVehicles()
      ]);
      
      setDriver(driverData);
      
      // 筛选分配给该司机的车辆
      const driverVehicles = vehiclesData.data.filter(
        (vehicle: Vehicle) => vehicle.currentDriver?.id === id
      );
      setAssignedVehicles(driverVehicles);
      
      // TODO: 加载相关申请记录
      // const applicationsData = await applicationService.getApplicationsByDriver(id);
      // setRecentApplications(applicationsData.data);
      
    } catch (err) {
      console.error('Failed to load driver detail:', err);
      setError('加载司机详情失败');
      
      // 回退到模拟数据
      const mockDriver: Driver = {
        id: id || '1',
        userId: 'user1',
        user: {
          id: 'user1',
          username: 'zhangsan',
          email: 'zhangsan@company.com',
          name: '张三',
          role: 'user',
          department: '运输部',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        name: '张三',
        licenseNumber: 'A123456789',
        licenseType: 'A1',
        licenseExpiry: '2026-12-31',
        experience: 8,
        status: 'available',
        phone: '13800138001',
        email: 'zhangsan@company.com',
        rating: 4.8,
        monthlyTasks: 15,
        totalTasks: 120,
        emergencyContact: '李四',
        emergencyPhone: '13800138002',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      setDriver(mockDriver);
    } finally {
      setLoading(false);
    }
  };

  // 处理删除司机
  const handleDelete = async () => {
    if (!driver || !id) return;
    
    if (window.confirm(`确定要删除司机 ${driver.name} 吗？此操作不可撤销。`)) {
      try {
        await driverService.deleteDriver(id);
        navigate('/drivers');
      } catch (err) {
        console.error('Failed to delete driver:', err);
        setError('删除司机失败');
      }
    }
  };

  // 处理状态更新
  const handleStatusUpdate = async (newStatus: 'available' | 'busy' | 'on_leave' | 'inactive') => {
    if (!driver || !id) return;
    
    try {
      const updatedDriver = await driverService.updateDriver(id, {
        ...driver,
        status: newStatus
      });
      setDriver(updatedDriver);
    } catch (err) {
      console.error('Failed to update driver status:', err);
      setError('更新司机状态失败');
    }
  };

  // 渲染星级评分
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // 获取状态徽章样式
  const getStatusBadgeColor = (status: string) => {
    const colorMap: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      on_leave: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    loadDriverDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{error || '司机不存在'}</p>
        <button
          onClick={() => navigate('/drivers')}
          className="text-blue-600 hover:text-blue-800"
        >
          返回司机列表
        </button>
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
            <h1 className="text-2xl font-bold text-gray-900">司机详情</h1>
            <p className="text-gray-600">查看和管理司机信息</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/drivers/${id}/edit`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 个人信息卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-2xl">
                    {driver.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{driver.name}</h2>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusBadgeColor(driver.status)
                    }`}
                  >
                    {DRIVER_STATUS_LABELS[driver.status]}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(driver.rating || 0)}
                <span className="text-sm text-gray-600 ml-2">({driver.rating})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{driver.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>驾照类型: {LICENSE_TYPE_LABELS[driver.licenseType as keyof typeof LICENSE_TYPE_LABELS]}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-3" />
                  <span>驾照号: {driver.licenseNumber}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>驾照到期: {driver.licenseExpiry}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>驾驶经验: {driver.experience}年</span>
                </div>
              </div>
            </div>

            {/* 紧急联系人 */}
            {driver.emergencyContact && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">紧急联系人</h3>
                <div className="flex items-center space-x-6">
                  <span className="text-gray-600">{driver.emergencyContact}</span>
                  <span className="text-gray-600">{driver.emergencyPhone}</span>
                </div>
              </div>
            )}
          </div>

          {/* 分配的车辆 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">分配的车辆</h3>
            {assignedVehicles.length > 0 ? (
              <div className="space-y-3">
                {assignedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Car className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="font-medium">{vehicle.plateNumber}</span>
                        <span className="text-gray-600 ml-2">{vehicle.model}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status === 'available' ? '可用' :
                       vehicle.status === 'in-use' ? '使用中' : '维护中'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无分配的车辆</p>
            )}
          </div>
        </div>

        {/* 侧边栏统计 */}
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">统计信息</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">本月任务</span>
                <span className="text-2xl font-semibold text-blue-600">{driver.monthlyTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">总任务数</span>
                <span className="text-2xl font-semibold text-green-600">{driver.totalTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">评分</span>
                <span className="text-2xl font-semibold text-yellow-600">{driver.rating}</span>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
            <div className="space-y-3">
              <button
                onClick={() => window.open(`tel:${driver.phone}`)}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                拨打电话
              </button>
              <button
                onClick={() => handleStatusUpdate(driver.status === 'available' ? 'busy' : 'available')}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {driver.status === 'available' ? '设为忙碌' : '设为可用'}
              </button>
            </div>
          </div>

          {/* 当前任务 */}
          {driver.currentTask && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">当前任务</h3>
              <p className="text-gray-600">{driver.currentTask}</p>
            </div>
          )}

          {/* 请假信息 */}
          {driver.status === 'on_leave' && driver.leaveReason && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">请假信息</h3>
              <div className="space-y-2">
                <p className="text-gray-600">请假原因: {driver.leaveReason}</p>
                {driver.leaveEndDate && (
                  <p className="text-gray-600">预计返回: {driver.leaveEndDate}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;
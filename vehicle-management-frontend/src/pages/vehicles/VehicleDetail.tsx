import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { vehicleService } from '../../services/vehicleService';
import type { Vehicle } from '../../types';
import { ROUTES } from '../../utils/constants';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setError('车辆ID不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const vehicleData = await vehicleService.getVehicleById(id);
        setVehicle(vehicleData);
      } catch (err) {
        console.error('获取车辆详情失败:', err);
        setError('获取车辆详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleEdit = () => {
    navigate(`${ROUTES.VEHICLES}/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!vehicle || !window.confirm('确定要删除这辆车吗？')) {
      return;
    }

    try {
      await vehicleService.deleteVehicle(vehicle.id);
      navigate(ROUTES.VEHICLES);
    } catch (err) {
      console.error('删除车辆失败:', err);
      setError('删除车辆失败');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '可用';
      case 'in_use':
        return '使用中';
      case 'maintenance':
        return '维护中';
      case 'out_of_service':
        return '停用';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">错误</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate(ROUTES.VEHICLES)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回车辆列表
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">车辆不存在</h1>
          <button
            onClick={() => navigate(ROUTES.VEHICLES)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回车辆列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(ROUTES.VEHICLES)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {vehicle.plateNumber} - {vehicle.model}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            删除
          </button>
        </div>
      </div>

      {/* 车辆信息卡片 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              车牌号
            </label>
            <p className="text-lg font-semibold text-gray-900">{vehicle.plateNumber}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              品牌型号
            </label>
            <p className="text-lg text-gray-900">{vehicle.model}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              车辆类型
            </label>
            <p className="text-lg text-gray-900">{vehicle.type}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
              {getStatusText(vehicle.status)}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              燃料类型
            </label>
            <p className="text-lg text-gray-900">{vehicle.fuelType}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              里程数
            </label>
            <p className="text-lg text-gray-900">{vehicle.mileage?.toLocaleString()} 公里</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              所属部门
            </label>
            <p className="text-lg text-gray-900">{vehicle.department}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              购买日期
            </label>
            <p className="text-lg text-gray-900">
              {vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toLocaleDateString('zh-CN') : '未设置'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              当前驾驶员
            </label>
            <p className="text-lg text-gray-900">
              {vehicle.currentDriver?.name || '未分配'}
            </p>
          </div>
        </div>
        
        {vehicle.notes && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{vehicle.notes}</p>
          </div>
        )}
      </div>

      {/* 维护历史 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">维护历史</h2>
        <div className="text-gray-600">
          <p>维护历史功能正在开发中...</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
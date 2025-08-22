import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import type { Vehicle, VehicleFilters as VehicleFiltersType, VehicleStats as VehicleStatsType } from '../../types';
import { getVehicles, getVehicleStats, createVehicle, updateVehicle, deleteVehicle } from '../../services/vehicleService';
import VehicleCard from './components/VehicleCard';
import VehicleFilters from './components/VehicleFilters';
import VehicleStats from './components/VehicleStats';
import VehicleForm from './components/VehicleForm';
import Pagination from './components/Pagination';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<VehicleStatsType>({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0
  });
  const [filters, setFilters] = useState<VehicleFiltersType>({
    status: undefined,
    type: undefined,
    department: undefined,
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const pageSize = 12;

  // 加载车辆数据
  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVehicles(filters, currentPage, pageSize);
      
      setVehicles(response.data);
      setTotalPages(response.totalPages);
      setTotalRecords(response.total);
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Load vehicles error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      const statsData = await getVehicleStats();
      setStats(statsData);
    } catch (err) {
      console.error('Load stats error:', err);
    }
  };

  useEffect(() => {
    loadVehicles();
    loadStats();
  }, [currentPage, filters]);

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  // 处理筛选
  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // 重置筛选
  const handleFiltersReset = () => {
    setFilters({
      status: undefined,
      type: undefined,
      department: undefined,
      search: ''
    });
    setCurrentPage(1);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理车辆操作
  const handleVehicleAction = (action: string, vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    switch (action) {
      case 'view':
        // TODO: 实现查看详情
        console.log('查看车辆:', vehicleId);
        break;
      case 'edit':
        if (vehicle) {
          setEditingVehicle(vehicle);
          setShowVehicleForm(true);
        }
        break;
      case 'delete':
        if (vehicle && window.confirm(`确定要删除车辆 ${vehicle.plateNumber} 吗？`)) {
          handleDeleteVehicle(vehicleId);
        }
        break;
      default:
        console.log('未知操作:', action);
    }
  };

  // 添加车辆
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowVehicleForm(true);
  };

  // 提交车辆表单
  const handleVehicleSubmit = async (vehicleData: Partial<Vehicle>) => {
    try {
      setLoading(true);
      let response;
      
      if (editingVehicle) {
        // 编辑车辆
        response = await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        // 添加车辆
        response = await createVehicle(vehicleData as Omit<Vehicle, 'id'>);
      }
      
      if (response.success) {
        // 重新加载数据
        await loadVehicles();
        await loadStats();
        setShowVehicleForm(false);
        setEditingVehicle(null);
      } else {
        setError(response.message || '操作失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Vehicle submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 删除车辆
  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      setLoading(true);
      const response = await deleteVehicle(vehicleId);
      
      if (response.success) {
        // 重新加载数据
        await loadVehicles();
        await loadStats();
      } else {
        setError(response.message || '删除失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Delete vehicle error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">车辆管理</h1>
          <p className="text-gray-600 mt-1">管理和监控车辆信息</p>
        </div>
        <button 
          onClick={handleAddVehicle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加车辆
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索车牌号、品牌、型号..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 筛选按钮 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>

          {/* 重置按钮 */}
          <button
            onClick={handleFiltersReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            重置筛选
          </button>
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <VehicleFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
            />
          </div>
        )}
      </div>

      {/* 统计卡片 */}
      <VehicleStats stats={stats} />

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={loadVehicles}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 车辆列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">暂无车辆数据</p>
            <p className="text-gray-400 text-sm mt-1">请尝试调整筛选条件或添加新车辆</p>
          </div>
        ) : (
          <>
            {/* 车辆卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onAction={handleVehicleAction}
                />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalRecords}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* 车辆表单模态框 */}
      <VehicleForm
        isOpen={showVehicleForm}
        onClose={() => {
          setShowVehicleForm(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleVehicleSubmit}
        vehicle={editingVehicle || undefined}
        isEdit={!!editingVehicle}
      />
    </div>
  );
};

export default Vehicles;
import React, { useState, useEffect } from 'react';
import type { MaintenanceRecord, MaintenanceFilters } from '../../types';
// import MaintenanceStatsComponent from '../../components/maintenance/MaintenanceStats';
// import MaintenanceFiltersComponent from '../../components/maintenance/MaintenanceFilters';
import MaintenanceCard from '../../components/maintenance/MaintenanceCard';
import { MAINTENANCE_SORT_OPTIONS } from '../../utils/constants';
import { maintenanceService } from '../../services/maintenanceService';

const Maintenance: React.FC = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);
  // const [stats, setStats] = useState<MaintenanceStats>({
  //   total: 0,
  //   pending: 0,
  //   inProgress: 0,
  //   completed: 0,
  //   overdue: 0
  // });
  const [filters] = useState<MaintenanceFilters>({});
  const [sortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // 获取维护数据
  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取统计数据
      // const statsResponse = await maintenanceService.getMaintenanceStats();
      // setStats(statsResponse);
      
      // 获取维护记录
      const recordsResponse = await maintenanceService.getMaintenanceRecords({
        ...filters
      });
      
      setMaintenanceRecords(recordsResponse.data);
      setFilteredRecords(recordsResponse.data);
    } catch (err) {
      console.error('获取维护数据失败:', err);
      setError('获取维护数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchMaintenanceData();
  }, [currentPage, filters, sortBy]);

  // 计算统计数据
  useEffect(() => {
    // setStats({
      //   total: maintenanceRecords.length,
      //   pending: maintenanceRecords.filter(r => r.status === 'pending').length,
      //   inProgress: maintenanceRecords.filter(r => r.status === 'in_progress').length,
      //   completed: maintenanceRecords.filter(r => r.status === 'completed').length,
      //   overdue: 0
      // });
  }, [maintenanceRecords]);

  // 筛选和排序
  useEffect(() => {
    let filtered = [...maintenanceRecords];

    // 应用筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        record =>
          record.vehicle.plateNumber.toLowerCase().includes(searchLower) ||
          record.serviceProvider.toLowerCase().includes(searchLower) ||
          record.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(record => record.type === filters.type);
    }

    if (filters.priority) {
      filtered = filtered.filter(record => record.priority === filters.priority);
    }

    if (filters.serviceProvider) {
      filtered = filtered.filter(record => 
        record.serviceProvider.toLowerCase().includes(filters.serviceProvider!.toLowerCase())
      );
    }

    if (filters.dateRange?.start) {
      filtered = filtered.filter(record => record.date >= filters.dateRange!.start);
    }

    if (filters.dateRange?.end) {
      filtered = filtered.filter(record => record.date <= filters.dateRange!.end);
    }

    // 应用排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case MAINTENANCE_SORT_OPTIONS.DATE_ASC:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case MAINTENANCE_SORT_OPTIONS.DATE_DESC:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case MAINTENANCE_SORT_OPTIONS.COST_ASC:
          return a.cost - b.cost;
        case MAINTENANCE_SORT_OPTIONS.COST_DESC:
          return b.cost - a.cost;
        case MAINTENANCE_SORT_OPTIONS.PRIORITY_ASC:
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        case MAINTENANCE_SORT_OPTIONS.PRIORITY_DESC:
          const priorityOrderDesc = { low: 1, medium: 2, high: 3, urgent: 4 };
          return priorityOrderDesc[b.priority as keyof typeof priorityOrderDesc] - priorityOrderDesc[a.priority as keyof typeof priorityOrderDesc];
        default:
          return 0;
      }
    });

    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [maintenanceRecords, filters, sortBy]);

  // 分页数据
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (maintenance: MaintenanceRecord) => {
    // TODO: 导航到编辑页面或打开编辑模态框
    console.log('编辑维修记录:', maintenance);
    // 这里可以添加路由跳转或模态框逻辑
  };

  const handleView = (maintenance: MaintenanceRecord) => {
    // TODO: 导航到详情页面或打开详情模态框
    console.log('查看维修记录:', maintenance);
    // 这里可以添加路由跳转或模态框逻辑
  };

  const handleDelete = async (maintenance: MaintenanceRecord) => {
    if (window.confirm('确定要删除这条维修记录吗？')) {
      try {
        await maintenanceService.deleteMaintenanceRecord(maintenance.id);
        // 重新获取数据
        fetchMaintenanceData();
      } catch (error) {
        console.error('删除维修记录失败:', error);
        setError('删除维修记录失败，请重试');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">维修管理</h1>
          <p className="text-gray-600 mt-1">管理车辆维修记录和保养计划</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          + 新增维修记录
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      {/* <MaintenanceStatsComponent stats={stats} /> */}

      {/* 筛选器 */}
      {/* <MaintenanceFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      /> */}

      {/* 维修记录列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {paginatedRecords.map(record => (
          <MaintenanceCard
            key={record.id}
            maintenance={record}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无维修记录</h3>
          <p className="text-gray-500 mb-4">没有找到符合条件的维修记录</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            新增维修记录
          </button>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            显示第 {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredRecords.length)} 条，
            共 {filteredRecords.length} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="px-3 py-1 text-sm">
              第 {currentPage} / {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
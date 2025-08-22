import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import type { Driver } from '../../types';
import DriverStats from '../../components/drivers/DriverStats';
import DriverFilters from '../../components/drivers/DriverFilters';
import DriverCard from '../../components/drivers/DriverCard';
import * as driverService from '../../services/driverService';
// import Pagination from '../../components/common/Pagination';
import {
  DRIVER_STATUS,
  DRIVER_SORT_OPTIONS,
  LICENSE_TYPES,
} from '../../utils/constants';

const Drivers: React.FC = () => {
  // 状态管理
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [licenseTypeFilter, setLicenseTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState<string>(DRIVER_SORT_OPTIONS.NAME_ASC);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // 加载驾驶员数据
  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await driverService.getDrivers();
       setDrivers(response.data);
    } catch (err) {
      console.error('Failed to load drivers:', err);
      setError('加载驾驶员数据失败');
      // 回退到模拟数据
      const mockDrivers: Driver[] = [
        {
          id: '1',
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
          licenseType: LICENSE_TYPES.A1,
          licenseExpiry: '2026-12-31',
          experience: 8,
          status: DRIVER_STATUS.AVAILABLE,
          phone: '13800138001',
          email: 'zhangsan@company.com',
          rating: 4.8,
          monthlyTasks: 15,
          totalTasks: 120,
          emergencyContact: '李四',
          emergencyPhone: '13800138002',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          userId: 'user2',
          user: {
            id: 'user2',
            username: 'lisi',
            email: 'lisi@company.com',
            name: '李四',
            role: 'user',
            department: '运输部',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          name: '李四',
          licenseNumber: 'B987654321',
          licenseType: LICENSE_TYPES.B1,
          licenseExpiry: '2025-06-30',
          experience: 5,
          status: DRIVER_STATUS.BUSY,
          phone: '13800138003',
          email: 'lisi@company.com',
          rating: 4.5,
          monthlyTasks: 18,
          totalTasks: 95,
          currentTask: '前往机场接送客户',
          emergencyContact: '王五',
          emergencyPhone: '13800138004',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '3',
          userId: 'user3',
          user: {
            id: 'user3',
            username: 'wangwu',
            email: 'wangwu@company.com',
            name: '王五',
            role: 'user',
            department: '运输部',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          name: '王五',
          licenseNumber: 'C456789123',
          licenseType: LICENSE_TYPES.C1,
          licenseExpiry: '2027-03-15',
          experience: 12,
          status: DRIVER_STATUS.ON_LEAVE,
          phone: '13800138005',
          email: 'wangwu@company.com',
          rating: 4.9,
          monthlyTasks: 0,
          totalTasks: 200,
          leaveReason: '年假',
          leaveEndDate: '2024-02-15',
          emergencyContact: '赵六',
          emergencyPhone: '13800138006',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];
      setDrivers(mockDrivers);
    } finally {
      setLoading(false);
    }
  };

  // 计算统计数据
  const calculateStats = (driverList: Driver[]) => {
    const total = driverList.length;
    const available = driverList.filter(d => d.status === DRIVER_STATUS.AVAILABLE).length;
    const busy = driverList.filter(d => d.status === DRIVER_STATUS.BUSY).length;
    const onLeave = driverList.filter(d => d.status === DRIVER_STATUS.ON_LEAVE).length;
    const inactive = driverList.filter(d => d.status === DRIVER_STATUS.INACTIVE).length;
    const averageRating = total > 0 ? driverList.reduce((sum, d) => sum + d.rating, 0) / total : 0;

    return {
      total,
      available,
      busy,
      onLeave,
      inactive,
      averageRating,
    };
  };

  // 筛选和排序逻辑
  const filterAndSortDrivers = () => {
    let filtered = [...drivers];

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(
        driver =>
          driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.phone.includes(searchTerm) ||
          driver.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 状态筛选
    if (statusFilter) {
      filtered = filtered.filter(driver => driver.status === statusFilter);
    }

    // 驾照类型筛选
    if (licenseTypeFilter) {
      filtered = filtered.filter(driver => driver.licenseType === licenseTypeFilter);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case DRIVER_SORT_OPTIONS.NAME_ASC:
          return a.name.localeCompare(b.name);
        case DRIVER_SORT_OPTIONS.NAME_DESC:
          return b.name.localeCompare(a.name);
        case DRIVER_SORT_OPTIONS.RATING_DESC:
          return b.rating - a.rating;
        case DRIVER_SORT_OPTIONS.RATING_ASC:
          return a.rating - b.rating;
        case DRIVER_SORT_OPTIONS.TASKS_DESC:
          return b.totalTasks - a.totalTasks;
        case DRIVER_SORT_OPTIONS.TASKS_ASC:
          return a.totalTasks - b.totalTasks;
        default:
          return 0;
      }
    });

    setFilteredDrivers(filtered);
  };

  // 分页逻辑
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

  // 事件处理函数
  const handleEdit = (driver: Driver) => {
    console.log('编辑驾驶员:', driver);
    // TODO: 导航到编辑页面
  };

  const handleView = (driver: Driver) => {
    console.log('查看驾驶员:', driver);
    // TODO: 导航到驾驶员详情页面
    // navigate(`/drivers/${driver.id}`);
  };

  const handleAssignTask = async (driver: Driver) => {
    try {
      console.log('分配任务给驾驶员:', driver);
      // TODO: 实现分配任务功能
      // await driverService.assignTask(driver.id, taskData);
      // loadDrivers(); // 重新加载数据
    } catch (err) {
      console.error('分配任务失败:', err);
      setError('分配任务失败');
    }
  };

  const handleCall = (driver: Driver) => {
    // 直接拨打电话
    if (driver.phone) {
      window.open(`tel:${driver.phone}`);
    }
  };

  const handleAddDriver = () => {
    console.log('添加新驾驶员');
    // TODO: 导航到添加驾驶员页面
    // navigate('/drivers/new');
  };

  const handleExport = async () => {
    try {
      console.log('导出驾驶员数据');
      // 创建CSV内容
      const csvContent = [
        ['姓名', '电话', '邮箱', '驾照号', '驾照类型', '状态', '评分'].join(','),
        ...filteredDrivers.map(driver => [
          driver.name,
          driver.phone,
          driver.email,
          driver.licenseNumber,
          driver.licenseType,
          driver.status,
          driver.rating?.toString() || ''
        ].join(','))
      ].join('\n');
      
      // 下载文件
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `drivers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (err) {
      console.error('导出失败:', err);
      setError('导出数据失败');
    }
  };

  const handleImport = () => {
    console.log('导入驾驶员数据');
    // TODO: 实现文件上传和导入功能
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: 处理文件上传和解析
        console.log('选择的文件:', file.name);
      }
    };
    input.click();
  };

  // 初始化数据
  useEffect(() => {
    loadDrivers();
  }, []);

  // 筛选和排序效果
  useEffect(() => {
    filterAndSortDrivers();
  }, [drivers, searchTerm, statusFilter, licenseTypeFilter, sortBy]);

  // 重置页码当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, licenseTypeFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = calculateStats(drivers);

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">驾驶员管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理和监控所有驾驶员信息
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleImport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            导入
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            导出
          </button>
          <button
            onClick={handleAddDriver}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加驾驶员
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <DriverStats stats={stats} />

      {/* 筛选器 */}
      <DriverFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        licenseTypeFilter={licenseTypeFilter}
        onLicenseTypeFilterChange={setLicenseTypeFilter}
        sortBy={sortBy}
        onSortChange={(value: string) => setSortBy(value)}
      />

      {/* 驾驶员列表 */}
      {currentDrivers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">暂无驾驶员数据</div>
          <p className="text-gray-400 mt-2">请尝试调整筛选条件或添加新的驾驶员</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDrivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onEdit={handleEdit}
              onView={handleView}
              onAssignTask={handleAssignTask}
              onCall={handleCall}
            />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示第 <span className="font-medium">{startIndex + 1}</span> 到{' '}
                <span className="font-medium">{Math.min(endIndex, filteredDrivers.length)}</span> 条，
                共 <span className="font-medium">{filteredDrivers.length}</span> 条记录
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">上一页</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === currentPage
                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">下一页</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
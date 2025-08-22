import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, XCircle, Eye, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Application, ApplicationFilters as ApplicationFiltersType, ApplicationStats as ApplicationStatsType } from '../../types';
import ApplicationCard from './components/ApplicationCard';
import ApplicationFilters from './components/ApplicationFilters';
import Pagination from '../vehicles/components/Pagination';
import { applicationService } from '../../services/applicationService';

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStatsType>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    approvalRate: 0
  });
  const [filters, setFilters] = useState<ApplicationFiltersType>({
    search: '',
    status: undefined,
    department: undefined,
    startDate: undefined,
    endDate: undefined
  });
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 10;

  // 获取申请列表
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 根据活动标签设置状态过滤
      const statusFilter = activeTab === 'all' ? undefined : activeTab;
      const appliedFilters = {
        ...filters,
        status: statusFilter
      };

      // 真实API调用
       const response = await applicationService.getApplications(
         appliedFilters,
         currentPage,
         pageSize
       );
        
       setApplications(response.data);
       setTotalPages(response.totalPages);
       setTotalRecords(response.total);
    } catch (err) {
      setError('获取申请列表失败');
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      // 真实API调用
      const statsData = await applicationService.getApplicationStats();
      setStats(statsData as ApplicationStatsType);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters, activeTab, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (newFilters: ApplicationFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: 'all' | 'pending' | 'approved' | 'rejected') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApprove = async (applicationId: string) => {
    try {
      setError(null);
      await applicationService.approveApplication(applicationId, true);
      await fetchApplications();
      await fetchStats();
    } catch (err) {
      setError('批准申请失败');
      console.error('Error approving application:', err);
    }
  };

  const handleReject = async (applicationId: string, reason?: string) => {
    try {
      setError(null);
      await applicationService.approveApplication(applicationId, false, reason);
      await fetchApplications();
      await fetchStats();
    } catch (err) {
      setError('拒绝申请失败');
      console.error('Error rejecting application:', err);
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'pending': return stats.pending;
      case 'approved': return stats.approved;
      case 'rejected': return stats.rejected;
      default: return stats.total;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">申请管理</h1>
          <p className="text-gray-600 mt-1">管理和审批用车申请</p>
        </div>
        <button 
          onClick={() => navigate('/applications/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新建申请</span>
        </button>
      </div>

      {/* 统计卡片 */}
      {/* 内联统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">总申请数</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">待审批</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">已通过</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">已拒绝</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="bg-red-500 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">通过率</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.approvalRate}%</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

      {/* 筛选器 */}
      <ApplicationFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {/* 状态标签 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'all', label: '全部申请' },
            { key: 'pending', label: '待审批' },
            { key: 'approved', label: '已批准' },
            { key: 'rejected', label: '已拒绝' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getTabIcon(tab.key)}
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {getTabCount(tab.key)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 申请列表 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">{error}</div>
            <button
              onClick={fetchApplications}
              className="text-blue-600 hover:text-blue-700"
            >
              重试
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无申请记录</p>
          </div>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>

      {/* 分页 */}
      {totalRecords > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalRecords / pageSize)}
          totalItems={totalRecords}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Applications;
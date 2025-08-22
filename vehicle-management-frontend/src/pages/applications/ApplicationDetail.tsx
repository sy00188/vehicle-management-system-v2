import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Car, FileText, Clock, CheckCircle, XCircle, User, Mail, Edit, Trash2 } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import type { Application } from '../../types';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await applicationService.getApplicationById(id);
      setApplication(response);
    } catch (err) {
      setError('获取申请详情失败');
      console.error('Error fetching application:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!application) return;
    
    try {
      setError(null);
      await applicationService.approveApplication(application.id, true);
      await fetchApplication();
    } catch (err) {
      setError('批准申请失败');
      console.error('Error approving application:', err);
    }
  };

  const handleReject = async () => {
    if (!application || !rejectReason.trim()) return;
    
    try {
      setError(null);
      await applicationService.approveApplication(application.id, false, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      await fetchApplication();
    } catch (err) {
      setError('拒绝申请失败');
      console.error('Error rejecting application:', err);
    }
  };

  const handleDelete = async () => {
    if (!application || !window.confirm('确定要删除这个申请吗？此操作不可撤销。')) return;
    
    try {
      setIsDeleting(true);
      setError(null);
      await applicationService.deleteApplication(application.id);
      navigate('/applications');
    } catch (err) {
      setError('删除申请失败');
      console.error('Error deleting application:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待审批';
      case 'approved':
        return '已批准';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知状态';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回申请列表
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">申请不存在</h3>
            <p className="text-gray-500">找不到指定的申请记录</p>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回申请列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/applications')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回申请列表
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">申请详情</h1>
              <p className="text-gray-500 mt-1">申请编号: {application.id}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStatusIcon(application.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 申请人信息 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                申请人信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <p className="text-gray-900">{application.applicant.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                  <p className="text-gray-900">{application.applicant.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                   <p className="text-gray-900">{application.applicant.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{application.applicant.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 申请详情 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                申请详情
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用车目的</label>
                  <p className="text-gray-900">{application.purpose}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{new Date(application.startDate).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{new Date(application.endDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目的地</label>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{application.destination}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">乘车人数</label>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{application.passengers}人</p>
                  </div>
                </div>
                
                {application.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{application.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 车辆信息 */}
            {application.vehicle && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  分配车辆
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">车牌号</label>
                    <p className="text-gray-900 font-mono">{application.vehicle.plateNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">车型</label>
                    <p className="text-gray-900">{application.vehicle.model}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">品牌</label>
                    <p className="text-gray-900">{application.vehicle.brand}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">座位数</label>
                    <p className="text-gray-900">{application.vehicle.seats}座</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 操作按钮 */}
            {application.status === 'pending' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">操作</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    批准申请
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    拒绝申请
                  </button>
                </div>
              </div>
            )}

            {/* 管理操作 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">管理</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/applications/${application.id}/edit`)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  编辑申请
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? '删除中...' : '删除申请'}
                </button>
              </div>
            </div>

            {/* 申请时间 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">时间信息</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-700 font-medium">申请时间</label>
                  <p className="text-gray-600">{new Date(application.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">更新时间</label>
                  <p className="text-gray-600">{new Date(application.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* 审批信息 */}
            {application.approver && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">审批信息</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-gray-700 font-medium">审批人</label>
                    <p className="text-gray-600">{application.approver.name}</p>
                  </div>
                  {application.approvedAt && (
                    <div>
                      <label className="block text-gray-700 font-medium">审批时间</label>
                      <p className="text-gray-600">{new Date(application.approvedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {application.rejectionReason && (
                    <div>
                      <label className="block text-gray-700 font-medium">拒绝原因</label>
                      <p className="text-gray-600 bg-red-50 p-2 rounded">{application.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 拒绝申请模态框 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">拒绝申请</h3>
            <p className="text-gray-600 mb-4">请输入拒绝原因：</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="请输入拒绝原因..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;
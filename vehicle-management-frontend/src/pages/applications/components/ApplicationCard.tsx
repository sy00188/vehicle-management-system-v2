import React, { useState } from 'react';
import { Check, X, Eye, Clock, CheckCircle, XCircle, User, MapPin, Calendar, Car, Users } from 'lucide-react';
import type { Application } from '../../../types';
import { applicationService } from '../../../services/applicationService';

interface ApplicationCardProps {
  application: Application;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string, reason?: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onApprove,
  onReject
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'pending': return '待审批';
      case 'approved': return '已批准';
      case 'rejected': return '已拒绝';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRejectSubmit = async () => {
     try {
       await applicationService.approveApplication(application.id, false, rejectReason);
       onReject(application.id, rejectReason);
       setShowRejectModal(false);
       setRejectReason('');
     } catch (error) {
       console.error('拒绝失败:', error);
       // TODO: 显示错误提示
     }
   };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* 申请人信息和状态 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{application.applicant.name}</h3>
              <p className="text-gray-500 text-sm">{application.applicant.department} · {application.applicant.role === 'admin' ? '管理员' : application.applicant.role === 'manager' ? '经理' : '员工'}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)}
            <span>{getStatusText(application.status)}</span>
          </div>
        </div>

        {/* 申请详情 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">申请事由</p>
            <p className="text-gray-900 font-medium">{application.purpose}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">用车时间</p>
            <p className="text-gray-900">
              {formatDate(application.startDate)} - {formatDate(application.endDate)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">目的地</p>
            <p className="text-gray-900 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              {application.destination}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">申请车型</p>
            <p className="text-gray-900 flex items-center">
              <Car className="w-4 h-4 mr-1 text-gray-400" />
              {application.vehicle ? `${application.vehicle.brand} ${application.vehicle.model}` : '待分配'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">乘车人数</p>
            <p className="text-gray-900 flex items-center">
              <Users className="w-4 h-4 mr-1 text-gray-400" />
              {application.passengers} 人
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">申请时间</p>
            <p className="text-gray-900 flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              {formatDate(application.createdAt)}
            </p>
          </div>
        </div>

        {/* 备注信息 */}
        {application.notes && (
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-1">备注</p>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{application.notes}</p>
          </div>
        )}

        {/* 审批信息 */}
        {application.status === 'approved' && application.approver && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm">
              <strong>审批人：</strong>{application.approver.name} · 
              <strong>审批时间：</strong>{application.approvedAt ? formatDate(application.approvedAt) : ''}
            </p>
          </div>
        )}

        {application.status === 'rejected' && application.rejectionReason && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>拒绝原因：</strong>{application.rejectionReason}
            </p>
            {application.approver && (
              <p className="text-red-800 text-sm mt-1">
                <strong>审批人：</strong>{application.approver.name} · 
                <strong>审批时间：</strong>{application.approvedAt ? formatDate(application.approvedAt) : ''}
              </p>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>申请编号: #{application.id.slice(-6).toUpperCase()}</span>
          </div>
          <div className="flex space-x-2">
            {application.status === 'pending' && (
              <>
                <button
                  onClick={async () => {
                     try {
                       await applicationService.approveApplication(application.id, true);
                       onApprove(application.id);
                     } catch (error) {
                       console.error('审批失败:', error);
                       // TODO: 显示错误提示
                     }
                   }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>批准</span>
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>拒绝</span>
                </button>
              </>
            )}
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>详情</span>
            </button>
          </div>
        </div>
      </div>

      {/* 拒绝原因模态框 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">拒绝申请</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                拒绝原因
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="请输入拒绝原因..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationCard;
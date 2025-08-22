import React from 'react';
import type { Expense } from '../../types';
import {
  EXPENSE_STATUS_LABELS,
  EXPENSE_TYPE_LABELS
} from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/format';

interface ExpenseCardProps {
  expense: Expense;
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onApprove?: (expense: Expense) => void;
  onReject?: (expense: Expense) => void;
  onPay?: (expense: Expense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onPay
}) => {
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      fuel: 'text-orange-400',
      maintenance: 'text-blue-400',
      insurance: 'text-green-400',
      registration: 'text-purple-400',
      fine: 'text-red-400',
      parking: 'text-purple-400',
      toll: 'text-green-400',
      other: 'text-gray-400'
    };
    return colorMap[type] || 'text-gray-400';
  };

  const getTypeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      fuel: 'fas fa-gas-pump',
      maintenance: 'fas fa-wrench',
      insurance: 'fas fa-shield-alt',
      registration: 'fas fa-file-alt',
      fine: 'fas fa-exclamation-triangle',
      parking: 'fas fa-parking',
      toll: 'fas fa-road',
      other: 'fas fa-receipt'
    };
    return iconMap[type] || 'fas fa-receipt';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(expense.type)}`}>
            <i className={`${getTypeIcon(expense.type)} text-lg`}></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {EXPENSE_TYPE_LABELS[expense.type as keyof typeof EXPENSE_TYPE_LABELS] || expense.type}
            </h3>
            <p className="text-gray-400 text-sm">
              {expense.vehicle?.plateNumber || '未知车辆'} • {expense.vehicle?.brand || ''} {expense.vehicle?.model || ''}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
            {EXPENSE_STATUS_LABELS[expense.status as keyof typeof EXPENSE_STATUS_LABELS] || expense.status}
          </span>
        </div>
      </div>

      {/* 费用信息 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">费用金额</p>
          <p className="text-xl font-bold text-white">{formatCurrency(expense.amount)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">发生日期</p>
          <p className="text-white">{formatDate(expense.date)}</p>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="space-y-3 mb-4">
        {expense.serviceProvider && (
          <div className="flex items-center space-x-2">
            <i className="fas fa-store text-gray-400 w-4"></i>
            <span className="text-gray-300 text-sm">服务商：{expense.serviceProvider}</span>
          </div>
        )}
        
        {expense.location && (
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marker-alt text-gray-400 w-4"></i>
            <span className="text-gray-300 text-sm">地点：{expense.location}</span>
          </div>
        )}
        
        {expense.mileage && (
          <div className="flex items-center space-x-2">
            <i className="fas fa-tachometer-alt text-gray-400 w-4"></i>
            <span className="text-gray-300 text-sm">里程：{expense.mileage.toLocaleString()} km</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <i className="fas fa-user text-gray-400 w-4"></i>
          <span className="text-gray-300 text-sm">申请人：{expense.creator?.name || '未知用户'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <i className="fas fa-calendar text-gray-400 w-4"></i>
          <span className="text-gray-300 text-sm">申请时间：{formatDate(expense.createdAt, 'datetime')}</span>
        </div>
      </div>

      {/* 描述 */}
      {expense.description && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">费用描述</p>
          <p className="text-gray-300 text-sm bg-gray-700 rounded p-3">{expense.description}</p>
        </div>
      )}

      {/* 附件 */}
      {expense.attachments && expense.attachments.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">附件</p>
          <div className="flex flex-wrap gap-2">
            {expense.attachments.map((_, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                <i className="fas fa-paperclip mr-1"></i>
                附件{index + 1}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 审批信息 */}
      {expense.status === 'approved' && expense.approver && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded">
          <div className="flex items-center space-x-2 text-green-400">
            <i className="fas fa-check-circle"></i>
            <span className="text-sm">已由 {expense.approver?.name || '未知审批人'} 于 {formatDate(expense.approvedAt!, 'datetime')} 批准</span>
          </div>
        </div>
      )}

      {expense.status === 'rejected' && expense.rejectionReason && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded">
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <i className="fas fa-times-circle"></i>
            <span className="text-sm">已拒绝</span>
          </div>
          <p className="text-red-300 text-sm">{expense.rejectionReason}</p>
        </div>
      )}

      {expense.status === 'paid' && expense.paymentDate && (
        <div className="mb-4 p-3 bg-gray-900/20 border border-gray-700 rounded">
          <div className="flex items-center space-x-2 text-gray-400">
            <i className="fas fa-credit-card"></i>
            <span className="text-sm">已于 {formatDate(expense.paymentDate, 'datetime')} 支付</span>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(expense)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            <i className="fas fa-eye mr-1"></i>
            查看
          </button>
          
          {expense.status === 'pending' && (
            <button
              onClick={() => onEdit(expense)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
            >
              <i className="fas fa-edit mr-1"></i>
              编辑
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {expense.status === 'pending' && onApprove && onReject && (
            <>
              <button
                onClick={() => onApprove(expense)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                <i className="fas fa-check mr-1"></i>
                批准
              </button>
              <button
                onClick={() => onReject(expense)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
              >
                <i className="fas fa-times mr-1"></i>
                拒绝
              </button>
            </>
          )}
          
          {expense.status === 'approved' && onPay && (
            <button
              onClick={() => onPay(expense)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
            >
              <i className="fas fa-credit-card mr-1"></i>
              支付
            </button>
          )}
          
          {expense.status === 'pending' && (
            <button
              onClick={() => onDelete(expense)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              <i className="fas fa-trash mr-1"></i>
              删除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
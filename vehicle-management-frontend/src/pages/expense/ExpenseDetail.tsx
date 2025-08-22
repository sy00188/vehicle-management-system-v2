import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
  MapPinIcon,
  TruckIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import type { Expense, Vehicle, User } from '../../types';
import * as expenseService from '../../services/expenseService';

interface ExpenseDetailProps {
  expense?: Expense;
}

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({ expense: propExpense }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock data for demonstration
  const mockExpense: Expense = {
    id: id || '1',
    type: 'fuel',
    amount: 350.00,
    date: '2024-01-15',
    description: '车辆加油费用',
    status: 'pending',
    vehicleId: '1',
    serviceProvider: '中石化加油站',
    location: '北京市朝阳区建国路88号',
    mileage: 15500,
    receiptDate: '2024-01-15',
    createdBy: 'user1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    attachments: [
      {
        id: '1',
        name: '加油发票.pdf',
        url: '/files/receipt-001.pdf',
        type: 'application/pdf',
        size: 245760
      },
      {
        id: '2',
        name: '里程记录.jpg',
        url: '/files/mileage-001.jpg',
        type: 'image/jpeg',
        size: 156432
      }
    ],
    approvalHistory: [
      {
        id: '1',
        action: 'submitted',
        userId: 'user1',
        userName: '张三',
        timestamp: '2024-01-15T10:30:00Z',
        comment: '提交费用申请'
      },
      {
        id: '2',
        action: 'reviewed',
        userId: 'manager1',
        userName: '李经理',
        timestamp: '2024-01-15T14:20:00Z',
        comment: '审核中，需要补充里程记录'
      }
    ]
  };

  const mockVehicle: Vehicle = {
    id: '1',
    plateNumber: '京A12345',
    brand: '丰田',
    model: '凯美瑞',
    year: 2022,
    type: 'sedan',
    status: 'available',
    color: '白色',
    mileage: 15000,
    fuelType: 'gasoline',
    image: '/images/camry.jpg',
    purchaseDate: '2022-01-15',
    lastMaintenanceDate: '2024-01-15',
    nextMaintenanceDate: '2024-07-15',
    currentDriver: undefined,
    notes: '状态良好',
    department: '运营部',
    seats: 5,
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  };

  const mockUser: User = {
    id: 'user1',
    username: 'zhangsan',
    email: 'zhangsan@company.com',
    name: '张三',
    role: 'user',
    department: '运营部',
    avatar: '/images/avatar-1.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  };

  useEffect(() => {
    const loadExpenseDetail = async () => {
      if (propExpense) {
        setExpense(propExpense);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 加载费用详情
        const expense = await expenseService.getExpenseById(id!);
        setExpense(expense);
      } catch (error) {
        console.error('加载费用详情失败:', error);
        // 出错时使用模拟数据
        setExpense(mockExpense);
      } finally {
        setLoading(false);
      }
    };

    loadExpenseDetail();
  }, [id, propExpense]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待审批';
      case 'approved':
        return '已批准';
      case 'rejected':
        return '已拒绝';
      case 'paid':
        return '已支付';
      default:
        return status;
    }
  };

  const getExpenseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fuel: '燃油费',
      maintenance: '维修费',
      insurance: '保险费',
      parking: '停车费',
      toll: '过路费',
      fine: '罚款',
      other: '其他费用'
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAction = async (action: 'approve' | 'reject' | 'pay') => {
    if (!expense) return;
    
    setActionLoading(action);
    try {
      let newStatus: 'approved' | 'rejected' | 'paid';
      switch (action) {
        case 'approve':
          newStatus = 'approved';
          break;
        case 'reject':
          newStatus = 'rejected';
          break;
        case 'pay':
          newStatus = 'paid';
          break;
        default:
          return;
      }
      
      const updatedExpense = await expenseService.updateExpense(expense.id, { status: newStatus });
      
      setExpense(updatedExpense);
      console.log(`操作成功: ${action}`);
    } catch (error) {
      console.error(`执行操作失败: ${action}`, error);
      // 可以在这里添加错误提示
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!expense) return;
    
    setActionLoading('delete');
    try {
      await expenseService.deleteExpense(expense.id);
      
      console.log('删除费用记录成功');
      navigate('/expenses');
    } catch (error) {
      console.error('删除费用记录失败:', error);
      // 可以在这里添加错误提示
    } finally {
      setActionLoading(null);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = () => {
    navigate(`/expenses/${id}/edit`);
  };

  const handleDownload = (attachment: any) => {
    try {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.target = '_blank';
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('开始下载文件:', attachment.name);
    } catch (error) {
      console.error('下载文件失败:', error);
      // 可以在这里添加错误提示
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">费用记录未找到</h2>
          <p className="text-gray-600 mb-4">请检查费用ID是否正确</p>
          <button
            onClick={() => navigate('/expenses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回费用列表
          </button>
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
            onClick={() => navigate('/expenses')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">费用详情</h1>
            <p className="text-gray-600">费用编号: {expense.id}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {expense.status === 'pending' && (
            <>
              <button
                onClick={() => handleAction('approve')}
                disabled={actionLoading === 'approve'}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === 'approve' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckIcon className="h-4 w-4 mr-2" />
                )}
                批准
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={actionLoading === 'reject'}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === 'reject' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <XMarkIcon className="h-4 w-4 mr-2" />
                )}
                拒绝
              </button>
            </>
          )}
          
          {expense.status === 'approved' && (
            <button
              onClick={() => handleAction('pay')}
              disabled={actionLoading === 'pay'}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading === 'pay' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CreditCardIcon className="h-4 w-4 mr-2" />
              )}
              支付
            </button>
          )}
          
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            编辑
          </button>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            删除
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(expense.status)}`}>
                {getStatusLabel(expense.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">费用类型</p>
                    <p className="font-medium text-gray-900">{getExpenseTypeLabel(expense.type)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">费用金额</p>
                    <p className="font-medium text-gray-900 text-lg">¥{expense.amount.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">发生日期</p>
                    <p className="font-medium text-gray-900">{expense.receiptDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">车辆信息</p>
                    <p className="font-medium text-gray-900">{mockVehicle.plateNumber} - {mockVehicle.brand} {mockVehicle.model}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">服务商</p>
                    <p className="font-medium text-gray-900">{expense.serviceProvider}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">申请人</p>
                    <p className="font-medium text-gray-900">{mockUser.name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">费用描述</p>
                  <p className="text-gray-900">{expense.description}</p>
                </div>
              </div>
            </div>
            
            {expense.location && (
              <div className="mt-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">发生地点</p>
                    <p className="text-gray-900">{expense.location}</p>
                  </div>
                </div>
              </div>
            )}
            
            {expense.mileage && (
              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">里程数</p>
                    <p className="font-medium text-gray-900">{expense.mileage.toLocaleString()} 公里</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attachments */}
          {expense.attachments && expense.attachments.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">相关附件</h2>
              <div className="space-y-3">
                {expense.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        title="预览"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(attachment)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        title="下载"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">审批历史</h2>
            <div className="space-y-4">
              {expense.approvalHistory?.map((history, index) => (
                <div key={history.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <ClockIcon className={`h-4 w-4 ${
                        index === 0 ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{history.userName}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(history.timestamp)}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{history.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
            <div className="space-y-3">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                编辑费用
              </button>
              <button
                onClick={() => navigate('/expenses/new')}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                新建费用
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <TrashIcon className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">确认删除</h3>
              <p className="text-sm text-gray-500 mt-2">
                确定要删除这条费用记录吗？此操作无法撤销。
              </p>
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading === 'delete'}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === 'delete' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    '确认删除'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseDetail;
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Filter,
  Search,
  // MoreVertical,
  Check,
  Trash2,
  // Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  // User,
  // Car,
  // Settings,
  // FileText,
  X
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../stores/appStore';
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_COLORS
  // NOTIFICATION_STATUS,
  // NOTIFICATION_STATUS_LABELS,
  // NOTIFICATION_SORT_OPTIONS,
  // NOTIFICATION_SORT_LABELS,
  // NOTIFICATION_FILTER_OPTIONS,
  // NOTIFICATION_FILTER_LABELS
} from '../../utils/constants';

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  recent: number;
}

const Notifications: React.FC = () => {
  // const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  
  // 筛选和排序状态
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('CREATED_DESC');
  const [showFilters, setShowFilters] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  
  // 选择状态
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircle className="w-4 h-4" />;
      case NOTIFICATION_TYPES.ERROR:
        return <AlertCircle className="w-4 h-4" />;
      case NOTIFICATION_TYPES.WARNING:
        return <AlertCircle className="w-4 h-4" />;
      case NOTIFICATION_TYPES.INFO:
        return <Info className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // 获取通知类型颜色
  const getTypeColor = (type: string) => {
    return NOTIFICATION_TYPE_COLORS[type as keyof typeof NOTIFICATION_TYPE_COLORS] || 'primary';
  };

  // 获取通知类型标签
  const getTypeLabel = (type: string) => {
    return NOTIFICATION_TYPE_LABELS[type as keyof typeof NOTIFICATION_TYPE_LABELS] || type;
  };

  // 加载通知列表
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications(
        currentPage,
        pageSize,
        {
          status: statusFilter !== 'ALL' ? statusFilter as 'read' | 'unread' : undefined,
          type: typeFilter !== 'ALL' ? typeFilter as 'success' | 'error' | 'warning' | 'info' : undefined,
        },
        {
          field: sortBy.includes('CREATED') ? 'createdAt' : 'type',
          order: sortBy.includes('DESC') ? 'desc' : 'asc',
        }
      );
      
      setNotifications(response.notifications);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.total);
      
      // 加载统计信息
      const statsResponse = await notificationService.getNotificationStats();
      setStats(statsResponse);
      
    } catch (err) {
      console.error('加载通知失败:', err);
      setError('加载通知失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 标记为已读
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (err) {
      console.error('标记已读失败:', err);
    }
  };

  // 删除通知
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条通知吗？')) return;
    
    try {
      await notificationService.deleteNotification(id);
      await loadNotifications();
    } catch (err) {
      console.error('删除通知失败:', err);
    }
  };

  // 批量操作
  const handleBatchMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await notificationService.markMultipleAsRead(selectedNotifications);
      setSelectedNotifications([]);
      await loadNotifications();
    } catch (err) {
      console.error('批量标记已读失败:', err);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedNotifications.length === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedNotifications.length} 条通知吗？`)) return;
    
    try {
      await notificationService.deleteMultipleNotifications(selectedNotifications);
      setSelectedNotifications([]);
      await loadNotifications();
    } catch (err) {
      console.error('批量删除失败:', err);
    }
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  // 格式化时间
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '未知时间';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setSortBy('CREATED_DESC');
    setCurrentPage(1);
  };

  useEffect(() => {
    loadNotifications();
  }, [currentPage, searchTerm, statusFilter, typeFilter, sortBy]);

  useEffect(() => {
    setShowBatchActions(selectedNotifications.length > 0);
  }, [selectedNotifications]);

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知管理</h1>
          {stats && (
            <p className="text-sm text-gray-600 mt-1">
              共 {stats.total} 条通知，{stats.unread} 条未读
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
          <button
            onClick={loadNotifications}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">总通知</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">未读</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">已读</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total - stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">最近</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 筛选面板 */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜索
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索通知内容..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">全部状态</option>
                <option value="unread">未读</option>
                <option value="read">已读</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                类型
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">全部类型</option>
                <option value="success">成功</option>
                <option value="error">错误</option>
                <option value="warning">警告</option>
                <option value="info">信息</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排序
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="CREATED_DESC">创建时间（新到旧）</option>
                <option value="CREATED_ASC">创建时间（旧到新）</option>
                <option value="TYPE_ASC">类型（A-Z）</option>
                <option value="TYPE_DESC">类型（Z-A）</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              重置筛选
            </button>
          </div>
        </div>
      )}

      {/* 批量操作栏 */}
      {showBatchActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              已选择 {selectedNotifications.length} 条通知
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBatchMarkAsRead}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4 mr-1" />
                标记已读
              </button>
              <button
                onClick={handleBatchDelete}
                className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除
              </button>
              <button
                onClick={() => setSelectedNotifications([])}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消选择
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通知列表 */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* 列表头部 */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.length > 0 && selectedNotifications.length === notifications.length}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">全选</span>
          </div>
        </div>

        {/* 通知项目 */}
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无通知</h3>
              <p className="mt-1 text-sm text-gray-500">
                {error ? error : '当前没有符合条件的通知'}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNotifications([...selectedNotifications, notification.id]);
                      } else {
                        setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                      }
                    }}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-full ${getTypeColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <h3 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {getTypeLabel(notification.type)} • {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="标记已读"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`mt-2 text-sm ${
                      !notification.read ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    {notification.data && Object.keys(notification.data).length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        相关数据: {typeof notification.data === 'string' ? notification.data : JSON.stringify(notification.data)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} 条，共 {totalCount} 条
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-700">
                  第 {currentPage} / {totalPages} 页
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
import React, { useState, useEffect } from 'react';
import type { Expense, ExpenseStats, ExpenseFilters } from '../../types';
import ExpenseStatsComponent from '../../components/expense/ExpenseStats';
import ExpenseFiltersComponent from '../../components/expense/ExpenseFilters';
import ExpenseCard from '../../components/expense/ExpenseCard';

import * as expenseService from '../../services/expenseService';

const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    paid: 0,
    totalAmount: 0,
    monthlyAmount: 0,
    fuelCost: 0,
    maintenanceCost: 0,
    insuranceCost: 0,
    otherCost: 0
  });
  const [filters, setFilters] = useState<ExpenseFilters>({
    status: undefined,
    type: undefined,
    vehicleId: undefined,
    createdBy: undefined,
    serviceProvider: undefined,
    dateRange: {
      start: '',
      end: ''
    },
    amountRange: {
      min: 0,
      max: 0
    },
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // 加载数据
  useEffect(() => {
    loadExpenses();
    loadStats();
  }, []);

  // 加载费用列表
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getExpenses(filters, currentPage, itemsPerPage);
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (error) {
      console.error('加载费用列表失败:', error);
      // 使用模拟数据作为后备
      const mockExpenses: Expense[] = [
      {
        id: '1',
        vehicleId: '1',
        vehicle: {
          id: '1',
          plateNumber: '京A12345',
          brand: '丰田',
          model: '凯美瑞',
          year: 2022,
          color: '白色',
          type: 'sedan' as const,
          image: '/images/vehicles/camry.jpg',
          purchaseDate: '2022-01-01',
          lastMaintenanceDate: '2024-01-15',
          nextMaintenanceDate: '2024-07-15',
          currentDriver: null,
          notes: '',
          mileage: 15000,
          fuelType: 'gasoline' as const,
          seats: 5,
          department: '销售部',
          status: 'available' as const,
          createdAt: '2022-01-01',
          updatedAt: '2024-01-15'
        },
        type: 'fuel' as const,
        amount: 300.00,
        description: '加油费用',
        date: '2024-01-15',
        receiptDate: '2024-01-15',
        receipt: 'receipt_001.jpg',
        status: 'approved' as const,
        createdBy: '1',
        creator: {
          id: '1',
          username: 'zhangsan',
          name: '张三',
          email: 'zhangsan@example.com',
          role: 'user' as const,
          department: '销售部',
          avatar: '',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        approvedBy: '2',
        approver: {
          id: '2',
          username: 'lisi',
          name: '李四',
          email: 'lisi@example.com',
          role: 'admin' as const,
          department: '管理部',
          avatar: '',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        approvedAt: '2024-01-15',
        serviceProvider: '中石化加油站',
        location: '北京市朝阳区',
        mileage: 15000,
        attachments: [{
          id: '1',
          name: 'receipt_001.jpg',
          url: '/uploads/receipt_001.jpg',
          type: 'image/jpeg',
          size: 1024000
        }],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        vehicleId: '1',
        vehicle: {
          id: '1',
          plateNumber: '京A12345',
          brand: '丰田',
          model: '凯美瑞',
          year: 2022,
          color: '白色',
          type: 'sedan' as const,
          image: '/images/vehicles/camry.jpg',
          purchaseDate: '2022-01-01',
          lastMaintenanceDate: '2024-01-15',
          nextMaintenanceDate: '2024-07-15',
          currentDriver: null,
          notes: '',
          mileage: 15000,
          fuelType: 'gasoline' as const,
          seats: 5,
          department: '销售部',
          status: 'available' as const,
          createdAt: '2022-01-01',
          updatedAt: '2024-01-15'
        },
        type: 'maintenance' as const,
        amount: 1200.00,
        description: '定期保养',
        date: '2024-01-18',
        receiptDate: '2024-01-18',
        receipt: 'receipt_002.jpg',
        status: 'pending' as const,
        createdBy: '1',
        creator: {
          id: '1',
          username: 'zhangsan',
          name: '张三',
          email: 'zhangsan@example.com',
          role: 'user' as const,
          department: '销售部',
          avatar: '',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        serviceProvider: '4S店维修中心',
        location: '北京市海淀区',
        duration: '2',
        mileage: 15200,
        attachments: [{
          id: '2',
          name: 'receipt_002.jpg',
          url: '/uploads/receipt_002.jpg',
          type: 'image/jpeg',
          size: 2048000
        }, {
          id: '3',
          name: 'maintenance_report.pdf',
          url: '/uploads/maintenance_report.pdf',
          type: 'application/pdf',
          size: 512000
        }],
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18'
      },
      {
        id: '3',
        vehicleId: '1',
        vehicle: {
          id: '1',
          plateNumber: '京A12345',
          brand: '丰田',
          model: '凯美瑞',
          year: 2022,
          color: '白色',
          type: 'sedan' as const,
          image: '/images/vehicles/camry.jpg',
          purchaseDate: '2022-01-01',
          lastMaintenanceDate: '2024-01-15',
          nextMaintenanceDate: '2024-07-15',
          currentDriver: null,
          notes: '',
          mileage: 15000,
          fuelType: 'gasoline' as const,
          seats: 5,
          department: '销售部',
          status: 'available' as const,
          createdAt: '2022-01-01',
          updatedAt: '2024-01-15'
        },
        type: 'parking' as const,
        amount: 50.00,
        description: '停车费',
        date: '2024-01-19',
        receiptDate: '2024-01-19',
        receipt: 'receipt_003.jpg',
        status: 'paid' as const,
        createdBy: '1',
        creator: {
          id: '1',
          username: 'zhangsan',
          name: '张三',
          email: 'zhangsan@example.com',
          role: 'user' as const,
          department: '销售部',
          avatar: '',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        approvedBy: '2',
        approver: {
          id: '2',
          username: 'lisi',
          name: '李四',
          email: 'lisi@example.com',
          role: 'admin' as const,
          department: '管理部',
          avatar: '',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        approvedAt: '2024-01-19',
        paymentDate: '2024-01-22',
        serviceProvider: '万达广场停车场',
        location: '北京市朝阳区',
        duration: '4',
        attachments: [{
          id: '1',
          name: 'receipt_003.jpg',
          url: '/uploads/receipt_003.jpg',
          type: 'image/jpeg',
          size: 1024000
        }],
        createdAt: '2024-01-19',
        updatedAt: '2024-01-22'
      }
    ];
      setExpenses(mockExpenses);
      setFilteredExpenses(mockExpenses);
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      const statsData = await expenseService.getExpenseStats();
      setStats(statsData);
    } catch (error) {
      console.error('加载统计数据失败:', error);
      // 使用模拟数据作为后备
      const mockStats: ExpenseStats = {
        total: 3,
        pending: 1,
        approved: 1,
        rejected: 0,
        paid: 1,
        totalAmount: 1600.00,
        monthlyAmount: 1600.00,
        fuelCost: 350.00,
        maintenanceCost: 1200.00,
        insuranceCost: 0,
        otherCost: 50.00
      };
      setStats(mockStats);
    }
  };

  // 应用筛选
  useEffect(() => {
    let filtered = [...expenses];

    if (filters.status) {
      filtered = filtered.filter(expense => expense.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(expense => expense.type === filters.type);
    }

    if (filters.vehicleId) {
      filtered = filtered.filter(expense => expense.vehicleId === filters.vehicleId);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(searchLower) ||
        expense.vehicle?.plateNumber.toLowerCase().includes(searchLower) ||
        expense.creator?.name.toLowerCase().includes(searchLower) ||
        (expense.serviceProvider && expense.serviceProvider.toLowerCase().includes(searchLower))
      );
    }

    if (filters.dateRange?.start) {
      filtered = filtered.filter(expense => expense.date >= filters.dateRange!.start);
    }

    if (filters.dateRange?.end) {
      filtered = filtered.filter(expense => expense.date <= filters.dateRange!.end);
    }

    if (filters.amountRange?.min && filters.amountRange.min > 0) {
      filtered = filtered.filter(expense => expense.amount >= filters.amountRange!.min);
    }

    if (filters.amountRange?.max && filters.amountRange.max > 0) {
      filtered = filtered.filter(expense => expense.amount <= filters.amountRange!.max);
    }

    setFilteredExpenses(filtered);
    setCurrentPage(1);
  }, [expenses, filters]);

  // 分页
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  // 处理筛选变化
  const handleFiltersChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  };

  // 处理费用操作
  const handleView = (expense: Expense) => {
    console.log('查看费用:', expense);
    // TODO: 实现查看费用详情
  };

  const handleEdit = (expense: Expense) => {
    console.log('编辑费用:', expense);
    // TODO: 实现编辑费用
  };

  const handleDelete = async (expense: Expense) => {
    if (window.confirm('确定要删除这条费用记录吗？')) {
      try {
        await expenseService.deleteExpense(expense.id);
        await loadExpenses(); // 重新加载列表
        await loadStats(); // 重新加载统计
      } catch (error) {
        console.error('删除费用失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleApprove = async (expense: Expense) => {
    try {
      await expenseService.updateExpense(expense.id, {
        ...expense,
        status: 'approved'
      });
      await loadExpenses(); // 重新加载列表
      await loadStats(); // 重新加载统计
    } catch (error) {
      console.error('批准费用失败:', error);
      alert('批准失败，请重试');
    }
  };

  const handleReject = async (expense: Expense) => {
    try {
      await expenseService.updateExpense(expense.id, {
        ...expense,
        status: 'rejected'
      });
      await loadExpenses(); // 重新加载列表
      await loadStats(); // 重新加载统计
    } catch (error) {
      console.error('拒绝费用失败:', error);
      alert('拒绝失败，请重试');
    }
  };

  const handlePay = async (expense: Expense) => {
    try {
      await expenseService.updateExpense(expense.id, {
        ...expense,
        status: 'paid'
      });
      await loadExpenses(); // 重新加载列表
      await loadStats(); // 重新加载统计
    } catch (error) {
      console.error('支付费用失败:', error);
      alert('支付失败，请重试');
    }
  };

  const handleAddExpense = () => {
    console.log('新增费用');
    // TODO: 实现新增费用
  };

  const handleExport = async () => {
    try {
      const startDate = filters.dateRange?.start;
      const endDate = filters.dateRange?.end;
      const reportData = await expenseService.getExpenseReportSummary(startDate, endDate);
      console.log('导出报表数据:', reportData);
      // TODO: 实现实际的导出功能（如生成Excel文件）
    } catch (error) {
      console.error('导出报表失败:', error);
      alert('导出失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-400">加载中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">费用管理</h1>
          <p className="text-gray-400 mt-1">管理车辆相关费用和报销申请</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddExpense}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>新增费用</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-download"></i>
            <span>导出报表</span>
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <ExpenseStatsComponent stats={stats} />

      {/* 筛选器 */}
      <ExpenseFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={() => setFilters({
          status: undefined,
          type: undefined,
          vehicleId: undefined,
          createdBy: undefined,
          serviceProvider: undefined,
          dateRange: {
            start: '',
            end: ''
          },
          amountRange: {
            min: 0,
            max: 0
          },
          search: ''
        })}
      />

      {/* 费用列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            费用记录 ({filteredExpenses.length})
          </h2>
          <div className="text-sm text-gray-400">
            显示 {startIndex + 1}-{Math.min(endIndex, filteredExpenses.length)} 条，共 {filteredExpenses.length} 条
          </div>
        </div>

        {currentExpenses.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-receipt text-4xl text-gray-600 mb-4"></i>
            <p className="text-gray-400 text-lg mb-2">暂无费用记录</p>
            <p className="text-gray-500 text-sm">请调整筛选条件或添加新的费用记录</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onReject={handleReject}
                onPay={handlePay}
              />
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensePage;
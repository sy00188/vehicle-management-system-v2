import 'package:flutter/foundation.dart';
import '../models/expense.dart';
import '../services/expense_service.dart';
import '../models/api_response.dart';

class ExpenseProvider with ChangeNotifier {
  final ExpenseService _expenseService = ExpenseService();

  // 费用列表
  List<ExpenseRecord> _expenses = [];
  List<ExpenseRecord> get expenses => _expenses;

  // 加载状态
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  // 错误信息
  String? _error;
  String? get error => _error;
  bool get hasError => _error != null;
  String get errorMessage => _error ?? '';

  // 分页信息
  int _currentPage = 1;
  int _totalPages = 1;
  int _totalCount = 0;
  bool _hasNextPage = false;
  bool _hasPreviousPage = false;

  int get currentPage => _currentPage;
  int get totalPages => _totalPages;
  int get totalCount => _totalCount;
  bool get hasNextPage => _hasNextPage;
  bool get hasPreviousPage => _hasPreviousPage;

  // 筛选条件
  ExpenseType? _filterType;
  ExpenseStatus? _filterStatus;
  String? _searchQuery;
  DateTime? _startDate;
  DateTime? _endDate;

  ExpenseType? get filterType => _filterType;
  ExpenseStatus? get filterStatus => _filterStatus;
  String? get searchQuery => _searchQuery;
  DateTime? get startDate => _startDate;
  DateTime? get endDate => _endDate;

  // 选中的费用详情
  ExpenseRecord? _selectedExpense;
  ExpenseRecord? get selectedExpense => _selectedExpense;

  /// 加载费用列表
  Future<void> loadExpenses({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
    }

    _setLoading(true);
    _setError(null);

    try {
      final response = await _expenseService.getExpenses(
        page: _currentPage,
        limit: 20,
        type: _filterType,
        status: _filterStatus,
        search: _searchQuery,
        startDate: _startDate,
        endDate: _endDate,
      );

      if (response.success && response.data != null) {
        if (refresh || _currentPage == 1) {
          _expenses = response.data!;
        } else {
          _expenses.addAll(response.data!);
        }

        // 更新分页信息
        if (response is PaginatedApiResponse<ExpenseRecord>) {
          _currentPage = response.currentPage;
          _totalPages = response.totalPages;
          _totalCount = response.totalCount;
          _hasNextPage = response.hasNextPage;
          _hasPreviousPage = response.hasPreviousPage;
        }
      } else {
        _setError(response.message ?? '加载费用列表失败');
      }
    } catch (e) {
      _setError('网络错误: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// 加载更多费用
  Future<void> loadMoreExpenses() async {
    if (_isLoading || !_hasNextPage) return;

    _currentPage++;
    await loadExpenses();
  }

  /// 刷新费用列表
  Future<void> refreshExpenses() async {
    await loadExpenses(refresh: true);
  }

  /// 设置筛选条件
  void setFilter({
    ExpenseType? type,
    ExpenseStatus? status,
    String? search,
    DateTime? startDate,
    DateTime? endDate,
  }) {
    _filterType = type;
    _filterStatus = status;
    _searchQuery = search;
    _startDate = startDate;
    _endDate = endDate;
    notifyListeners();
  }

  /// 清除筛选条件
  void clearFilters() {
    _filterType = null;
    _filterStatus = null;
    _searchQuery = null;
    _startDate = null;
    _endDate = null;
    notifyListeners();
  }

  /// 应用筛选条件并重新加载
  Future<void> applyFilters() async {
    await loadExpenses(refresh: true);
  }

  /// 获取费用详情
  Future<void> getExpenseDetails(String expenseId) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _expenseService.getExpenseById(expenseId);
      if (response.success && response.data != null) {
        _selectedExpense = response.data;
      } else {
        _setError(response.message ?? '获取费用详情失败');
      }
    } catch (e) {
      _setError('网络错误: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// 创建费用记录
  Future<bool> createExpense(ExpenseRecord expense) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _expenseService.createExpense(expense);
      if (response.success) {
        await refreshExpenses();
        return true;
      } else {
        _setError(response.message ?? '创建费用记录失败');
        return false;
      }
    } catch (e) {
      _setError('网络错误: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 更新费用记录
  Future<bool> updateExpense(String expenseId, ExpenseRecord expense) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _expenseService.updateExpense(expenseId, expense);
      if (response.success) {
        await refreshExpenses();
        if (_selectedExpense?.id == expenseId) {
          _selectedExpense = response.data;
        }
        return true;
      } else {
        _setError(response.message ?? '更新费用记录失败');
        return false;
      }
    } catch (e) {
      _setError('网络错误: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 删除费用记录
  Future<bool> deleteExpense(String expenseId) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _expenseService.deleteExpense(expenseId);
      if (response.success) {
        _expenses.removeWhere((expense) => expense.id == expenseId);
        if (_selectedExpense?.id == expenseId) {
          _selectedExpense = null;
        }
        notifyListeners();
        return true;
      } else {
        _setError(response.message ?? '删除费用记录失败');
        return false;
      }
    } catch (e) {
      _setError('网络错误: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 审批费用记录
  Future<bool> approveExpense(String expenseId, String? remarks) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _expenseService.approveExpense(expenseId, remarks);
      if (response.success) {
        await refreshExpenses();
        if (_selectedExpense?.id == expenseId) {
          await getExpenseDetails(expenseId);
        }
        return true;
      } else {
        _setError(response.message ?? '审批费用记录失败');
        return false;
      }
    } catch (e) {
      _setError('网络错误: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 拒绝费用记录
  Future<bool> rejectExpense(String expenseId, String? remarks) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _expenseService.rejectExpense(expenseId, remarks);
      if (response.success) {
        await refreshExpenses();
        if (_selectedExpense?.id == expenseId) {
          await getExpenseDetails(expenseId);
        }
        return true;
      } else {
        _setError(response.message ?? '拒绝费用记录失败');
        return false;
      }
    } catch (e) {
      _setError('网络错误: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 设置加载状态
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// 设置错误信息
  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  /// 清除选中的费用
  void clearSelectedExpense() {
    _selectedExpense = null;
    notifyListeners();
  }

  /// 清除错误信息
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
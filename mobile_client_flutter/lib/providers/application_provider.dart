import 'package:flutter/foundation.dart';
import '../models/application.dart';
import '../services/application_service.dart';
import '../models/api_response.dart';

/// 车辆申请状态管理Provider
/// 管理申请列表、详情、创建、审批等状态
class ApplicationProvider with ChangeNotifier {
  final ApplicationService _applicationService = ApplicationService();

  // 申请列表相关状态
  List<VehicleApplication> _applications = [];
  bool _isLoading = false;
  bool _hasError = false;
  String _errorMessage = '';
  
  // 分页相关状态
  int _currentPage = 1;
  int _totalPages = 1;
  int _totalCount = 0;
  bool _hasNextPage = false;
  bool _hasPreviousPage = false;
  
  // 筛选相关状态
  ApplicationStatus? _statusFilter;
  ApplicationStatus? get statusFilter => _statusFilter;

  ApplicationType? _typeFilter;
  ApplicationType? get typeFilter => _typeFilter;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  DateTime? _startDateFilter;
  DateTime? get startDateFilter => _startDateFilter;

  DateTime? _endDateFilter;
  DateTime? get endDateFilter => _endDateFilter;
  
  // 当前选中的申请
  VehicleApplication? _selectedApplication;
  bool _isLoadingDetail = false;
  
  // 我的申请列表
  List<VehicleApplication> _myApplications = [];
  bool _isLoadingMyApplications = false;
  
  // 待审批申请列表
  List<VehicleApplication> _pendingApplications = [];
  bool _isLoadingPendingApplications = false;

  // Getters
  List<VehicleApplication> get applications => _applications;
  bool get isLoading => _isLoading;
  bool get hasError => _hasError;
  String get errorMessage => _errorMessage;
  
  int get currentPage => _currentPage;
  int get totalPages => _totalPages;
  int get totalCount => _totalCount;
  bool get hasNextPage => _hasNextPage;
  bool get hasPreviousPage => _hasPreviousPage;
  

  
  VehicleApplication? get selectedApplication => _selectedApplication;
  bool get isLoadingDetail => _isLoadingDetail;
  
  List<VehicleApplication> get myApplications => _myApplications;
  bool get isLoadingMyApplications => _isLoadingMyApplications;
  
  List<VehicleApplication> get pendingApplications => _pendingApplications;
  bool get isLoadingPendingApplications => _isLoadingPendingApplications;

  /// 获取申请列表
  Future<void> fetchApplications({
    int page = 1,
    int limit = 20,
    String? status,
    String? type,
    String? search,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    if (page == 1) {
      _isLoading = true;
      notifyListeners();
    }

    try {
      final response = await _applicationService.getApplications(
        page: page,
        pageSize: limit,
        status: status,
        type: type,
        startDate: startDate,
        endDate: endDate,
      );

      if (response.success && response.data != null) {
        if (page == 1) {
          _applications = response.data!;
          _currentPage = 1;
        } else {
          _applications.addAll(response.data!);
          _currentPage = page;
        }
        
        _totalPages = response.totalPages ?? 1;
        _totalCount = response.totalCount ?? 0;
        _hasNextPage = page < _totalPages;
        _hasPreviousPage = page > 1;
        

        _hasError = false;
        _errorMessage = '';
      } else {
        _hasError = true;
        _errorMessage = response.message ?? '获取申请列表失败';
      }
    } catch (e) {
      _hasError = true;
      _errorMessage = '网络错误：${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// 获取我的申请列表
  Future<void> fetchMyApplications() async {
    _isLoadingMyApplications = true;
    _clearError();
    notifyListeners();

    try {
      final response = await _applicationService.getMyApplications();
      
      if (response.success && response.data != null) {
        _myApplications = response.data!;
      } else {
        _setError(response.message);
      }
    } catch (e) {
      _setError('获取我的申请失败: $e');
    } finally {
      _isLoadingMyApplications = false;
      notifyListeners();
    }
  }

  /// 获取待审批申请列表
  Future<void> fetchPendingApplications() async {
    _isLoadingPendingApplications = true;
    _clearError();
    notifyListeners();

    try {
      final response = await _applicationService.getPendingApplications();
      
      if (response.success && response.data != null) {
        _pendingApplications = response.data!;
      } else {
        _setError(response.message);
      }
    } catch (e) {
      _setError('获取待审批申请失败: $e');
    } finally {
      _isLoadingPendingApplications = false;
      notifyListeners();
    }
  }

  /// 筛选申请
  /// [status] 申请状态
  /// [type] 申请类型
  /// [startDate] 开始日期
  /// [endDate] 结束日期
  Future<void> filterApplications({
    ApplicationStatus? status,
    ApplicationType? type,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    if (status != null) _statusFilter = status;
    if (type != null) _typeFilter = type;
    if (startDate != null) _startDateFilter = startDate;
    if (endDate != null) _endDateFilter = endDate;
    
    await fetchApplications(
      page: 1,
      status: _statusFilter?.name,
      type: _typeFilter?.name,
      search: _searchQuery.isNotEmpty ? _searchQuery : null,
      startDate: _startDateFilter,
      endDate: _endDateFilter,
    );
  }

  /// 清除筛选条件
  Future<void> clearFilters() async {
    _statusFilter = null;
    _typeFilter = null;
    _searchQuery = '';
    _startDateFilter = null;
    _endDateFilter = null;
    
    await fetchApplications(page: 1);
  }

  /// 获取申请详情
  /// [applicationId] 申请ID
  Future<void> fetchApplicationDetail(String applicationId) async {
    _isLoadingDetail = true;
    _clearError();
    notifyListeners();

    try {
      final response = await _applicationService.getApplicationById(applicationId);
      
      if (response.success && response.data != null) {
        _selectedApplication = response.data;
      } else {
        _setError(response.message);
      }
    } catch (e) {
      _setError('获取申请详情失败: $e');
    } finally {
      _isLoadingDetail = false;
      notifyListeners();
    }
  }

  /// 创建申请
  /// [applicationData] 申请数据
  Future<bool> createApplication(Map<String, dynamic> applicationData) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _applicationService.createApplication(applicationData);
      
      if (response.success && response.data != null) {
        // 添加到我的申请列表开头
        _myApplications.insert(0, response.data!);
        // 添加到总申请列表开头
        _applications.insert(0, response.data!);
        _totalCount++;
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('创建申请失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 更新申请
  /// [applicationId] 申请ID
  /// [applicationData] 申请数据
  Future<bool> updateApplication(String applicationId, Map<String, dynamic> applicationData) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _applicationService.updateApplication(applicationId, applicationData);
      
      if (response.success && response.data != null) {
        // 更新各个列表中的申请
        _updateApplicationInLists(applicationId, response.data!);
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('更新申请失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 取消申请
  /// [applicationId] 申请ID
  /// [reason] 取消原因
  Future<bool> cancelApplication(String applicationId, String reason) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _applicationService.cancelApplication(applicationId, reason);
      
      if (response.success && response.data != null) {
        _updateApplicationInLists(applicationId, response.data!);
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('取消申请失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 审批申请
  /// [applicationId] 申请ID
  /// [approved] 是否通过
  /// [comment] 审批意见
  Future<bool> approveApplication(String applicationId, bool approved, String comment) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _applicationService.approveApplication(
        applicationId,
        approved,
        comment,
      );
      
      if (response.success && response.data != null) {
        _updateApplicationInLists(applicationId, response.data!);
        
        // 从待审批列表中移除
        _pendingApplications.removeWhere((app) => app.id == applicationId);
        
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('审批申请失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 删除申请
  /// [applicationId] 申请ID
  Future<bool> deleteApplication(String applicationId) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _applicationService.deleteApplication(applicationId);
      
      if (response.success) {
        // 从所有列表中移除
        _applications.removeWhere((app) => app.id == applicationId);
        _myApplications.removeWhere((app) => app.id == applicationId);
        _pendingApplications.removeWhere((app) => app.id == applicationId);
        _totalCount--;
        
        // 清除选中的申请
        if (_selectedApplication?.id == applicationId) {
          _selectedApplication = null;
        }
        
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('删除申请失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 加载更多申请（分页）
  Future<void> loadMoreApplications() async {
    if (_hasNextPage && !_isLoading) {
      await fetchApplications(page: _currentPage + 1);
    }
  }

  /// 刷新申请列表
  Future<void> refreshApplications() async {
    await fetchApplications(page: 1);
  }

  /// 刷新我的申请
  Future<void> refreshMyApplications() async {
    await fetchMyApplications();
  }

  /// 刷新待审批申请
  Future<void> refreshPendingApplications() async {
    await fetchPendingApplications();
  }

  /// 清除选中的申请
  void clearSelectedApplication() {
    _selectedApplication = null;
    notifyListeners();
  }

  /// 根据ID获取申请
  VehicleApplication? getApplicationById(String applicationId) {
    try {
      return _applications.firstWhere((app) => app.id == applicationId);
    } catch (e) {
      return null;
    }
  }

  /// 获取申请统计信息
  Map<String, int> getApplicationStatistics() {
    final stats = <String, int>{
      'total': _applications.length,
      'pending': 0,
      'approved': 0,
      'rejected': 0,
      'cancelled': 0,
    };

    for (final app in _applications) {
      switch (app.status.name.toLowerCase()) {
        case 'pending':
          stats['pending'] = (stats['pending'] ?? 0) + 1;
          break;
        case 'approved':
          stats['approved'] = (stats['approved'] ?? 0) + 1;
          break;
        case 'rejected':
          stats['rejected'] = (stats['rejected'] ?? 0) + 1;
          break;
        case 'cancelled':
          stats['cancelled'] = (stats['cancelled'] ?? 0) + 1;
          break;
      }
    }

    return stats;
  }

  /// 更新各个列表中的申请
  void _updateApplicationInLists(String applicationId, VehicleApplication updatedApplication) {
    // 更新总申请列表
    final index = _applications.indexWhere((app) => app.id == applicationId);
    if (index != -1) {
      _applications[index] = updatedApplication;
    }
    
    // 更新我的申请列表
    final myIndex = _myApplications.indexWhere((app) => app.id == applicationId);
    if (myIndex != -1) {
      _myApplications[myIndex] = updatedApplication;
    }
    
    // 更新待审批申请列表
    final pendingIndex = _pendingApplications.indexWhere((app) => app.id == applicationId);
    if (pendingIndex != -1) {
      _pendingApplications[pendingIndex] = updatedApplication;
    }
    
    // 更新选中的申请
    if (_selectedApplication?.id == applicationId) {
      _selectedApplication = updatedApplication;
    }
  }

  /// 设置加载状态
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// 设置错误状态
  void _setError(String message) {
    _hasError = true;
    _errorMessage = message;
    notifyListeners();
  }

  /// 清除错误状态
  void _clearError() {
    _hasError = false;
    _errorMessage = '';
  }

  /// 重置所有状态
  void reset() {
    _applications.clear();
    _myApplications.clear();
    _pendingApplications.clear();
    _selectedApplication = null;
    _isLoading = false;
    _isLoadingDetail = false;
    _isLoadingMyApplications = false;
    _isLoadingPendingApplications = false;
    _hasError = false;
    _errorMessage = '';
    _currentPage = 1;
    _totalPages = 1;
    _totalCount = 0;
    _hasNextPage = false;
    _hasPreviousPage = false;
    _statusFilter = null;
    _typeFilter = null;
    _searchQuery = '';
    _startDateFilter = null;
    _endDateFilter = null;
    notifyListeners();
  }
}
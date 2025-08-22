import 'package:flutter/foundation.dart';
import '../models/vehicle.dart';
import '../models/api_response.dart';
import '../services/vehicle_service.dart';

/// 车辆状态管理Provider
/// 管理车辆列表、详情、搜索、筛选等状态
class VehicleProvider with ChangeNotifier {
  final VehicleService _vehicleService = VehicleService();

  // 车辆列表相关状态
  List<Vehicle> _vehicles = [];
  bool _isLoading = false;
  bool _hasError = false;
  String _errorMessage = '';
  
  // 分页相关状态
  int _currentPage = 1;
  int _totalPages = 1;
  int _totalCount = 0;
  bool _hasNextPage = false;
  bool _hasPreviousPage = false;
  
  // 搜索和筛选状态
  String _searchKeyword = '';
  String _selectedStatus = '';
  String _selectedType = '';
  String _selectedDepartment = '';
  
  // 当前选中的车辆
  Vehicle? _selectedVehicle;
  bool _isLoadingDetail = false;

  // Getters
  List<Vehicle> get vehicles => _vehicles;
  bool get isLoading => _isLoading;
  bool get hasError => _hasError;
  String get errorMessage => _errorMessage;
  
  int get currentPage => _currentPage;
  int get totalPages => _totalPages;
  int get totalCount => _totalCount;
  bool get hasNextPage => _hasNextPage;
  bool get hasPreviousPage => _hasPreviousPage;
  
  String get searchKeyword => _searchKeyword;
  String get selectedStatus => _selectedStatus;
  String get selectedType => _selectedType;
  String get selectedDepartment => _selectedDepartment;
  
  Vehicle? get selectedVehicle => _selectedVehicle;
  bool get isLoadingDetail => _isLoadingDetail;

  /// 获取车辆列表
  /// [page] 页码
  /// [pageSize] 每页数量
  /// [refresh] 是否刷新（清空现有数据）
  Future<void> fetchVehicles({
    int page = 1,
    int pageSize = 10,
    bool refresh = false,
  }) async {
    if (refresh) {
      _vehicles.clear();
      _currentPage = 1;
    }
    
    _setLoading(true);
    _clearError();

    try {
      final response = await _vehicleService.getVehicles(
        page: page,
        pageSize: pageSize,
        keyword: _searchKeyword,
        status: _selectedStatus,
        type: _selectedType,
        department: _selectedDepartment,
      );

      if (response.success && response.data != null) {
        if (refresh || page == 1) {
          _vehicles = response.data!;
        } else {
          _vehicles.addAll(response.data!);
        }
        
        // 更新分页信息
        _currentPage = response.currentPage;
        _totalPages = response.totalPages;
        _totalCount = response.totalCount;
        _hasNextPage = response.hasNextPage;
        _hasPreviousPage = response.hasPreviousPage;
      } else {
        _setError(response.message);
      }
    } catch (e) {
      _setError('获取车辆列表失败: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// 搜索车辆
  /// [keyword] 搜索关键词
  Future<void> searchVehicles(String keyword) async {
    _searchKeyword = keyword;
    await fetchVehicles(refresh: true);
  }

  /// 筛选车辆
  /// [status] 车辆状态
  /// [type] 车辆类型
  /// [department] 所属部门
  Future<void> filterVehicles({
    String? status,
    String? type,
    String? department,
  }) async {
    if (status != null) _selectedStatus = status;
    if (type != null) _selectedType = type;
    if (department != null) _selectedDepartment = department;
    
    await fetchVehicles(refresh: true);
  }

  /// 清除筛选条件
  Future<void> clearFilters() async {
    _searchKeyword = '';
    _selectedStatus = '';
    _selectedType = '';
    _selectedDepartment = '';
    
    await fetchVehicles(refresh: true);
  }

  /// 获取车辆详情
  /// [vehicleId] 车辆ID
  Future<void> fetchVehicleDetail(String vehicleId) async {
    _isLoadingDetail = true;
    _clearError();
    notifyListeners();

    try {
      final response = await _vehicleService.getVehicleById(vehicleId);
      
      if (response.success && response.data != null) {
        _selectedVehicle = response.data;
      } else {
        _setError(response.message);
      }
    } catch (e) {
      _setError('获取车辆详情失败: $e');
    } finally {
      _isLoadingDetail = false;
      notifyListeners();
    }
  }

  /// 创建车辆
  /// [vehicleData] 车辆数据
  Future<bool> createVehicle(Map<String, dynamic> vehicleData) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _vehicleService.createVehicle(vehicleData);
      
      if (response.success && response.data != null) {
        // 添加到列表开头
        _vehicles.insert(0, response.data!);
        _totalCount++;
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('创建车辆失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 更新车辆
  /// [vehicleId] 车辆ID
  /// [vehicleData] 车辆数据
  Future<bool> updateVehicle(String vehicleId, Map<String, dynamic> vehicleData) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _vehicleService.updateVehicle(vehicleId, vehicleData);
      
      if (response.success && response.data != null) {
        // 更新列表中的车辆
        final index = _vehicles.indexWhere((v) => v.id == vehicleId);
        if (index != -1) {
          _vehicles[index] = response.data!;
        }
        
        // 更新选中的车辆
        if (_selectedVehicle?.id == vehicleId) {
          _selectedVehicle = response.data;
        }
        
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('更新车辆失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 删除车辆
  /// [vehicleId] 车辆ID
  Future<bool> deleteVehicle(String vehicleId) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _vehicleService.deleteVehicle(vehicleId);
      
      if (response.success) {
        // 从列表中移除
        _vehicles.removeWhere((v) => v.id == vehicleId);
        _totalCount--;
        
        // 清除选中的车辆
        if (_selectedVehicle?.id == vehicleId) {
          _selectedVehicle = null;
        }
        
        notifyListeners();
        return true;
      } else {
        _setError(response.message);
        return false;
      }
    } catch (e) {
      _setError('删除车辆失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// 加载更多车辆（分页）
  Future<void> loadMoreVehicles() async {
    if (_hasNextPage && !_isLoading) {
      await fetchVehicles(page: _currentPage + 1);
    }
  }

  /// 刷新车辆列表
  Future<void> refreshVehicles() async {
    await fetchVehicles(refresh: true);
  }

  /// 清除选中的车辆
  void clearSelectedVehicle() {
    _selectedVehicle = null;
    notifyListeners();
  }

  /// 根据ID获取车辆
  Vehicle? getVehicleById(String vehicleId) {
    try {
      return _vehicles.firstWhere((v) => v.id == vehicleId);
    } catch (e) {
      return null;
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
    _vehicles.clear();
    _selectedVehicle = null;
    _isLoading = false;
    _isLoadingDetail = false;
    _hasError = false;
    _errorMessage = '';
    _currentPage = 1;
    _totalPages = 1;
    _totalCount = 0;
    _hasNextPage = false;
    _hasPreviousPage = false;
    _searchKeyword = '';
    _selectedStatus = '';
    _selectedType = '';
    _selectedDepartment = '';
    notifyListeners();
  }
}
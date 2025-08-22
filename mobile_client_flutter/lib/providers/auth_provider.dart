import 'package:flutter/foundation.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../utils/storage_helper.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  final StorageHelper _storageHelper = StorageHelper();
  
  User? _currentUser;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _errorMessage;
  
  // Getters
  User? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  
  AuthProvider() {
    _initializeAuth();
  }
  
  /// 初始化认证状态
  Future<void> _initializeAuth() async {
    try {
      _setLoading(true);
      
      // 检查本地存储的token
      final token = await _storageHelper.getAuthToken();
      if (token != null && !JwtDecoder.isExpired(token)) {
        // Token有效，获取用户信息
        final userData = await _storageHelper.getUserData();
        if (userData != null) {
          _currentUser = User.fromJson(userData);
          _isAuthenticated = true;
        } else {
          // 如果没有用户数据，尝试从服务器获取
          await _fetchUserProfile();
        }
      } else {
        // Token无效或过期，清除本地数据
        await logout();
      }
    } catch (e) {
      debugPrint('初始化认证状态失败: $e');
      await logout();
    } finally {
      _setLoading(false);
    }
  }
  
  /// 用户登录
  Future<bool> login(String email, String password) async {
    try {
      _setLoading(true);
      _clearError();
      
      final response = await _authService.login(email, password);
      
      if (response.success) {
        if (response.data != null) {
          await _storageHelper.saveUserData(response.data!.toJson());
          _currentUser = response.data;
          _isAuthenticated = true;
          notifyListeners();
        }
        return true;
      } else {
        _setError(response.message ?? '登录失败');
        return false;
      }
    } catch (e) {
      _setError('登录失败: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  /// 用户注册
  Future<bool> register({
    required String username,
    required String email,
    required String password,
    required String confirmPassword,
    String? phone,
    String? department,
  }) async {
    try {
      _setLoading(true);
      _clearError();
      
      if (password != confirmPassword) {
        _setError('密码确认不匹配');
        return false;
      }
      
      // 构建注册数据Map
      final registerData = {
        'username': username,
        'email': email,
        'password': password,
        if (phone != null) 'phone': phone,
        if (department != null) 'department': department,
      };
      
      final response = await _authService.register(registerData);
      
      if (response.success) {
        // 注册成功后自动登录
        return await login(email, password);
      } else {
        _setError(response.message ?? '注册失败');
        return false;
      }
    } catch (e) {
      _setError('注册失败: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  /// 用户登出
  Future<void> logout() async {
    try {
      _setLoading(true);
      
      // 清除本地存储
      await _storageHelper.clearAuthData();
      
      // 重置状态
      _currentUser = null;
      _isAuthenticated = false;
      _clearError();
      
      notifyListeners();
    } catch (e) {
      debugPrint('登出失败: $e');
    } finally {
      _setLoading(false);
    }
  }
  
  /// 获取用户资料
  Future<void> _fetchUserProfile() async {
    try {
      final response = await _authService.getCurrentUser();
      
      if (response.success && response.data != null) {
        await _storageHelper.saveUserData(response.data!.toJson());
        _currentUser = response.data;
        _isAuthenticated = true;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('获取用户资料失败: $e');
    }
  }
  
  /// 更新用户资料
  Future<bool> updateProfile({
    String? username,
    String? email,
    String? phone,
    String? department,
    String? avatar,
  }) async {
    try {
      _setLoading(true);
      _clearError();
      
      // 构建更新数据Map
      final updateData = <String, dynamic>{};
      if (username != null) updateData['username'] = username;
      if (email != null) updateData['email'] = email;
      if (phone != null) updateData['phone'] = phone;
      if (department != null) updateData['department'] = department;
      if (avatar != null) updateData['avatar'] = avatar;
      
      final response = await _authService.updateProfile(updateData);
      
      if (response.success) {
        if (response.data != null) {
          await _storageHelper.saveUserData(response.data!.toJson());
          _currentUser = response.data;
          notifyListeners();
        }
        return true;
      } else {
        _setError(response.message ?? '更新失败');
        return false;
      }
    } catch (e) {
      _setError('更新失败: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  /// 修改密码
  Future<bool> changePassword({
    required String currentPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    try {
      _setLoading(true);
      _clearError();
      
      if (newPassword != confirmPassword) {
        _setError('新密码确认不匹配');
        return false;
      }
      
      final response = await _authService.changePassword(
        currentPassword,
        newPassword,
      );
      
      if (response.success) {
        return true;
      } else {
        _setError(response.message ?? '密码修改失败');
        return false;
      }
    } catch (e) {
      _setError('密码修改失败: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  /// 忘记密码
  Future<bool> forgotPassword(String email) async {
    try {
      _setLoading(true);
      _clearError();
      
      final response = await _authService.forgotPassword(email);
      
      if (response.success) {
        return true;
      } else {
        _setError(response.message ?? '发送重置邮件失败');
        return false;
      }
    } catch (e) {
      _setError('发送重置邮件失败: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  /// 检查认证状态
  Future<bool> checkAuthStatus() async {
    try {
      final token = await _storageHelper.getAuthToken();
      if (token == null || JwtDecoder.isExpired(token)) {
        await logout();
        return false;
      }
      
      // 如果token有效但没有用户信息，尝试获取
      if (_currentUser == null) {
        await _fetchUserProfile();
      }
      
      return _isAuthenticated;
    } catch (e) {
      debugPrint('检查认证状态失败: $e');
      await logout();
      return false;
    }
  }
  
  /// 刷新token
  Future<bool> refreshToken() async {
    try {
      final response = await _authService.refreshToken();
      
      if (response.success) {
        return true;
      }
      
      return false;
    } catch (e) {
      debugPrint('刷新token失败: $e');
      return false;
    }
  }
  
  // 私有方法
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }
  
  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
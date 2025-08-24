import 'package:dio/dio.dart';
import '../models/user.dart';
import '../models/api_response.dart';
import '../constants/app_constants.dart';
import '../utils/storage_helper.dart';

/// 认证服务类
/// 处理用户登录、注册、登出等认证相关的API请求
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  late final Dio _dio;
  final StorageHelper _storageHelper = StorageHelper();

  /// 初始化服务
  void initialize() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: AppConstants.connectTimeout,
      receiveTimeout: AppConstants.receiveTimeout,
      sendTimeout: AppConstants.sendTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // 添加请求拦截器
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // 自动添加认证头
        final token = await _storageHelper.getAuthToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) {
        // 处理401错误，自动刷新token
        if (error.response?.statusCode == 401) {
          _handleUnauthorized();
        }
        handler.next(error);
      },
    ));
  }

  /// 用户登录
  /// [username] 用户名或邮箱
  /// [password] 密码
  /// 返回包含用户信息的API响应
  Future<ApiResponse<User>> login(String username, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': username,  // 后端期望email字段
        'password': password,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final user = User.fromJson(data['data']['user']);
          final token = data['data']['token'] as String;
          final refreshToken = data['data']['refreshToken'] as String;

          // 保存认证信息
          await _storageHelper.saveAuthToken(token);
          await _storageHelper.saveRefreshToken(refreshToken);
          await _storageHelper.saveUserData(user.toJson());

          return ApiResponse<User>(
            success: true,
            data: user,
            message: data['message'] ?? AppConstants.loginSuccess,
          );
        } else {
          return ApiResponse<User>(
            success: false,
            message: data['message'] ?? '登录失败',
          );
        }
      } else {
        return ApiResponse<User>(
          success: false,
          message: '登录请求失败',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<User>(
        success: false,
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<User>(
        success: false,
        message: '登录过程中发生未知错误',
      );
    }
  }

  /// 用户注册
  /// [userData] 注册用户数据
  /// 返回包含用户信息的API响应
  Future<ApiResponse<User>> register(Map<String, dynamic> userData) async {
    try {
      final response = await _dio.post('/auth/register', data: userData);

      if (response.statusCode == 201) {
        final data = response.data;
        if (data['success'] == true) {
          final user = User.fromJson(data['data']['user']);
          final token = data['data']['token'] as String;
          final refreshToken = data['data']['refreshToken'] as String;

          // 保存认证信息
          await _storageHelper.saveAuthToken(token);
          await _storageHelper.saveRefreshToken(refreshToken);
          await _storageHelper.saveUserData(user.toJson());

          return ApiResponse<User>(
            success: true,
            data: user,
            message: data['message'] ?? '注册成功',
          );
        } else {
          return ApiResponse<User>(
            success: false,
            message: data['message'] ?? '注册失败',
          );
        }
      } else {
        return ApiResponse<User>(
          success: false,
          message: '注册请求失败',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<User>(
        success: false,
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<User>(
        success: false,
        message: '注册过程中发生未知错误',
      );
    }
  }

  /// 用户登出
  /// 返回API响应
  Future<ApiResponse<void>> logout() async {
    try {
      final response = await _dio.post('/auth/logout');

      // 无论服务器响应如何，都清除本地认证数据
      await _storageHelper.clearAuthData();

      if (response.statusCode == 200) {
        final data = response.data;
        return ApiResponse<void>(
          success: true,
          message: data['message'] ?? AppConstants.logoutSuccess,
        );
      } else {
        return ApiResponse<void>(
          success: true, // 本地清除成功即可
          message: AppConstants.logoutSuccess,
        );
      }
    } on DioException catch (e) {
      // 即使网络请求失败，也清除本地数据
      await _storageHelper.clearAuthData();
      return ApiResponse<void>(
        success: true,
        message: AppConstants.logoutSuccess,
      );
    } catch (e) {
      await _storageHelper.clearAuthData();
      return ApiResponse<void>(
        success: true,
        message: AppConstants.logoutSuccess,
      );
    }
  }

  /// 刷新访问令牌
  /// 返回包含新用户信息的API响应
  Future<ApiResponse<User>> refreshToken() async {
    try {
      final refreshToken = await _storageHelper.getRefreshToken();
      if (refreshToken == null) {
        return ApiResponse<User>(
          success: false,
          message: '刷新令牌不存在',
        );
      }

      final response = await _dio.post('/auth/refresh', data: {
        'refreshToken': refreshToken,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final user = User.fromJson(data['data']['user']);
          final newToken = data['data']['token'] as String;
          final newRefreshToken = data['data']['refreshToken'] as String;

          // 保存新的认证信息
          await _storageHelper.saveAuthToken(newToken);
          await _storageHelper.saveRefreshToken(newRefreshToken);
          await _storageHelper.saveUserData(user.toJson());

          return ApiResponse<User>(
            success: true,
            data: user,
            message: '令牌刷新成功',
          );
        } else {
          return ApiResponse<User>(
            success: false,
            message: data['message'] ?? '令牌刷新失败',
          );
        }
      } else {
        return ApiResponse<User>(
          success: false,
          message: '令牌刷新请求失败',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<User>(
        success: false,
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<User>(
        success: false,
        message: '令牌刷新过程中发生未知错误',
      );
    }
  }

  /// 获取当前用户信息
  /// 返回包含用户信息的API响应
  Future<ApiResponse<User>> getCurrentUser() async {
    try {
      final response = await _dio.get('/auth/me');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final user = User.fromJson(data['data']);
          
          // 更新本地用户数据
          await _storageHelper.saveUserData(user.toJson());

          return ApiResponse<User>(
            success: true,
            data: user,
            message: '获取用户信息成功',
          );
        } else {
          return ApiResponse<User>(
            success: false,
            message: data['message'] ?? '获取用户信息失败',
          );
        }
      } else {
        return ApiResponse<User>(
          success: false,
          message: '获取用户信息请求失败',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<User>(
        success: false,
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<User>(
        success: false,
        message: '获取用户信息过程中发生未知错误',
      );
    }
  }

  /// 修改密码
  /// [currentPassword] 当前密码
  /// [newPassword] 新密码
  /// 返回API响应
  Future<ApiResponse<void>> changePassword(String currentPassword, String newPassword) async {
    try {
      final response = await _dio.put('/auth/change-password', data: {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        return ApiResponse<void>(
          success: data['success'] ?? false,
          message: data['message'] ?? '密码修改完成',
        );
      } else {
        return ApiResponse<void>(
          success: false,
          message: '密码修改请求失败',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<void>(
        success: false,
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<void>(
        success: false,
        message: '密码修改过程中发生未知错误',
      );
    }
  }

  /// 忘记密码
  /// [email] 邮箱地址
  /// 返回API响应
  Future<ApiResponse<void>> forgotPassword(String email) async {
    try {
      final response = await _dio.post('/auth/forgot-password', data: {
        'email': email,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        return ApiResponse<void>(
          success: data['success'] ?? false,
          message: data['message'] ?? '重置密码邮件已发送',
        );
      } else {
        return ApiResponse<void>(
          success: false,
          message: '发送重置邮件请求失败',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<void>(
        success: false,
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<void>(
        success: false,
        message: '发送重置邮件过程中发生未知错误',
      );
    }
  }

  /// 更新用户资料
  /// [userData] 用户数据
  /// 返回包含更新后用户信息的API响应
  Future<ApiResponse<User>> updateProfile(Map<String, dynamic> userData) async {
    try {
      final response = await _dio.put('/auth/profile', data: userData);

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final user = User.fromJson(data['data']);
          
          // 更新本地用户数据
          await _storageHelper.saveUserData(user.toJson());

          return ApiResponse<User>(
            success: true,
            data: user,
            message: data['message'] ?? '资料更新成功',
          );
        } else {
          return ApiResponse<User>(
            success: false,
            message: data['message'] ?? '资料更新失败',
          );
        }
      } else {
        return ApiResponse<User>(
          success: false,
          message: '资料更新请求失败',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<User>(
        success: false,
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<User>(
        success: false,
        message: '资料更新过程中发生未知错误',
      );
    }
  }

  /// 处理401未授权错误
  void _handleUnauthorized() async {
    // 尝试刷新token
    final refreshResult = await refreshToken();
    if (!refreshResult.success) {
      // 刷新失败，清除认证数据
      await _storageHelper.clearAuthData();
    }
  }

  /// 处理Dio错误
  String _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return AppConstants.timeoutError;
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.data?['message'];
        if (statusCode == 401) {
          return AppConstants.authError;
        } else if (statusCode == 403) {
          return AppConstants.permissionError;
        } else if (statusCode != null && statusCode >= 500) {
          return AppConstants.serverError;
        } else {
          return message ?? AppConstants.unknownError;
        }
      case DioExceptionType.connectionError:
        return AppConstants.networkError;
      case DioExceptionType.cancel:
        return '请求已取消';
      default:
        return AppConstants.unknownError;
    }
  }
}
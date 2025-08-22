import 'package:dio/dio.dart';
import '../models/application.dart';
import '../models/api_response.dart';
import '../utils/storage_helper.dart';
import '../constants/app_constants.dart';

/// 申请相关API服务
/// 处理车辆申请的网络请求
class ApplicationService {
  final Dio _dio = Dio();
  final StorageHelper _storageHelper = StorageHelper();

  ApplicationService() {
    _dio.options.baseUrl = AppConstants.baseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
    _dio.options.headers = {
      'Content-Type': 'application/json',
    };

    // 请求拦截器 - 自动添加认证token
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storageHelper.getAuthToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          // 处理401未授权错误
          if (error.response?.statusCode == 401) {
            await _storageHelper.clearAuthData();
          }
          handler.next(error);
        },
      ),
    );
  }

  /// 获取申请列表
  /// [page] 页码
  /// [pageSize] 每页数量
  /// [status] 申请状态筛选
  /// [type] 申请类型筛选
  /// [startDate] 开始日期筛选
  /// [endDate] 结束日期筛选
  Future<PaginatedApiResponse<VehicleApplication>> getApplications({
    int page = 1,
    int pageSize = 10,
    String? status,
    String? type,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'pageSize': pageSize,
      };

      if (status != null && status.isNotEmpty) {
        queryParams['status'] = status;
      }
      if (type != null && type.isNotEmpty) {
        queryParams['type'] = type;
      }
      if (startDate != null) {
        queryParams['startDate'] = startDate.toIso8601String();
      }
      if (endDate != null) {
        queryParams['endDate'] = endDate.toIso8601String();
      }

      final response = await _dio.get(
        '/api/applications',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final applications = (data['data'] as List)
            .map((json) => VehicleApplication.fromJson(json))
            .toList();

        return PaginatedApiResponse<VehicleApplication>(
          success: true,
          data: applications,
          message: data['message'] ?? '获取成功',
          currentPage: data['pagination']?['currentPage'] ?? page,
          totalPages: data['pagination']?['totalPages'] ?? 1,
          totalCount: data['pagination']?['totalCount'] ?? applications.length,
          pageSize: data['pagination']?['pageSize'] ?? pageSize,
          hasNextPage: data['pagination']?['hasNextPage'] ?? false,
          hasPreviousPage: data['pagination']?['hasPreviousPage'] ?? false,
        );
      } else {
        return PaginatedApiResponse<VehicleApplication>(
          success: false,
          data: [],
          message: '获取申请列表失败',
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          pageSize: pageSize,
          hasNextPage: false,
          hasPreviousPage: false,
        );
      }
    } catch (e) {
      return PaginatedApiResponse<VehicleApplication>(
        success: false,
        data: [],
        message: '网络请求失败: $e',
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: pageSize,
        hasNextPage: false,
        hasPreviousPage: false,
      );
    }
  }

  /// 获取我的申请列表
  Future<ApiResponse<List<VehicleApplication>>> getMyApplications() async {
    try {
      final response = await _dio.get('/api/applications/my');

      if (response.statusCode == 200) {
        final data = response.data;
        final applications = (data['data'] as List)
            .map((json) => VehicleApplication.fromJson(json))
            .toList();

        return ApiResponse<List<VehicleApplication>>.success(
          data: applications,
          message: data['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<List<VehicleApplication>>.error(
          message: '获取我的申请失败',
        );
      }
    } catch (e) {
      return ApiResponse<List<VehicleApplication>>.error(
        message: '网络请求失败: $e',
      );
    }
  }

  /// 获取待审批申请列表
  Future<ApiResponse<List<VehicleApplication>>> getPendingApplications() async {
    try {
      final response = await _dio.get('/api/applications/pending');

      if (response.statusCode == 200) {
        final data = response.data;
        final applications = (data['data'] as List)
            .map((json) => VehicleApplication.fromJson(json))
            .toList();

        return ApiResponse<List<VehicleApplication>>.success(
          data: applications,
          message: data['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<List<VehicleApplication>>.error(
          message: '获取待审批申请失败',
        );
      }
    } catch (e) {
      return ApiResponse<List<VehicleApplication>>.error(
        message: '网络请求失败: $e',
      );
    }
  }

  /// 根据ID获取申请详情
  /// [applicationId] 申请ID
  Future<ApiResponse<VehicleApplication>> getApplicationById(String applicationId) async {
    try {
      final response = await _dio.get('/api/applications/$applicationId');

      if (response.statusCode == 200) {
        final data = response.data;
        final application = VehicleApplication.fromJson(data['data']);

        return ApiResponse<VehicleApplication>.success(
          data: application,
          message: data['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<VehicleApplication>.error(
          message: '获取申请详情失败',
        );
      }
    } catch (e) {
      return ApiResponse<VehicleApplication>.error(
        message: '网络请求失败: $e',
      );
    }
  }

  /// 创建申请
  /// [applicationData] 申请数据
  Future<ApiResponse<VehicleApplication>> createApplication(Map<String, dynamic> applicationData) async {
    try {
      final response = await _dio.post(
        '/api/applications',
        data: applicationData,
      );

      if (response.statusCode == 201) {
        final data = response.data;
        final application = VehicleApplication.fromJson(data['data']);

        return ApiResponse<VehicleApplication>.success(
          data: application,
          message: data['message'] ?? '创建成功',
        );
      } else {
        return ApiResponse<VehicleApplication>.error(
          message: response.data['message'] ?? '创建申请失败',
        );
      }
    } catch (e) {
      if (e is DioException) {
        final errorMessage = e.response?.data['message'] ?? '创建申请失败';
        return ApiResponse<VehicleApplication>.error(message: errorMessage);
      }
      return ApiResponse<VehicleApplication>.error(
        message: '网络请求失败: $e',
      );
    }
  }

  /// 更新申请
  /// [applicationId] 申请ID
  /// [applicationData] 申请数据
  Future<ApiResponse<VehicleApplication>> updateApplication(
    String applicationId,
    Map<String, dynamic> applicationData,
  ) async {
    try {
      final response = await _dio.put(
        '/api/applications/$applicationId',
        data: applicationData,
      );

      if (response.statusCode == 200) {
          final data = response.data;
          final application = VehicleApplication.fromJson(data['data']);

          return ApiResponse<VehicleApplication>.success(
            data: application,
            message: data['message'] ?? '更新成功',
          );
        } else {
          return ApiResponse<VehicleApplication>.error(
            message: response.data['message'] ?? '更新申请失败',
          );
        }
      } catch (e) {
        if (e is DioException) {
          final errorMessage = e.response?.data['message'] ?? '更新申请失败';
          return ApiResponse<VehicleApplication>.error(message: errorMessage);
        }
        return ApiResponse<VehicleApplication>.error(
          message: '网络请求失败: $e',
        );
    }
  }

  /// 取消申请
  /// [applicationId] 申请ID
  /// [reason] 取消原因
  Future<ApiResponse<VehicleApplication>> cancelApplication(
    String applicationId,
    String reason,
  ) async {
    try {
      final response = await _dio.patch(
        '/api/applications/$applicationId/cancel',
        data: {'reason': reason},
      );

      if (response.statusCode == 200) {
          final data = response.data;
          final application = VehicleApplication.fromJson(data['data']);

          return ApiResponse<VehicleApplication>.success(
            data: application,
            message: data['message'] ?? '取消成功',
          );
        } else {
          return ApiResponse<VehicleApplication>.error(
            message: response.data['message'] ?? '取消申请失败',
          );
        }
      } catch (e) {
        if (e is DioException) {
          final errorMessage = e.response?.data['message'] ?? '取消申请失败';
          return ApiResponse<VehicleApplication>.error(message: errorMessage);
        }
        return ApiResponse<VehicleApplication>.error(
          message: '网络请求失败: $e',
        );
    }
  }

  /// 审批申请
  /// [applicationId] 申请ID
  /// [approved] 是否通过
  /// [comment] 审批意见
  Future<ApiResponse<VehicleApplication>> approveApplication(
    String applicationId,
    bool approved,
    String comment,
  ) async {
    try {
      final response = await _dio.patch(
        '/api/applications/$applicationId/approve',
        data: {
          'approved': approved,
          'comment': comment,
        },
      );

      if (response.statusCode == 200) {
          final data = response.data;
          final application = VehicleApplication.fromJson(data['data']);

          return ApiResponse<VehicleApplication>.success(
            data: application,
            message: data['message'] ?? '审批成功',
          );
        } else {
          return ApiResponse<VehicleApplication>.error(
            message: response.data['message'] ?? '审批申请失败',
          );
        }
      } catch (e) {
        if (e is DioException) {
          final errorMessage = e.response?.data['message'] ?? '审批申请失败';
          return ApiResponse<VehicleApplication>.error(message: errorMessage);
        }
        return ApiResponse<VehicleApplication>.error(
          message: '网络请求失败: $e',
        );
    }
  }

  /// 删除申请
  /// [applicationId] 申请ID
  Future<ApiResponse<void>> deleteApplication(String applicationId) async {
    try {
      final response = await _dio.delete('/api/applications/$applicationId');

      if (response.statusCode == 200) {
        final data = response.data;
        return ApiResponse<void>.success(
          message: data['message'] ?? '删除成功',
        );
      } else {
        return ApiResponse<void>.error(
          message: response.data['message'] ?? '删除申请失败',
        );
      }
    } catch (e) {
      if (e is DioException) {
        final errorMessage = e.response?.data['message'] ?? '删除申请失败';
        return ApiResponse<void>.error(message: errorMessage);
      }
      return ApiResponse<void>.error(
        message: '网络请求失败: $e',
      );
    }
  }

  /// 获取申请统计信息
  Future<ApiResponse<Map<String, dynamic>>> getApplicationStatistics() async {
    try {
      final response = await _dio.get('/api/applications/statistics');

      if (response.statusCode == 200) {
        final data = response.data;
        return ApiResponse<Map<String, dynamic>>.success(
          data: data['data'],
          message: data['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<Map<String, dynamic>>.error(
          message: '获取统计信息失败',
        );
      }
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>.error(
        message: '网络请求失败: $e',
      );
    }
  }

  /// 获取申请类型列表
  Future<ApiResponse<List<String>>> getApplicationTypes() async {
    try {
      final response = await _dio.get('/api/applications/types');

      if (response.statusCode == 200) {
        final data = response.data;
        final types = (data['data'] as List).cast<String>();

        return ApiResponse<List<String>>.success(
          data: types,
          message: data['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<List<String>>.error(
          message: '获取申请类型失败',
        );
      }
    } catch (e) {
      return ApiResponse<List<String>>.error(
        message: '网络请求失败: $e',
      );
    }
  }

  /// 获取申请状态列表
  Future<ApiResponse<List<String>>> getApplicationStatuses() async {
    try {
      final response = await _dio.get('/api/applications/statuses');

      if (response.statusCode == 200) {
        final data = response.data;
        final statuses = (data['data'] as List).cast<String>();

        return ApiResponse<List<String>>.success(
          data: statuses,
          message: data['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<List<String>>.error(
          message: '获取申请状态失败',
        );
      }
    } catch (e) {
      return ApiResponse<List<String>>.error(
        message: '网络请求失败: $e',
      );
    }
  }
}
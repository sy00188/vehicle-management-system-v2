import 'package:dio/dio.dart';
import '../models/vehicle.dart';
import '../models/api_response.dart';
import '../utils/storage_helper.dart';
import '../constants/app_constants.dart';

/// 车辆相关API服务
class VehicleService {
  late final Dio _dio;
  final StorageHelper _storageHelper = StorageHelper();

  VehicleService() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // 添加请求拦截器，自动添加认证token
    _dio.interceptors.add(InterceptorsWrapper(
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
          // 可以在这里触发重新登录逻辑
        }
        handler.next(error);
      },
    ));
  }

  /// 获取车辆列表
  /// [page] 页码
  /// [pageSize] 每页数量
  /// [keyword] 搜索关键词
  /// [status] 车辆状态筛选
  /// [type] 车辆类型筛选
  /// [department] 部门筛选
  Future<PaginatedApiResponse<Vehicle>> getVehicles({
    int page = 1,
    int pageSize = 10,
    String? keyword,
    String? status,
    String? type,
    String? department,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'pageSize': pageSize,
      };

      if (keyword != null && keyword.isNotEmpty) {
        queryParams['keyword'] = keyword;
      }
      if (status != null && status.isNotEmpty) {
        queryParams['status'] = status;
      }
      if (type != null && type.isNotEmpty) {
        queryParams['type'] = type;
      }
      if (department != null && department.isNotEmpty) {
        queryParams['department'] = department;
      }

      final response = await _dio.get(
        '/api/vehicles',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200) {
        final responseData = response.data;
        
        // 解析车辆列表
        final vehicleList = (responseData['data']['vehicles'] as List)
            .map((json) => Vehicle.fromJson(json))
            .toList();

        // 解析分页信息
        final pagination = responseData['data']['pagination'];
        
        return PaginatedApiResponse<Vehicle>(
          success: true,
          data: vehicleList,
          message: responseData['message'] ?? '获取成功',
          currentPage: pagination['currentPage'] ?? page,
          pageSize: pagination['pageSize'] ?? pageSize,
          totalCount: pagination['totalCount'] ?? 0,
          totalPages: pagination['totalPages'] ?? 1,
          hasNextPage: pagination['hasNextPage'] ?? false,
          hasPreviousPage: pagination['hasPreviousPage'] ?? false,
        );
      } else {
        return PaginatedApiResponse<Vehicle>(
          success: false,
          message: '获取车辆列表失败: ${response.statusMessage}',
          currentPage: 1,
          pageSize: pageSize,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        );
      }
    } on DioException catch (e) {
      return PaginatedApiResponse<Vehicle>(
        success: false,
        message: _handleDioError(e),
        currentPage: 1,
        pageSize: pageSize,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      );
    } catch (e) {
      return PaginatedApiResponse<Vehicle>(
        success: false,
        message: '获取车辆列表失败: $e',
        currentPage: 1,
        pageSize: pageSize,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      );
    }
  }

  /// 根据ID获取车辆详情
  /// [vehicleId] 车辆ID
  Future<ApiResponse<Vehicle>> getVehicleById(String vehicleId) async {
    try {
      final response = await _dio.get('/api/vehicles/$vehicleId');

      if (response.statusCode == 200) {
        final responseData = response.data;
        final vehicle = Vehicle.fromJson(responseData['data']);
        
        return ApiResponse<Vehicle>.success(
          data: vehicle,
          message: responseData['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<Vehicle>.error(
          message: '获取车辆详情失败: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<Vehicle>.error(
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<Vehicle>.error(
        message: '获取车辆详情失败: $e',
      );
    }
  }

  /// 创建车辆
  /// [vehicleData] 车辆数据
  Future<ApiResponse<Vehicle>> createVehicle(Map<String, dynamic> vehicleData) async {
    try {
      final response = await _dio.post(
        '/api/vehicles',
        data: vehicleData,
      );

      if (response.statusCode == 201) {
        final responseData = response.data;
        final vehicle = Vehicle.fromJson(responseData['data']);
        
        return ApiResponse<Vehicle>.success(
          data: vehicle,
          message: responseData['message'] ?? '创建成功',
        );
      } else {
        return ApiResponse<Vehicle>.error(
          message: '创建车辆失败: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<Vehicle>.error(
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<Vehicle>.error(
        message: '创建车辆失败: $e',
      );
    }
  }

  /// 更新车辆
  /// [vehicleId] 车辆ID
  /// [vehicleData] 车辆数据
  Future<ApiResponse<Vehicle>> updateVehicle(String vehicleId, Map<String, dynamic> vehicleData) async {
    try {
      final response = await _dio.put(
        '/api/vehicles/$vehicleId',
        data: vehicleData,
      );

      if (response.statusCode == 200) {
        final responseData = response.data;
        final vehicle = Vehicle.fromJson(responseData['data']);
        
        return ApiResponse<Vehicle>.success(
          data: vehicle,
          message: responseData['message'] ?? '更新成功',
        );
      } else {
        return ApiResponse<Vehicle>.error(
          message: '更新车辆失败: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<Vehicle>.error(
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<Vehicle>.error(
        message: '更新车辆失败: $e',
      );
    }
  }

  /// 删除车辆
  /// [vehicleId] 车辆ID
  Future<ApiResponse<void>> deleteVehicle(String vehicleId) async {
    try {
      final response = await _dio.delete('/api/vehicles/$vehicleId');

      if (response.statusCode == 200) {
        final responseData = response.data;
        
        return ApiResponse<void>.success(
          message: responseData['message'] ?? '删除成功',
        );
      } else {
        return ApiResponse<void>.error(
          message: '删除车辆失败: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<void>.error(
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<void>.error(
        message: '删除车辆失败: $e',
      );
    }
  }

  /// 获取车辆统计信息
  Future<ApiResponse<Map<String, dynamic>>> getVehicleStatistics() async {
    try {
      final response = await _dio.get('/api/vehicles/statistics');

      if (response.statusCode == 200) {
        final responseData = response.data;
        
        return ApiResponse<Map<String, dynamic>>.success(
          data: responseData['data'],
          message: responseData['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<Map<String, dynamic>>.error(
          message: '获取车辆统计失败: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<Map<String, dynamic>>.error(
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>.error(
        message: '获取车辆统计失败: $e',
      );
    }
  }

  /// 获取可用车辆列表（用于申请）
  Future<ApiResponse<List<Vehicle>>> getAvailableVehicles() async {
    try {
      final response = await _dio.get('/api/vehicles/available');

      if (response.statusCode == 200) {
        final responseData = response.data;
        final vehicleList = (responseData['data'] as List)
            .map((json) => Vehicle.fromJson(json))
            .toList();
        
        return ApiResponse<List<Vehicle>>.success(
          data: vehicleList,
          message: responseData['message'] ?? '获取成功',
        );
      } else {
        return ApiResponse<List<Vehicle>>.error(
          message: '获取可用车辆失败: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<List<Vehicle>>.error(
        message: _handleDioError(e),
      );
    } catch (e) {
      return ApiResponse<List<Vehicle>>.error(
        message: '获取可用车辆失败: $e',
      );
    }
  }

  /// 处理Dio错误
  String _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
        return '连接超时，请检查网络连接';
      case DioExceptionType.sendTimeout:
        return '发送超时，请重试';
      case DioExceptionType.receiveTimeout:
        return '接收超时，请重试';
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.data?['message'];
        return message ?? '请求失败 (状态码: $statusCode)';
      case DioExceptionType.cancel:
        return '请求已取消';
      case DioExceptionType.connectionError:
        return '网络连接错误，请检查网络设置';
      default:
        return '网络请求失败: ${error.message}';
    }
  }
}
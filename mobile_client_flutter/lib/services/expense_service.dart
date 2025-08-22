import 'package:dio/dio.dart';
import '../models/expense.dart';
import '../models/api_response.dart';
import '../utils/storage_helper.dart';
import '../constants/app_constants.dart';

/// 费用相关API服务
class ExpenseService {
  late final Dio _dio;
  final StorageHelper _storageHelper = StorageHelper();

  ExpenseService() {
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

  /// 获取费用列表
  /// [page] 页码
  /// [limit] 每页数量
  /// [type] 费用类型筛选
  /// [status] 费用状态筛选
  /// [search] 搜索关键词
  /// [startDate] 开始日期
  /// [endDate] 结束日期
  Future<PaginatedApiResponse<ExpenseRecord>> getExpenses({
    int page = 1,
    int limit = 20,
    ExpenseType? type,
    ExpenseStatus? status,
    String? search,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (type != null) {
        queryParams['type'] = type.value;
      }
      if (status != null) {
        queryParams['status'] = status.value;
      }
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (startDate != null) {
        queryParams['startDate'] = startDate.toIso8601String();
      }
      if (endDate != null) {
        queryParams['endDate'] = endDate.toIso8601String();
      }

      final response = await _dio.get(
        '/api/expenses',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final expenses = (data['data'] as List)
            .map((json) => ExpenseRecord.fromJson(json))
            .toList();

        return PaginatedApiResponse<ExpenseRecord>(
          success: true,
          message: data['message'] ?? 'Success',
          data: expenses,
          currentPage: data['pagination']['currentPage'],
          pageSize: data['pagination']['pageSize'] ?? limit,
          totalPages: data['pagination']['totalPages'],
          totalCount: data['pagination']['totalCount'],
          hasNextPage: data['pagination']['hasNextPage'],
          hasPreviousPage: data['pagination']['hasPreviousPage'],
        );
      } else {
        return PaginatedApiResponse<ExpenseRecord>(
          success: false,
          message: '获取费用列表失败',
          data: [],
          currentPage: 1,
          pageSize: limit,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        );
      }
    } catch (e) {
      return PaginatedApiResponse<ExpenseRecord>(
        success: false,
        message: '网络错误: $e',
        data: [],
        currentPage: 1,
        pageSize: limit,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      );
    }
  }

  /// 根据ID获取费用详情
  Future<ApiResponse<ExpenseRecord>> getExpenseById(String expenseId) async {
    try {
      final response = await _dio.get('/api/expenses/$expenseId');

      if (response.statusCode == 200) {
        final data = response.data;
        final expense = ExpenseRecord.fromJson(data['data']);
        return ApiResponse<ExpenseRecord>(
          success: true,
          message: data['message'] ?? 'Success',
          data: expense,
        );
      } else {
        return ApiResponse<ExpenseRecord>(
          success: false,
          message: '获取费用详情失败',
        );
      }
    } catch (e) {
      return ApiResponse<ExpenseRecord>(
        success: false,
        message: '网络错误: $e',
      );
    }
  }

  /// 创建费用记录
  Future<ApiResponse<ExpenseRecord>> createExpense(ExpenseRecord expense) async {
    try {
      final response = await _dio.post(
        '/api/expenses',
        data: expense.toJson(),
      );

      if (response.statusCode == 201) {
        final data = response.data;
        final createdExpense = ExpenseRecord.fromJson(data['data']);
        return ApiResponse<ExpenseRecord>(
          success: true,
          message: data['message'] ?? '费用记录创建成功',
          data: createdExpense,
        );
      } else {
        return ApiResponse<ExpenseRecord>(
          success: false,
          message: '创建费用记录失败',
        );
      }
    } catch (e) {
      return ApiResponse<ExpenseRecord>(
        success: false,
        message: '网络错误: $e',
      );
    }
  }

  /// 更新费用记录
  Future<ApiResponse<ExpenseRecord>> updateExpense(String expenseId, ExpenseRecord expense) async {
    try {
      final response = await _dio.put(
        '/api/expenses/$expenseId',
        data: expense.toJson(),
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final updatedExpense = ExpenseRecord.fromJson(data['data']);
        return ApiResponse<ExpenseRecord>(
          success: true,
          message: data['message'] ?? '费用记录更新成功',
          data: updatedExpense,
        );
      } else {
        return ApiResponse<ExpenseRecord>(
          success: false,
          message: '更新费用记录失败',
        );
      }
    } catch (e) {
      return ApiResponse<ExpenseRecord>(
        success: false,
        message: '网络错误: $e',
      );
    }
  }

  /// 删除费用记录
  Future<ApiResponse<void>> deleteExpense(String expenseId) async {
    try {
      final response = await _dio.delete('/api/expenses/$expenseId');

      if (response.statusCode == 200) {
        final data = response.data;
        return ApiResponse<void>(
          success: true,
          message: data['message'] ?? '费用记录删除成功',
        );
      } else {
        return ApiResponse<void>(
          success: false,
          message: '删除费用记录失败',
        );
      }
    } catch (e) {
      return ApiResponse<void>(
        success: false,
        message: '网络错误: $e',
      );
    }
  }

  /// 审批费用记录
  Future<ApiResponse<ExpenseRecord>> approveExpense(String expenseId, String? remarks) async {
    try {
      final response = await _dio.post(
        '/api/expenses/$expenseId/approve',
        data: {
          if (remarks != null) 'remarks': remarks,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final approvedExpense = ExpenseRecord.fromJson(data['data']);
        return ApiResponse<ExpenseRecord>(
          success: true,
          message: data['message'] ?? '费用记录审批成功',
          data: approvedExpense,
        );
      } else {
        return ApiResponse<ExpenseRecord>(
          success: false,
          message: '审批费用记录失败',
        );
      }
    } catch (e) {
      return ApiResponse<ExpenseRecord>(
        success: false,
        message: '网络错误: $e',
      );
    }
  }

  /// 拒绝费用记录
  Future<ApiResponse<ExpenseRecord>> rejectExpense(String expenseId, String? remarks) async {
    try {
      final response = await _dio.post(
        '/api/expenses/$expenseId/reject',
        data: {
          if (remarks != null) 'remarks': remarks,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final rejectedExpense = ExpenseRecord.fromJson(data['data']);
        return ApiResponse<ExpenseRecord>(
          success: true,
          message: data['message'] ?? '费用记录拒绝成功',
          data: rejectedExpense,
        );
      } else {
        return ApiResponse<ExpenseRecord>(
          success: false,
          message: '拒绝费用记录失败',
        );
      }
    } catch (e) {
      return ApiResponse<ExpenseRecord>(
        success: false,
        message: '网络错误: $e',
      );
    }
  }

  /// 获取费用统计信息
  Future<ApiResponse<Map<String, dynamic>>> getExpenseStatistics({
    DateTime? startDate,
    DateTime? endDate,
    String? vehicleId,
    ExpenseType? type,
  }) async {
    try {
      final queryParams = <String, dynamic>{};

      if (startDate != null) {
        queryParams['startDate'] = startDate.toIso8601String();
      }
      if (endDate != null) {
        queryParams['endDate'] = endDate.toIso8601String();
      }
      if (vehicleId != null) {
        queryParams['vehicleId'] = vehicleId;
      }
      if (type != null) {
        queryParams['type'] = type.value;
      }

      final response = await _dio.get(
        '/api/expenses/statistics',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200) {
        final data = response.data;
        return ApiResponse<Map<String, dynamic>>(
          success: true,
          message: data['message'] ?? 'Success',
          data: data['data'],
        );
      } else {
        return ApiResponse<Map<String, dynamic>>(
          success: false,
          message: '获取费用统计失败',
        );
      }
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: '网络错误: $e',
      );
    }
  }
}
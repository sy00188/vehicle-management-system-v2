/// API响应通用模型
/// 用于统一处理所有API请求的响应格式
class ApiResponse<T> {
  /// 请求是否成功
  final bool success;
  
  /// 响应数据
  final T? data;
  
  /// 响应消息
  final String message;
  
  /// 错误代码（可选）
  final String? errorCode;
  
  /// 时间戳
  final DateTime timestamp;

  /// 构造函数
  ApiResponse({
    required this.success,
    this.data,
    required this.message,
    this.errorCode,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  /// 成功响应的工厂构造函数
  factory ApiResponse.success({
    T? data,
    String message = '操作成功',
  }) {
    return ApiResponse<T>(
      success: true,
      data: data,
      message: message,
    );
  }

  /// 失败响应的工厂构造函数
  factory ApiResponse.error({
    required String message,
    String? errorCode,
  }) {
    return ApiResponse<T>(
      success: false,
      message: message,
      errorCode: errorCode,
    );
  }

  /// 从JSON创建ApiResponse
  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      success: json['success'] ?? false,
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : json['data'],
      message: json['message'] ?? '',
      errorCode: json['errorCode'],
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'])
          : DateTime.now(),
    );
  }

  /// 转换为JSON
  Map<String, dynamic> toJson([dynamic Function(T)? toJsonT]) {
    return {
      'success': success,
      'data': data != null && toJsonT != null ? toJsonT(data as T) : data,
      'message': message,
      'errorCode': errorCode,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  /// 复制并修改部分属性
  ApiResponse<T> copyWith({
    bool? success,
    T? data,
    String? message,
    String? errorCode,
    DateTime? timestamp,
  }) {
    return ApiResponse<T>(
      success: success ?? this.success,
      data: data ?? this.data,
      message: message ?? this.message,
      errorCode: errorCode ?? this.errorCode,
      timestamp: timestamp ?? this.timestamp,
    );
  }

  /// 转换数据类型
  ApiResponse<R> map<R>(R Function(T) mapper) {
    return ApiResponse<R>(
      success: success,
      data: data != null ? mapper(data as T) : null,
      message: message,
      errorCode: errorCode,
      timestamp: timestamp,
    );
  }

  @override
  String toString() {
    return 'ApiResponse{success: $success, data: $data, message: $message, errorCode: $errorCode, timestamp: $timestamp}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ApiResponse<T> &&
        other.success == success &&
        other.data == data &&
        other.message == message &&
        other.errorCode == errorCode &&
        other.timestamp == timestamp;
  }

  @override
  int get hashCode {
    return success.hashCode ^
        data.hashCode ^
        message.hashCode ^
        errorCode.hashCode ^
        timestamp.hashCode;
  }
}

/// 分页响应模型
class PaginatedApiResponse<T> extends ApiResponse<List<T>> {
  /// 当前页码
  final int currentPage;
  
  /// 每页数量
  final int pageSize;
  
  /// 总数量
  final int totalCount;
  
  /// 总页数
  final int totalPages;
  
  /// 是否有下一页
  final bool hasNextPage;
  
  /// 是否有上一页
  final bool hasPreviousPage;

  PaginatedApiResponse({
    required bool success,
    List<T>? data,
    required String message,
    String? errorCode,
    DateTime? timestamp,
    required this.currentPage,
    required this.pageSize,
    required this.totalCount,
    required this.totalPages,
    required this.hasNextPage,
    required this.hasPreviousPage,
  }) : super(
          success: success,
          data: data,
          message: message,
          errorCode: errorCode,
          timestamp: timestamp,
        );

  /// 从JSON创建分页响应
  factory PaginatedApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) {
    final pagination = json['pagination'] ?? {};
    return PaginatedApiResponse<T>(
      success: json['success'] ?? false,
      data: json['data'] != null
          ? (json['data'] as List).map((item) => fromJsonT(item)).toList()
          : null,
      message: json['message'] ?? '',
      errorCode: json['errorCode'],
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'])
          : DateTime.now(),
      currentPage: pagination['currentPage'] ?? 1,
      pageSize: pagination['pageSize'] ?? 10,
      totalCount: pagination['totalCount'] ?? 0,
      totalPages: pagination['totalPages'] ?? 0,
      hasNextPage: pagination['hasNextPage'] ?? false,
      hasPreviousPage: pagination['hasPreviousPage'] ?? false,
    );
  }

  @override
  Map<String, dynamic> toJson([dynamic Function(List<T>)? toJsonT]) {
    final baseJson = super.toJson(toJsonT);
    baseJson['pagination'] = {
      'currentPage': currentPage,
      'pageSize': pageSize,
      'totalCount': totalCount,
      'totalPages': totalPages,
      'hasNextPage': hasNextPage,
      'hasPreviousPage': hasPreviousPage,
    };
    return baseJson;
  }
}
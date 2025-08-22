import 'package:json_annotation/json_annotation.dart';

part 'common.g.dart';

/// 通用API响应模型
@JsonSerializable(genericArgumentFactories: true)
class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final int? code;
  final String? error;
  final DateTime timestamp;

  const ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.code,
    this.error,
    required this.timestamp,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) => _$ApiResponseFromJson(json, fromJsonT);

  Map<String, dynamic> toJson(Object Function(T value) toJsonT) => 
      _$ApiResponseToJson(this, toJsonT);

  /// 创建成功响应
  factory ApiResponse.success({
    required T data,
    String message = 'Success',
    int? code,
  }) {
    return ApiResponse(
      success: true,
      message: message,
      data: data,
      code: code ?? 200,
      timestamp: DateTime.now(),
    );
  }

  /// 创建错误响应
  factory ApiResponse.error({
    required String message,
    String? error,
    int? code,
  }) {
    return ApiResponse(
      success: false,
      message: message,
      error: error,
      code: code ?? 500,
      timestamp: DateTime.now(),
    );
  }

  /// 检查响应是否成功
  bool get isSuccess => success && error == null;

  /// 检查响应是否失败
  bool get isError => !success || error != null;

  /// 获取错误信息
  String get errorMessage => error ?? message;

  @override
  String toString() {
    return 'ApiResponse{success: $success, message: $message, code: $code, data: $data}';
  }
}

/// 分页响应模型
@JsonSerializable(genericArgumentFactories: true)
class PaginatedResponse<T> {
  final List<T> data;
  final PaginationMeta meta;

  const PaginatedResponse({
    required this.data,
    required this.meta,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) => _$PaginatedResponseFromJson(json, fromJsonT);

  Map<String, dynamic> toJson(Object Function(T value) toJsonT) => 
      _$PaginatedResponseToJson(this, toJsonT);

  /// 检查是否有更多数据
  bool get hasMore => meta.hasMore;

  /// 检查是否为空
  bool get isEmpty => data.isEmpty;

  /// 检查是否不为空
  bool get isNotEmpty => data.isNotEmpty;

  /// 获取数据数量
  int get length => data.length;

  /// 获取总数量
  int get totalCount => meta.total;

  /// 获取当前页码
  int get currentPage => meta.page;

  /// 获取总页数
  int get totalPages => meta.totalPages;

  @override
  String toString() {
    return 'PaginatedResponse{data: ${data.length} items, meta: $meta}';
  }
}

/// 分页元数据模型
@JsonSerializable()
class PaginationMeta {
  final int page;
  final int limit;
  final int total;
  final int totalPages;
  final bool hasMore;
  final bool hasPrevious;

  const PaginationMeta({
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
    required this.hasMore,
    required this.hasPrevious,
  });

  factory PaginationMeta.fromJson(Map<String, dynamic> json) => _$PaginationMetaFromJson(json);
  Map<String, dynamic> toJson() => _$PaginationMetaToJson(this);

  /// 获取起始索引（从0开始）
  int get startIndex => (page - 1) * limit;

  /// 获取结束索引（从0开始）
  int get endIndex {
    final end = startIndex + limit - 1;
    return end >= total ? total - 1 : end;
  }

  /// 获取当前页显示的数据范围描述
  String get rangeDescription {
    if (total == 0) return '0 条记录';
    final start = startIndex + 1;
    final end = endIndex + 1;
    return '第 $start-$end 条，共 $total 条记录';
  }

  /// 获取下一页页码
  int? get nextPage => hasMore ? page + 1 : null;

  /// 获取上一页页码
  int? get previousPage => hasPrevious ? page - 1 : null;

  /// 创建默认分页元数据
  factory PaginationMeta.empty() {
    return const PaginationMeta(
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasMore: false,
      hasPrevious: false,
    );
  }

  @override
  String toString() {
    return 'PaginationMeta{page: $page, limit: $limit, total: $total, totalPages: $totalPages}';
  }
}

/// 排序方向枚举
enum SortDirection {
  @JsonValue('asc')
  ascending,
  @JsonValue('desc')
  descending,
}

/// 排序方向扩展
extension SortDirectionExtension on SortDirection {
  String get value {
    switch (this) {
      case SortDirection.ascending:
        return 'asc';
      case SortDirection.descending:
        return 'desc';
    }
  }

  String get label {
    switch (this) {
      case SortDirection.ascending:
        return '升序';
      case SortDirection.descending:
        return '降序';
    }
  }

  String get icon {
    switch (this) {
      case SortDirection.ascending:
        return '↑';
      case SortDirection.descending:
        return '↓';
    }
  }
}

/// 排序选项模型
@JsonSerializable()
class SortOption {
  final String field;
  final SortDirection direction;

  const SortOption({
    required this.field,
    required this.direction,
  });

  factory SortOption.fromJson(Map<String, dynamic> json) => _$SortOptionFromJson(json);
  Map<String, dynamic> toJson() => _$SortOptionToJson(this);

  /// 创建升序排序
  factory SortOption.ascending(String field) {
    return SortOption(field: field, direction: SortDirection.ascending);
  }

  /// 创建降序排序
  factory SortOption.descending(String field) {
    return SortOption(field: field, direction: SortDirection.descending);
  }

  /// 切换排序方向
  SortOption toggle() {
    return SortOption(
      field: field,
      direction: direction == SortDirection.ascending 
          ? SortDirection.descending 
          : SortDirection.ascending,
    );
  }

  /// 转换为查询字符串
  String toQueryString() {
    return '${direction.value == 'desc' ? '-' : ''}$field';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is SortOption && 
           other.field == field && 
           other.direction == direction;
  }

  @override
  int get hashCode => Object.hash(field, direction);

  @override
  String toString() {
    return 'SortOption{field: $field, direction: ${direction.value}}';
  }
}

/// 过滤器模型
@JsonSerializable()
class FilterOption {
  final String field;
  final String operator;
  final dynamic value;
  final String? label;

  const FilterOption({
    required this.field,
    required this.operator,
    required this.value,
    this.label,
  });

  factory FilterOption.fromJson(Map<String, dynamic> json) => _$FilterOptionFromJson(json);
  Map<String, dynamic> toJson() => _$FilterOptionToJson(this);

  /// 创建等于过滤器
  factory FilterOption.equals(String field, dynamic value, {String? label}) {
    return FilterOption(
      field: field,
      operator: 'eq',
      value: value,
      label: label,
    );
  }

  /// 创建包含过滤器
  factory FilterOption.contains(String field, String value, {String? label}) {
    return FilterOption(
      field: field,
      operator: 'contains',
      value: value,
      label: label,
    );
  }

  /// 创建范围过滤器
  factory FilterOption.range(String field, dynamic min, dynamic max, {String? label}) {
    return FilterOption(
      field: field,
      operator: 'range',
      value: {'min': min, 'max': max},
      label: label,
    );
  }

  /// 创建在列表中过滤器
  factory FilterOption.inList(String field, List<dynamic> values, {String? label}) {
    return FilterOption(
      field: field,
      operator: 'in',
      value: values,
      label: label,
    );
  }

  /// 获取显示标签
  String get displayLabel {
    return label ?? '$field $operator $value';
  }

  /// 检查过滤器是否有效
  bool get isValid {
    if (value == null) return false;
    if (value is String && (value as String).isEmpty) return false;
    if (value is List && (value as List).isEmpty) return false;
    return true;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is FilterOption && 
           other.field == field && 
           other.operator == operator &&
           other.value == value;
  }

  @override
  int get hashCode => Object.hash(field, operator, value);

  @override
  String toString() {
    return 'FilterOption{field: $field, operator: $operator, value: $value}';
  }
}

/// 查询参数模型
@JsonSerializable()
class QueryParams {
  final int page;
  final int limit;
  final String? search;
  final List<SortOption> sorts;
  final List<FilterOption> filters;
  final Map<String, dynamic>? extra;

  const QueryParams({
    this.page = 1,
    this.limit = 10,
    this.search,
    this.sorts = const [],
    this.filters = const [],
    this.extra,
  });

  factory QueryParams.fromJson(Map<String, dynamic> json) => _$QueryParamsFromJson(json);
  Map<String, dynamic> toJson() => _$QueryParamsToJson(this);

  /// 创建默认查询参数
  factory QueryParams.defaults() {
    return const QueryParams();
  }

  /// 复制并修改参数
  QueryParams copyWith({
    int? page,
    int? limit,
    String? search,
    List<SortOption>? sorts,
    List<FilterOption>? filters,
    Map<String, dynamic>? extra,
  }) {
    return QueryParams(
      page: page ?? this.page,
      limit: limit ?? this.limit,
      search: search ?? this.search,
      sorts: sorts ?? this.sorts,
      filters: filters ?? this.filters,
      extra: extra ?? this.extra,
    );
  }

  /// 转换为查询字符串映射
  Map<String, dynamic> toQueryMap() {
    final Map<String, dynamic> query = {
      'page': page,
      'limit': limit,
    };

    if (search != null && search!.isNotEmpty) {
      query['search'] = search;
    }

    if (sorts.isNotEmpty) {
      query['sort'] = sorts.map((s) => s.toQueryString()).join(',');
    }

    if (filters.isNotEmpty) {
      for (final filter in filters) {
        if (filter.isValid) {
          query['${filter.field}_${filter.operator}'] = filter.value;
        }
      }
    }

    if (extra != null) {
      query.addAll(extra!);
    }

    return query;
  }

  /// 获取偏移量
  int get offset => (page - 1) * limit;

  /// 检查是否有搜索条件
  bool get hasSearch => search != null && search!.isNotEmpty;

  /// 检查是否有排序条件
  bool get hasSorts => sorts.isNotEmpty;

  /// 检查是否有过滤条件
  bool get hasFilters => filters.where((f) => f.isValid).isNotEmpty;

  /// 检查是否有任何查询条件
  bool get hasConditions => hasSearch || hasSorts || hasFilters;

  @override
  String toString() {
    return 'QueryParams{page: $page, limit: $limit, search: $search, sorts: ${sorts.length}, filters: ${filters.length}}';
  }
}

/// 文件上传模型
@JsonSerializable()
class FileUpload {
  final String id;
  final String filename;
  final String originalName;
  final String mimeType;
  final int size;
  final String url;
  final String? thumbnailUrl;
  final DateTime uploadedAt;
  final String uploadedBy;
  final Map<String, dynamic>? metadata;

  const FileUpload({
    required this.id,
    required this.filename,
    required this.originalName,
    required this.mimeType,
    required this.size,
    required this.url,
    this.thumbnailUrl,
    required this.uploadedAt,
    required this.uploadedBy,
    this.metadata,
  });

  factory FileUpload.fromJson(Map<String, dynamic> json) => _$FileUploadFromJson(json);
  Map<String, dynamic> toJson() => _$FileUploadToJson(this);

  /// 检查是否为图片文件
  bool get isImage {
    return mimeType.startsWith('image/');
  }

  /// 检查是否为视频文件
  bool get isVideo {
    return mimeType.startsWith('video/');
  }

  /// 检查是否为音频文件
  bool get isAudio {
    return mimeType.startsWith('audio/');
  }

  /// 检查是否为文档文件
  bool get isDocument {
    return mimeType.startsWith('application/') || 
           mimeType.startsWith('text/');
  }

  /// 获取文件大小的可读格式
  String get formattedSize {
    if (size < 1024) {
      return '${size}B';
    } else if (size < 1024 * 1024) {
      return '${(size / 1024).toStringAsFixed(1)}KB';
    } else if (size < 1024 * 1024 * 1024) {
      return '${(size / (1024 * 1024)).toStringAsFixed(1)}MB';
    } else {
      return '${(size / (1024 * 1024 * 1024)).toStringAsFixed(1)}GB';
    }
  }

  /// 获取文件扩展名
  String get extension {
    final parts = filename.split('.');
    return parts.length > 1 ? parts.last.toLowerCase() : '';
  }

  /// 获取文件类型图标
  String get typeIcon {
    if (isImage) return '🖼️';
    if (isVideo) return '🎥';
    if (isAudio) return '🎵';
    if (isDocument) {
      switch (extension) {
        case 'pdf':
          return '📄';
        case 'doc':
        case 'docx':
          return '📝';
        case 'xls':
        case 'xlsx':
          return '📊';
        case 'ppt':
        case 'pptx':
          return '📋';
        default:
          return '📄';
      }
    }
    return '📎';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is FileUpload && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'FileUpload{id: $id, filename: $filename, size: $formattedSize}';
  }
}

/// 操作结果模型
@JsonSerializable()
class OperationResult {
  final bool success;
  final String message;
  final String? errorCode;
  final Map<String, dynamic>? data;
  final DateTime timestamp;

  const OperationResult({
    required this.success,
    required this.message,
    this.errorCode,
    this.data,
    required this.timestamp,
  });

  factory OperationResult.fromJson(Map<String, dynamic> json) => _$OperationResultFromJson(json);
  Map<String, dynamic> toJson() => _$OperationResultToJson(this);

  /// 创建成功结果
  factory OperationResult.success({
    String message = '操作成功',
    Map<String, dynamic>? data,
  }) {
    return OperationResult(
      success: true,
      message: message,
      data: data,
      timestamp: DateTime.now(),
    );
  }

  /// 创建失败结果
  factory OperationResult.failure({
    required String message,
    String? errorCode,
    Map<String, dynamic>? data,
  }) {
    return OperationResult(
      success: false,
      message: message,
      errorCode: errorCode,
      data: data,
      timestamp: DateTime.now(),
    );
  }

  /// 检查操作是否成功
  bool get isSuccess => success;

  /// 检查操作是否失败
  bool get isFailure => !success;

  @override
  String toString() {
    return 'OperationResult{success: $success, message: $message, errorCode: $errorCode}';
  }
}
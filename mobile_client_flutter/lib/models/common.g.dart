// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'common.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ApiResponse<T> _$ApiResponseFromJson<T>(
  Map<String, dynamic> json,
  T Function(Object? json) fromJsonT,
) =>
    ApiResponse<T>(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: _$nullableGenericFromJson(json['data'], fromJsonT),
      code: (json['code'] as num?)?.toInt(),
      error: json['error'] as String?,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$ApiResponseToJson<T>(
  ApiResponse<T> instance,
  Object? Function(T value) toJsonT,
) =>
    <String, dynamic>{
      'success': instance.success,
      'message': instance.message,
      'data': _$nullableGenericToJson(instance.data, toJsonT),
      'code': instance.code,
      'error': instance.error,
      'timestamp': instance.timestamp.toIso8601String(),
    };

T? _$nullableGenericFromJson<T>(
  Object? input,
  T Function(Object? json) fromJson,
) =>
    input == null ? null : fromJson(input);

Object? _$nullableGenericToJson<T>(
  T? input,
  Object? Function(T value) toJson,
) =>
    input == null ? null : toJson(input);

PaginatedResponse<T> _$PaginatedResponseFromJson<T>(
  Map<String, dynamic> json,
  T Function(Object? json) fromJsonT,
) =>
    PaginatedResponse<T>(
      data: (json['data'] as List<dynamic>).map(fromJsonT).toList(),
      meta: PaginationMeta.fromJson(json['meta'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$PaginatedResponseToJson<T>(
  PaginatedResponse<T> instance,
  Object? Function(T value) toJsonT,
) =>
    <String, dynamic>{
      'data': instance.data.map(toJsonT).toList(),
      'meta': instance.meta,
    };

PaginationMeta _$PaginationMetaFromJson(Map<String, dynamic> json) =>
    PaginationMeta(
      page: (json['page'] as num).toInt(),
      limit: (json['limit'] as num).toInt(),
      total: (json['total'] as num).toInt(),
      totalPages: (json['totalPages'] as num).toInt(),
      hasMore: json['hasMore'] as bool,
      hasPrevious: json['hasPrevious'] as bool,
    );

Map<String, dynamic> _$PaginationMetaToJson(PaginationMeta instance) =>
    <String, dynamic>{
      'page': instance.page,
      'limit': instance.limit,
      'total': instance.total,
      'totalPages': instance.totalPages,
      'hasMore': instance.hasMore,
      'hasPrevious': instance.hasPrevious,
    };

SortOption _$SortOptionFromJson(Map<String, dynamic> json) => SortOption(
      field: json['field'] as String,
      direction: $enumDecode(_$SortDirectionEnumMap, json['direction']),
    );

Map<String, dynamic> _$SortOptionToJson(SortOption instance) =>
    <String, dynamic>{
      'field': instance.field,
      'direction': _$SortDirectionEnumMap[instance.direction]!,
    };

const _$SortDirectionEnumMap = {
  SortDirection.ascending: 'asc',
  SortDirection.descending: 'desc',
};

FilterOption _$FilterOptionFromJson(Map<String, dynamic> json) => FilterOption(
      field: json['field'] as String,
      operator: json['operator'] as String,
      value: json['value'],
      label: json['label'] as String?,
    );

Map<String, dynamic> _$FilterOptionToJson(FilterOption instance) =>
    <String, dynamic>{
      'field': instance.field,
      'operator': instance.operator,
      'value': instance.value,
      'label': instance.label,
    };

QueryParams _$QueryParamsFromJson(Map<String, dynamic> json) => QueryParams(
      page: (json['page'] as num?)?.toInt() ?? 1,
      limit: (json['limit'] as num?)?.toInt() ?? 10,
      search: json['search'] as String?,
      sorts: (json['sorts'] as List<dynamic>?)
              ?.map((e) => SortOption.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      filters: (json['filters'] as List<dynamic>?)
              ?.map((e) => FilterOption.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      extra: json['extra'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$QueryParamsToJson(QueryParams instance) =>
    <String, dynamic>{
      'page': instance.page,
      'limit': instance.limit,
      'search': instance.search,
      'sorts': instance.sorts,
      'filters': instance.filters,
      'extra': instance.extra,
    };

FileUpload _$FileUploadFromJson(Map<String, dynamic> json) => FileUpload(
      id: json['id'] as String,
      filename: json['filename'] as String,
      originalName: json['originalName'] as String,
      mimeType: json['mimeType'] as String,
      size: (json['size'] as num).toInt(),
      url: json['url'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      uploadedAt: DateTime.parse(json['uploadedAt'] as String),
      uploadedBy: json['uploadedBy'] as String,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$FileUploadToJson(FileUpload instance) =>
    <String, dynamic>{
      'id': instance.id,
      'filename': instance.filename,
      'originalName': instance.originalName,
      'mimeType': instance.mimeType,
      'size': instance.size,
      'url': instance.url,
      'thumbnailUrl': instance.thumbnailUrl,
      'uploadedAt': instance.uploadedAt.toIso8601String(),
      'uploadedBy': instance.uploadedBy,
      'metadata': instance.metadata,
    };

OperationResult _$OperationResultFromJson(Map<String, dynamic> json) =>
    OperationResult(
      success: json['success'] as bool,
      message: json['message'] as String,
      errorCode: json['errorCode'] as String?,
      data: json['data'] as Map<String, dynamic>?,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$OperationResultToJson(OperationResult instance) =>
    <String, dynamic>{
      'success': instance.success,
      'message': instance.message,
      'errorCode': instance.errorCode,
      'data': instance.data,
      'timestamp': instance.timestamp.toIso8601String(),
    };

// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'driver.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Driver _$DriverFromJson(Map<String, dynamic> json) => Driver(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String?,
      employeeId: json['employeeId'] as String,
      department: json['department'] as String,
      status: $enumDecode(_$DriverStatusEnumMap, json['status']),
      licenseNumber: json['licenseNumber'] as String,
      licenseType: $enumDecode(_$LicenseTypeEnumMap, json['licenseType']),
      licenseExpiry: DateTime.parse(json['licenseExpiry'] as String),
      medicalCheckExpiry: json['medicalCheckExpiry'] == null
          ? null
          : DateTime.parse(json['medicalCheckExpiry'] as String),
      drivingYears: (json['drivingYears'] as num).toInt(),
      rating: (json['rating'] as num?)?.toDouble(),
      totalTrips: (json['totalTrips'] as num).toInt(),
      avatar: json['avatar'] as String?,
      remarks: json['remarks'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$DriverToJson(Driver instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'phone': instance.phone,
      'email': instance.email,
      'employeeId': instance.employeeId,
      'department': instance.department,
      'status': _$DriverStatusEnumMap[instance.status]!,
      'licenseNumber': instance.licenseNumber,
      'licenseType': _$LicenseTypeEnumMap[instance.licenseType]!,
      'licenseExpiry': instance.licenseExpiry.toIso8601String(),
      'medicalCheckExpiry': instance.medicalCheckExpiry?.toIso8601String(),
      'drivingYears': instance.drivingYears,
      'rating': instance.rating,
      'totalTrips': instance.totalTrips,
      'avatar': instance.avatar,
      'remarks': instance.remarks,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$DriverStatusEnumMap = {
  DriverStatus.available: 'available',
  DriverStatus.busy: 'busy',
  DriverStatus.onLeave: 'on_leave',
  DriverStatus.inactive: 'inactive',
};

const _$LicenseTypeEnumMap = {
  LicenseType.a1: 'A1',
  LicenseType.a2: 'A2',
  LicenseType.a3: 'A3',
  LicenseType.b1: 'B1',
  LicenseType.b2: 'B2',
  LicenseType.c1: 'C1',
  LicenseType.c2: 'C2',
  LicenseType.d: 'D',
  LicenseType.e: 'E',
  LicenseType.f: 'F',
};

CreateDriverRequest _$CreateDriverRequestFromJson(Map<String, dynamic> json) =>
    CreateDriverRequest(
      name: json['name'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String?,
      employeeId: json['employeeId'] as String,
      department: json['department'] as String,
      licenseNumber: json['licenseNumber'] as String,
      licenseType: $enumDecode(_$LicenseTypeEnumMap, json['licenseType']),
      licenseExpiry: DateTime.parse(json['licenseExpiry'] as String),
      medicalCheckExpiry: json['medicalCheckExpiry'] == null
          ? null
          : DateTime.parse(json['medicalCheckExpiry'] as String),
      drivingYears: (json['drivingYears'] as num).toInt(),
      avatar: json['avatar'] as String?,
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$CreateDriverRequestToJson(
        CreateDriverRequest instance) =>
    <String, dynamic>{
      'name': instance.name,
      'phone': instance.phone,
      'email': instance.email,
      'employeeId': instance.employeeId,
      'department': instance.department,
      'licenseNumber': instance.licenseNumber,
      'licenseType': _$LicenseTypeEnumMap[instance.licenseType]!,
      'licenseExpiry': instance.licenseExpiry.toIso8601String(),
      'medicalCheckExpiry': instance.medicalCheckExpiry?.toIso8601String(),
      'drivingYears': instance.drivingYears,
      'avatar': instance.avatar,
      'remarks': instance.remarks,
    };

UpdateDriverRequest _$UpdateDriverRequestFromJson(Map<String, dynamic> json) =>
    UpdateDriverRequest(
      name: json['name'] as String?,
      phone: json['phone'] as String?,
      email: json['email'] as String?,
      employeeId: json['employeeId'] as String?,
      department: json['department'] as String?,
      status: $enumDecodeNullable(_$DriverStatusEnumMap, json['status']),
      licenseNumber: json['licenseNumber'] as String?,
      licenseType:
          $enumDecodeNullable(_$LicenseTypeEnumMap, json['licenseType']),
      licenseExpiry: json['licenseExpiry'] == null
          ? null
          : DateTime.parse(json['licenseExpiry'] as String),
      medicalCheckExpiry: json['medicalCheckExpiry'] == null
          ? null
          : DateTime.parse(json['medicalCheckExpiry'] as String),
      drivingYears: (json['drivingYears'] as num?)?.toInt(),
      avatar: json['avatar'] as String?,
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$UpdateDriverRequestToJson(
        UpdateDriverRequest instance) =>
    <String, dynamic>{
      'name': instance.name,
      'phone': instance.phone,
      'email': instance.email,
      'employeeId': instance.employeeId,
      'department': instance.department,
      'status': _$DriverStatusEnumMap[instance.status],
      'licenseNumber': instance.licenseNumber,
      'licenseType': _$LicenseTypeEnumMap[instance.licenseType],
      'licenseExpiry': instance.licenseExpiry?.toIso8601String(),
      'medicalCheckExpiry': instance.medicalCheckExpiry?.toIso8601String(),
      'drivingYears': instance.drivingYears,
      'avatar': instance.avatar,
      'remarks': instance.remarks,
    };

DriverStats _$DriverStatsFromJson(Map<String, dynamic> json) => DriverStats(
      total: (json['total'] as num).toInt(),
      available: (json['available'] as num).toInt(),
      busy: (json['busy'] as num).toInt(),
      onLeave: (json['onLeave'] as num).toInt(),
      inactive: (json['inactive'] as num).toInt(),
      licenseExpiringSoon: (json['licenseExpiringSoon'] as num).toInt(),
      licenseExpired: (json['licenseExpired'] as num).toInt(),
      medicalCheckExpiringSoon:
          (json['medicalCheckExpiringSoon'] as num).toInt(),
      medicalCheckExpired: (json['medicalCheckExpired'] as num).toInt(),
    );

Map<String, dynamic> _$DriverStatsToJson(DriverStats instance) =>
    <String, dynamic>{
      'total': instance.total,
      'available': instance.available,
      'busy': instance.busy,
      'onLeave': instance.onLeave,
      'inactive': instance.inactive,
      'licenseExpiringSoon': instance.licenseExpiringSoon,
      'licenseExpired': instance.licenseExpired,
      'medicalCheckExpiringSoon': instance.medicalCheckExpiringSoon,
      'medicalCheckExpired': instance.medicalCheckExpired,
    };

DriverRating _$DriverRatingFromJson(Map<String, dynamic> json) => DriverRating(
      id: json['id'] as String,
      driverId: json['driverId'] as String,
      applicationId: json['applicationId'] as String,
      raterId: json['raterId'] as String,
      raterName: json['raterName'] as String,
      rating: (json['rating'] as num).toDouble(),
      comment: json['comment'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$DriverRatingToJson(DriverRating instance) =>
    <String, dynamic>{
      'id': instance.id,
      'driverId': instance.driverId,
      'applicationId': instance.applicationId,
      'raterId': instance.raterId,
      'raterName': instance.raterName,
      'rating': instance.rating,
      'comment': instance.comment,
      'createdAt': instance.createdAt.toIso8601String(),
    };

CreateDriverRatingRequest _$CreateDriverRatingRequestFromJson(
        Map<String, dynamic> json) =>
    CreateDriverRatingRequest(
      applicationId: json['applicationId'] as String,
      rating: (json['rating'] as num).toDouble(),
      comment: json['comment'] as String?,
    );

Map<String, dynamic> _$CreateDriverRatingRequestToJson(
        CreateDriverRatingRequest instance) =>
    <String, dynamic>{
      'applicationId': instance.applicationId,
      'rating': instance.rating,
      'comment': instance.comment,
    };

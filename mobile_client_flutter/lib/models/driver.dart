import 'package:json_annotation/json_annotation.dart';

part 'driver.g.dart';

/// 驾驶员模型
@JsonSerializable()
class Driver {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String employeeId;
  final String department;
  final DriverStatus status;
  final String licenseNumber;
  final LicenseType licenseType;
  final DateTime licenseExpiry;
  final DateTime? medicalCheckExpiry;
  final int drivingYears;
  final double? rating;
  final int totalTrips;
  final String? avatar;
  final String? remarks;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Driver({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    required this.employeeId,
    required this.department,
    required this.status,
    required this.licenseNumber,
    required this.licenseType,
    required this.licenseExpiry,
    this.medicalCheckExpiry,
    required this.drivingYears,
    this.rating,
    required this.totalTrips,
    this.avatar,
    this.remarks,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Driver.fromJson(Map<String, dynamic> json) => _$DriverFromJson(json);
  Map<String, dynamic> toJson() => _$DriverToJson(this);

  Driver copyWith({
    String? id,
    String? name,
    String? phone,
    String? email,
    String? employeeId,
    String? department,
    DriverStatus? status,
    String? licenseNumber,
    LicenseType? licenseType,
    DateTime? licenseExpiry,
    DateTime? medicalCheckExpiry,
    int? drivingYears,
    double? rating,
    int? totalTrips,
    String? avatar,
    String? remarks,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Driver(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      employeeId: employeeId ?? this.employeeId,
      department: department ?? this.department,
      status: status ?? this.status,
      licenseNumber: licenseNumber ?? this.licenseNumber,
      licenseType: licenseType ?? this.licenseType,
      licenseExpiry: licenseExpiry ?? this.licenseExpiry,
      medicalCheckExpiry: medicalCheckExpiry ?? this.medicalCheckExpiry,
      drivingYears: drivingYears ?? this.drivingYears,
      rating: rating ?? this.rating,
      totalTrips: totalTrips ?? this.totalTrips,
      avatar: avatar ?? this.avatar,
      remarks: remarks ?? this.remarks,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// 检查驾照是否即将过期（30天内）
  bool get isLicenseExpiringSoon {
    final now = DateTime.now();
    final daysUntilExpiry = licenseExpiry.difference(now).inDays;
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }

  /// 检查驾照是否已过期
  bool get isLicenseExpired {
    return DateTime.now().isAfter(licenseExpiry);
  }

  /// 检查体检是否即将过期（30天内）
  bool get isMedicalCheckExpiringSoon {
    if (medicalCheckExpiry == null) return false;
    final now = DateTime.now();
    final daysUntilExpiry = medicalCheckExpiry!.difference(now).inDays;
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }

  /// 检查体检是否已过期
  bool get isMedicalCheckExpired {
    if (medicalCheckExpiry == null) return false;
    return DateTime.now().isAfter(medicalCheckExpiry!);
  }

  /// 检查驾驶员是否可用
  bool get isAvailable {
    return status == DriverStatus.available && 
           !isLicenseExpired && 
           !isMedicalCheckExpired;
  }

  /// 检查驾驶员是否在休假
  bool get isOnLeave {
    return status == DriverStatus.onLeave;
  }

  /// 检查驾驶员是否忙碌
  bool get isBusy {
    return status == DriverStatus.busy;
  }

  /// 检查驾驶员是否停用
  bool get isInactive {
    return status == DriverStatus.inactive;
  }

  /// 获取驾驶经验等级
  String get experienceLevel {
    if (drivingYears < 3) return '新手';
    if (drivingYears < 10) return '熟练';
    return '资深';
  }

  /// 获取评分星级
  int get starRating {
    if (rating == null) return 0;
    return (rating! * 5).round();
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Driver && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Driver{id: $id, name: $name, licenseNumber: $licenseNumber, status: $status}';
  }
}

/// 驾驶员状态枚举
enum DriverStatus {
  @JsonValue('available')
  available,
  @JsonValue('busy')
  busy,
  @JsonValue('on_leave')
  onLeave,
  @JsonValue('inactive')
  inactive,
}

/// 驾驶员状态扩展
extension DriverStatusExtension on DriverStatus {
  String get label {
    switch (this) {
      case DriverStatus.available:
        return '可用';
      case DriverStatus.busy:
        return '忙碌';
      case DriverStatus.onLeave:
        return '休假';
      case DriverStatus.inactive:
        return '停用';
    }
  }

  String get value {
    switch (this) {
      case DriverStatus.available:
        return 'available';
      case DriverStatus.busy:
        return 'busy';
      case DriverStatus.onLeave:
        return 'on_leave';
      case DriverStatus.inactive:
        return 'inactive';
    }
  }

  bool get isAvailable => this == DriverStatus.available;
  bool get isBusy => this == DriverStatus.busy;
  bool get isOnLeave => this == DriverStatus.onLeave;
  bool get isInactive => this == DriverStatus.inactive;
}

/// 驾照类型枚举
enum LicenseType {
  @JsonValue('A1')
  a1,
  @JsonValue('A2')
  a2,
  @JsonValue('A3')
  a3,
  @JsonValue('B1')
  b1,
  @JsonValue('B2')
  b2,
  @JsonValue('C1')
  c1,
  @JsonValue('C2')
  c2,
  @JsonValue('D')
  d,
  @JsonValue('E')
  e,
  @JsonValue('F')
  f,
}

/// 驾照类型扩展
extension LicenseTypeExtension on LicenseType {
  String get label {
    switch (this) {
      case LicenseType.a1:
        return 'A1 - 大型客车';
      case LicenseType.a2:
        return 'A2 - 牵引车';
      case LicenseType.a3:
        return 'A3 - 城市公交车';
      case LicenseType.b1:
        return 'B1 - 中型客车';
      case LicenseType.b2:
        return 'B2 - 大型货车';
      case LicenseType.c1:
        return 'C1 - 小型汽车';
      case LicenseType.c2:
        return 'C2 - 小型自动挡汽车';
      case LicenseType.d:
        return 'D - 普通三轮摩托车';
      case LicenseType.e:
        return 'E - 普通二轮摩托车';
      case LicenseType.f:
        return 'F - 轻便摩托车';
    }
  }

  String get value {
    switch (this) {
      case LicenseType.a1:
        return 'A1';
      case LicenseType.a2:
        return 'A2';
      case LicenseType.a3:
        return 'A3';
      case LicenseType.b1:
        return 'B1';
      case LicenseType.b2:
        return 'B2';
      case LicenseType.c1:
        return 'C1';
      case LicenseType.c2:
        return 'C2';
      case LicenseType.d:
        return 'D';
      case LicenseType.e:
        return 'E';
      case LicenseType.f:
        return 'F';
    }
  }

  String get shortLabel {
    return value;
  }
}

/// 创建驾驶员请求模型
@JsonSerializable()
class CreateDriverRequest {
  final String name;
  final String phone;
  final String? email;
  final String employeeId;
  final String department;
  final String licenseNumber;
  final LicenseType licenseType;
  final DateTime licenseExpiry;
  final DateTime? medicalCheckExpiry;
  final int drivingYears;
  final String? avatar;
  final String? remarks;

  const CreateDriverRequest({
    required this.name,
    required this.phone,
    this.email,
    required this.employeeId,
    required this.department,
    required this.licenseNumber,
    required this.licenseType,
    required this.licenseExpiry,
    this.medicalCheckExpiry,
    required this.drivingYears,
    this.avatar,
    this.remarks,
  });

  factory CreateDriverRequest.fromJson(Map<String, dynamic> json) => _$CreateDriverRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateDriverRequestToJson(this);
}

/// 更新驾驶员请求模型
@JsonSerializable()
class UpdateDriverRequest {
  final String? name;
  final String? phone;
  final String? email;
  final String? employeeId;
  final String? department;
  final DriverStatus? status;
  final String? licenseNumber;
  final LicenseType? licenseType;
  final DateTime? licenseExpiry;
  final DateTime? medicalCheckExpiry;
  final int? drivingYears;
  final String? avatar;
  final String? remarks;

  const UpdateDriverRequest({
    this.name,
    this.phone,
    this.email,
    this.employeeId,
    this.department,
    this.status,
    this.licenseNumber,
    this.licenseType,
    this.licenseExpiry,
    this.medicalCheckExpiry,
    this.drivingYears,
    this.avatar,
    this.remarks,
  });

  factory UpdateDriverRequest.fromJson(Map<String, dynamic> json) => _$UpdateDriverRequestFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateDriverRequestToJson(this);
}

/// 驾驶员统计模型
@JsonSerializable()
class DriverStats {
  final int total;
  final int available;
  final int busy;
  final int onLeave;
  final int inactive;
  final int licenseExpiringSoon;
  final int licenseExpired;
  final int medicalCheckExpiringSoon;
  final int medicalCheckExpired;

  const DriverStats({
    required this.total,
    required this.available,
    required this.busy,
    required this.onLeave,
    required this.inactive,
    required this.licenseExpiringSoon,
    required this.licenseExpired,
    required this.medicalCheckExpiringSoon,
    required this.medicalCheckExpired,
  });

  factory DriverStats.fromJson(Map<String, dynamic> json) => _$DriverStatsFromJson(json);
  Map<String, dynamic> toJson() => _$DriverStatsToJson(this);

  /// 获取可用率
  double get availabilityRate {
    if (total == 0) return 0.0;
    return available / total;
  }

  /// 获取忙碌率
  double get busyRate {
    if (total == 0) return 0.0;
    return busy / total;
  }

  /// 获取需要关注的驾驶员数量（证件即将过期或已过期）
  int get needsAttention {
    return licenseExpiringSoon + licenseExpired + medicalCheckExpiringSoon + medicalCheckExpired;
  }

  /// 获取证件合规率
  double get complianceRate {
    if (total == 0) return 0.0;
    final compliant = total - licenseExpired - medicalCheckExpired;
    return compliant / total;
  }
}

/// 驾驶员评价模型
@JsonSerializable()
class DriverRating {
  final String id;
  final String driverId;
  final String applicationId;
  final String raterId;
  final String raterName;
  final double rating;
  final String? comment;
  final DateTime createdAt;

  const DriverRating({
    required this.id,
    required this.driverId,
    required this.applicationId,
    required this.raterId,
    required this.raterName,
    required this.rating,
    this.comment,
    required this.createdAt,
  });

  factory DriverRating.fromJson(Map<String, dynamic> json) => _$DriverRatingFromJson(json);
  Map<String, dynamic> toJson() => _$DriverRatingToJson(this);

  /// 获取星级评分
  int get starRating {
    return (rating * 5).round();
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is DriverRating && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'DriverRating{id: $id, driverId: $driverId, rating: $rating}';
  }
}

/// 创建驾驶员评价请求模型
@JsonSerializable()
class CreateDriverRatingRequest {
  final String applicationId;
  final double rating;
  final String? comment;

  const CreateDriverRatingRequest({
    required this.applicationId,
    required this.rating,
    this.comment,
  });

  factory CreateDriverRatingRequest.fromJson(Map<String, dynamic> json) => _$CreateDriverRatingRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateDriverRatingRequestToJson(this);
}
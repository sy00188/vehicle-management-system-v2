import 'package:json_annotation/json_annotation.dart';

part 'vehicle.g.dart';

/// 车辆模型
@JsonSerializable()
class Vehicle {
  final String id;
  final String plateNumber;
  final String brand;
  final String model;
  final String color;
  final VehicleType type;
  final VehicleStatus status;
  final int seats;
  final double? mileage;
  final String? fuelType;
  final DateTime? purchaseDate;
  final DateTime? registrationDate;
  final DateTime? insuranceExpiry;
  final DateTime? inspectionExpiry;
  final String? driverId;
  final String? driverName;
  final String? department;
  final String? location;
  final String? description;
  final List<String>? images;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Vehicle({
    required this.id,
    required this.plateNumber,
    required this.brand,
    required this.model,
    required this.color,
    required this.type,
    required this.status,
    required this.seats,
    this.mileage,
    this.fuelType,
    this.purchaseDate,
    this.registrationDate,
    this.insuranceExpiry,
    this.inspectionExpiry,
    this.driverId,
    this.driverName,
    this.department,
    this.location,
    this.description,
    this.images,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) => _$VehicleFromJson(json);
  Map<String, dynamic> toJson() => _$VehicleToJson(this);

  Vehicle copyWith({
    String? id,
    String? plateNumber,
    String? brand,
    String? model,
    String? color,
    VehicleType? type,
    VehicleStatus? status,
    int? seats,
    double? mileage,
    String? fuelType,
    DateTime? purchaseDate,
    DateTime? registrationDate,
    DateTime? insuranceExpiry,
    DateTime? inspectionExpiry,
    String? driverId,
    String? driverName,
    String? department,
    String? location,
    String? description,
    List<String>? images,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Vehicle(
      id: id ?? this.id,
      plateNumber: plateNumber ?? this.plateNumber,
      brand: brand ?? this.brand,
      model: model ?? this.model,
      color: color ?? this.color,
      type: type ?? this.type,
      status: status ?? this.status,
      seats: seats ?? this.seats,
      mileage: mileage ?? this.mileage,
      fuelType: fuelType ?? this.fuelType,
      purchaseDate: purchaseDate ?? this.purchaseDate,
      registrationDate: registrationDate ?? this.registrationDate,
      insuranceExpiry: insuranceExpiry ?? this.insuranceExpiry,
      inspectionExpiry: inspectionExpiry ?? this.inspectionExpiry,
      driverId: driverId ?? this.driverId,
      driverName: driverName ?? this.driverName,
      department: department ?? this.department,
      location: location ?? this.location,
      description: description ?? this.description,
      images: images ?? this.images,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// 获取车辆显示名称
  String get displayName {
    return '$brand $model ($plateNumber)';
  }

  /// 获取车辆主图片
  String? get primaryImage {
    if (images != null && images!.isNotEmpty) {
      return images!.first;
    }
    return null;
  }

  /// 检查保险是否即将过期（30天内）
  bool get isInsuranceExpiringSoon {
    if (insuranceExpiry == null) return false;
    final now = DateTime.now();
    final daysUntilExpiry = insuranceExpiry!.difference(now).inDays;
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }

  /// 检查年检是否即将过期（30天内）
  bool get isInspectionExpiringSoon {
    if (inspectionExpiry == null) return false;
    final now = DateTime.now();
    final daysUntilExpiry = inspectionExpiry!.difference(now).inDays;
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }

  /// 检查保险是否已过期
  bool get isInsuranceExpired {
    if (insuranceExpiry == null) return false;
    return insuranceExpiry!.isBefore(DateTime.now());
  }

  /// 检查年检是否已过期
  bool get isInspectionExpired {
    if (inspectionExpiry == null) return false;
    return inspectionExpiry!.isBefore(DateTime.now());
  }

  /// 检查车辆是否可用
  bool get isAvailable {
    return status == VehicleStatus.available;
  }

  /// 检查车辆是否在使用中
  bool get isInUse {
    return status == VehicleStatus.inUse;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Vehicle && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Vehicle{id: $id, plateNumber: $plateNumber, brand: $brand, model: $model, status: $status}';
  }
}

/// 车辆类型枚举
enum VehicleType {
  @JsonValue('sedan')
  sedan,
  @JsonValue('suv')
  suv,
  @JsonValue('truck')
  truck,
  @JsonValue('van')
  van,
  @JsonValue('bus')
  bus,
  @JsonValue('motorcycle')
  motorcycle,
  @JsonValue('other')
  other,
}

/// 车辆类型扩展
extension VehicleTypeExtension on VehicleType {
  String get label {
    switch (this) {
      case VehicleType.sedan:
        return '轿车';
      case VehicleType.suv:
        return 'SUV';
      case VehicleType.truck:
        return '卡车';
      case VehicleType.van:
        return '面包车';
      case VehicleType.bus:
        return '客车';
      case VehicleType.motorcycle:
        return '摩托车';
      case VehicleType.other:
        return '其他';
    }
  }

  String get value {
    switch (this) {
      case VehicleType.sedan:
        return 'sedan';
      case VehicleType.suv:
        return 'suv';
      case VehicleType.truck:
        return 'truck';
      case VehicleType.van:
        return 'van';
      case VehicleType.bus:
        return 'bus';
      case VehicleType.motorcycle:
        return 'motorcycle';
      case VehicleType.other:
        return 'other';
    }
  }
}

/// 车辆状态枚举
enum VehicleStatus {
  @JsonValue('available')
  available,
  @JsonValue('in_use')
  inUse,
  @JsonValue('maintenance')
  maintenance,
  @JsonValue('repair')
  repair,
  @JsonValue('retired')
  retired,
  @JsonValue('reserved')
  reserved,
}

/// 车辆状态扩展
extension VehicleStatusExtension on VehicleStatus {
  String get label {
    switch (this) {
      case VehicleStatus.available:
        return '可用';
      case VehicleStatus.inUse:
        return '使用中';
      case VehicleStatus.maintenance:
        return '保养中';
      case VehicleStatus.repair:
        return '维修中';
      case VehicleStatus.retired:
        return '已报废';
      case VehicleStatus.reserved:
        return '已预约';
    }
  }

  String get value {
    switch (this) {
      case VehicleStatus.available:
        return 'available';
      case VehicleStatus.inUse:
        return 'in_use';
      case VehicleStatus.maintenance:
        return 'maintenance';
      case VehicleStatus.repair:
        return 'repair';
      case VehicleStatus.retired:
        return 'retired';
      case VehicleStatus.reserved:
        return 'reserved';
    }
  }

  bool get isAvailable => this == VehicleStatus.available;
  bool get isInUse => this == VehicleStatus.inUse;
  bool get isMaintenance => this == VehicleStatus.maintenance;
  bool get isRepair => this == VehicleStatus.repair;
  bool get isRetired => this == VehicleStatus.retired;
  bool get isReserved => this == VehicleStatus.reserved;
}

/// 车辆创建请求模型
@JsonSerializable()
class CreateVehicleRequest {
  final String plateNumber;
  final String brand;
  final String model;
  final String color;
  final VehicleType type;
  final int seats;
  final double? mileage;
  final String? fuelType;
  final DateTime? purchaseDate;
  final DateTime? registrationDate;
  final DateTime? insuranceExpiry;
  final DateTime? inspectionExpiry;
  final String? department;
  final String? location;
  final String? description;
  final List<String>? images;

  const CreateVehicleRequest({
    required this.plateNumber,
    required this.brand,
    required this.model,
    required this.color,
    required this.type,
    required this.seats,
    this.mileage,
    this.fuelType,
    this.purchaseDate,
    this.registrationDate,
    this.insuranceExpiry,
    this.inspectionExpiry,
    this.department,
    this.location,
    this.description,
    this.images,
  });

  factory CreateVehicleRequest.fromJson(Map<String, dynamic> json) => _$CreateVehicleRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateVehicleRequestToJson(this);
}

/// 车辆更新请求模型
@JsonSerializable()
class UpdateVehicleRequest {
  final String? plateNumber;
  final String? brand;
  final String? model;
  final String? color;
  final VehicleType? type;
  final VehicleStatus? status;
  final int? seats;
  final double? mileage;
  final String? fuelType;
  final DateTime? purchaseDate;
  final DateTime? registrationDate;
  final DateTime? insuranceExpiry;
  final DateTime? inspectionExpiry;
  final String? driverId;
  final String? department;
  final String? location;
  final String? description;
  final List<String>? images;

  const UpdateVehicleRequest({
    this.plateNumber,
    this.brand,
    this.model,
    this.color,
    this.type,
    this.status,
    this.seats,
    this.mileage,
    this.fuelType,
    this.purchaseDate,
    this.registrationDate,
    this.insuranceExpiry,
    this.inspectionExpiry,
    this.driverId,
    this.department,
    this.location,
    this.description,
    this.images,
  });

  factory UpdateVehicleRequest.fromJson(Map<String, dynamic> json) => _$UpdateVehicleRequestFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateVehicleRequestToJson(this);
}

/// 车辆统计模型
@JsonSerializable()
class VehicleStats {
  final int total;
  final int available;
  final int inUse;
  final int maintenance;
  final int repair;
  final int retired;
  final int reserved;

  const VehicleStats({
    required this.total,
    required this.available,
    required this.inUse,
    required this.maintenance,
    required this.repair,
    required this.retired,
    required this.reserved,
  });

  factory VehicleStats.fromJson(Map<String, dynamic> json) => _$VehicleStatsFromJson(json);
  Map<String, dynamic> toJson() => _$VehicleStatsToJson(this);

  /// 获取使用率
  double get utilizationRate {
    if (total == 0) return 0.0;
    return (inUse + reserved) / total;
  }

  /// 获取可用率
  double get availabilityRate {
    if (total == 0) return 0.0;
    return available / total;
  }

  /// 获取维护率
  double get maintenanceRate {
    if (total == 0) return 0.0;
    return (maintenance + repair) / total;
  }
}
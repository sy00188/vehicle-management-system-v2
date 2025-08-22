// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'vehicle.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Vehicle _$VehicleFromJson(Map<String, dynamic> json) => Vehicle(
      id: json['id'] as String,
      plateNumber: json['plateNumber'] as String,
      brand: json['brand'] as String,
      model: json['model'] as String,
      color: json['color'] as String,
      type: $enumDecode(_$VehicleTypeEnumMap, json['type']),
      status: $enumDecode(_$VehicleStatusEnumMap, json['status']),
      seats: (json['seats'] as num).toInt(),
      mileage: (json['mileage'] as num?)?.toDouble(),
      fuelType: json['fuelType'] as String?,
      purchaseDate: json['purchaseDate'] == null
          ? null
          : DateTime.parse(json['purchaseDate'] as String),
      registrationDate: json['registrationDate'] == null
          ? null
          : DateTime.parse(json['registrationDate'] as String),
      insuranceExpiry: json['insuranceExpiry'] == null
          ? null
          : DateTime.parse(json['insuranceExpiry'] as String),
      inspectionExpiry: json['inspectionExpiry'] == null
          ? null
          : DateTime.parse(json['inspectionExpiry'] as String),
      driverId: json['driverId'] as String?,
      driverName: json['driverName'] as String?,
      department: json['department'] as String?,
      location: json['location'] as String?,
      description: json['description'] as String?,
      images:
          (json['images'] as List<dynamic>?)?.map((e) => e as String).toList(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$VehicleToJson(Vehicle instance) => <String, dynamic>{
      'id': instance.id,
      'plateNumber': instance.plateNumber,
      'brand': instance.brand,
      'model': instance.model,
      'color': instance.color,
      'type': _$VehicleTypeEnumMap[instance.type]!,
      'status': _$VehicleStatusEnumMap[instance.status]!,
      'seats': instance.seats,
      'mileage': instance.mileage,
      'fuelType': instance.fuelType,
      'purchaseDate': instance.purchaseDate?.toIso8601String(),
      'registrationDate': instance.registrationDate?.toIso8601String(),
      'insuranceExpiry': instance.insuranceExpiry?.toIso8601String(),
      'inspectionExpiry': instance.inspectionExpiry?.toIso8601String(),
      'driverId': instance.driverId,
      'driverName': instance.driverName,
      'department': instance.department,
      'location': instance.location,
      'description': instance.description,
      'images': instance.images,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$VehicleTypeEnumMap = {
  VehicleType.sedan: 'sedan',
  VehicleType.suv: 'suv',
  VehicleType.truck: 'truck',
  VehicleType.van: 'van',
  VehicleType.bus: 'bus',
  VehicleType.motorcycle: 'motorcycle',
  VehicleType.other: 'other',
};

const _$VehicleStatusEnumMap = {
  VehicleStatus.available: 'available',
  VehicleStatus.inUse: 'in_use',
  VehicleStatus.maintenance: 'maintenance',
  VehicleStatus.repair: 'repair',
  VehicleStatus.retired: 'retired',
  VehicleStatus.reserved: 'reserved',
};

CreateVehicleRequest _$CreateVehicleRequestFromJson(
        Map<String, dynamic> json) =>
    CreateVehicleRequest(
      plateNumber: json['plateNumber'] as String,
      brand: json['brand'] as String,
      model: json['model'] as String,
      color: json['color'] as String,
      type: $enumDecode(_$VehicleTypeEnumMap, json['type']),
      seats: (json['seats'] as num).toInt(),
      mileage: (json['mileage'] as num?)?.toDouble(),
      fuelType: json['fuelType'] as String?,
      purchaseDate: json['purchaseDate'] == null
          ? null
          : DateTime.parse(json['purchaseDate'] as String),
      registrationDate: json['registrationDate'] == null
          ? null
          : DateTime.parse(json['registrationDate'] as String),
      insuranceExpiry: json['insuranceExpiry'] == null
          ? null
          : DateTime.parse(json['insuranceExpiry'] as String),
      inspectionExpiry: json['inspectionExpiry'] == null
          ? null
          : DateTime.parse(json['inspectionExpiry'] as String),
      department: json['department'] as String?,
      location: json['location'] as String?,
      description: json['description'] as String?,
      images:
          (json['images'] as List<dynamic>?)?.map((e) => e as String).toList(),
    );

Map<String, dynamic> _$CreateVehicleRequestToJson(
        CreateVehicleRequest instance) =>
    <String, dynamic>{
      'plateNumber': instance.plateNumber,
      'brand': instance.brand,
      'model': instance.model,
      'color': instance.color,
      'type': _$VehicleTypeEnumMap[instance.type]!,
      'seats': instance.seats,
      'mileage': instance.mileage,
      'fuelType': instance.fuelType,
      'purchaseDate': instance.purchaseDate?.toIso8601String(),
      'registrationDate': instance.registrationDate?.toIso8601String(),
      'insuranceExpiry': instance.insuranceExpiry?.toIso8601String(),
      'inspectionExpiry': instance.inspectionExpiry?.toIso8601String(),
      'department': instance.department,
      'location': instance.location,
      'description': instance.description,
      'images': instance.images,
    };

UpdateVehicleRequest _$UpdateVehicleRequestFromJson(
        Map<String, dynamic> json) =>
    UpdateVehicleRequest(
      plateNumber: json['plateNumber'] as String?,
      brand: json['brand'] as String?,
      model: json['model'] as String?,
      color: json['color'] as String?,
      type: $enumDecodeNullable(_$VehicleTypeEnumMap, json['type']),
      status: $enumDecodeNullable(_$VehicleStatusEnumMap, json['status']),
      seats: (json['seats'] as num?)?.toInt(),
      mileage: (json['mileage'] as num?)?.toDouble(),
      fuelType: json['fuelType'] as String?,
      purchaseDate: json['purchaseDate'] == null
          ? null
          : DateTime.parse(json['purchaseDate'] as String),
      registrationDate: json['registrationDate'] == null
          ? null
          : DateTime.parse(json['registrationDate'] as String),
      insuranceExpiry: json['insuranceExpiry'] == null
          ? null
          : DateTime.parse(json['insuranceExpiry'] as String),
      inspectionExpiry: json['inspectionExpiry'] == null
          ? null
          : DateTime.parse(json['inspectionExpiry'] as String),
      driverId: json['driverId'] as String?,
      department: json['department'] as String?,
      location: json['location'] as String?,
      description: json['description'] as String?,
      images:
          (json['images'] as List<dynamic>?)?.map((e) => e as String).toList(),
    );

Map<String, dynamic> _$UpdateVehicleRequestToJson(
        UpdateVehicleRequest instance) =>
    <String, dynamic>{
      'plateNumber': instance.plateNumber,
      'brand': instance.brand,
      'model': instance.model,
      'color': instance.color,
      'type': _$VehicleTypeEnumMap[instance.type],
      'status': _$VehicleStatusEnumMap[instance.status],
      'seats': instance.seats,
      'mileage': instance.mileage,
      'fuelType': instance.fuelType,
      'purchaseDate': instance.purchaseDate?.toIso8601String(),
      'registrationDate': instance.registrationDate?.toIso8601String(),
      'insuranceExpiry': instance.insuranceExpiry?.toIso8601String(),
      'inspectionExpiry': instance.inspectionExpiry?.toIso8601String(),
      'driverId': instance.driverId,
      'department': instance.department,
      'location': instance.location,
      'description': instance.description,
      'images': instance.images,
    };

VehicleStats _$VehicleStatsFromJson(Map<String, dynamic> json) => VehicleStats(
      total: (json['total'] as num).toInt(),
      available: (json['available'] as num).toInt(),
      inUse: (json['inUse'] as num).toInt(),
      maintenance: (json['maintenance'] as num).toInt(),
      repair: (json['repair'] as num).toInt(),
      retired: (json['retired'] as num).toInt(),
      reserved: (json['reserved'] as num).toInt(),
    );

Map<String, dynamic> _$VehicleStatsToJson(VehicleStats instance) =>
    <String, dynamic>{
      'total': instance.total,
      'available': instance.available,
      'inUse': instance.inUse,
      'maintenance': instance.maintenance,
      'repair': instance.repair,
      'retired': instance.retired,
      'reserved': instance.reserved,
    };

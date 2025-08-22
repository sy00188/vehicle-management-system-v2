// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'maintenance.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MaintenanceRecord _$MaintenanceRecordFromJson(Map<String, dynamic> json) =>
    MaintenanceRecord(
      id: json['id'] as String,
      vehicleId: json['vehicleId'] as String,
      vehiclePlateNumber: json['vehiclePlateNumber'] as String,
      type: $enumDecode(_$MaintenanceTypeEnumMap, json['type']),
      status: $enumDecode(_$MaintenanceStatusEnumMap, json['status']),
      description: json['description'] as String,
      serviceProvider: json['serviceProvider'] as String?,
      technician: json['technician'] as String?,
      cost: (json['cost'] as num?)?.toDouble(),
      scheduledDate: DateTime.parse(json['scheduledDate'] as String),
      completedDate: json['completedDate'] == null
          ? null
          : DateTime.parse(json['completedDate'] as String),
      mileage: (json['mileage'] as num?)?.toInt(),
      location: json['location'] as String?,
      items: (json['items'] as List<dynamic>).map((e) => e as String).toList(),
      attachments: (json['attachments'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      remarks: json['remarks'] as String?,
      createdBy: json['createdBy'] as String,
      createdByName: json['createdByName'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$MaintenanceRecordToJson(MaintenanceRecord instance) =>
    <String, dynamic>{
      'id': instance.id,
      'vehicleId': instance.vehicleId,
      'vehiclePlateNumber': instance.vehiclePlateNumber,
      'type': _$MaintenanceTypeEnumMap[instance.type]!,
      'status': _$MaintenanceStatusEnumMap[instance.status]!,
      'description': instance.description,
      'serviceProvider': instance.serviceProvider,
      'technician': instance.technician,
      'cost': instance.cost,
      'scheduledDate': instance.scheduledDate.toIso8601String(),
      'completedDate': instance.completedDate?.toIso8601String(),
      'mileage': instance.mileage,
      'location': instance.location,
      'items': instance.items,
      'attachments': instance.attachments,
      'remarks': instance.remarks,
      'createdBy': instance.createdBy,
      'createdByName': instance.createdByName,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$MaintenanceTypeEnumMap = {
  MaintenanceType.routine: 'routine',
  MaintenanceType.repair: 'repair',
  MaintenanceType.inspection: 'inspection',
  MaintenanceType.emergency: 'emergency',
  MaintenanceType.upgrade: 'upgrade',
};

const _$MaintenanceStatusEnumMap = {
  MaintenanceStatus.scheduled: 'scheduled',
  MaintenanceStatus.inProgress: 'in_progress',
  MaintenanceStatus.completed: 'completed',
  MaintenanceStatus.cancelled: 'cancelled',
};

CreateMaintenanceRequest _$CreateMaintenanceRequestFromJson(
        Map<String, dynamic> json) =>
    CreateMaintenanceRequest(
      vehicleId: json['vehicleId'] as String,
      type: $enumDecode(_$MaintenanceTypeEnumMap, json['type']),
      description: json['description'] as String,
      serviceProvider: json['serviceProvider'] as String?,
      technician: json['technician'] as String?,
      cost: (json['cost'] as num?)?.toDouble(),
      scheduledDate: DateTime.parse(json['scheduledDate'] as String),
      mileage: (json['mileage'] as num?)?.toInt(),
      location: json['location'] as String?,
      items: (json['items'] as List<dynamic>).map((e) => e as String).toList(),
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$CreateMaintenanceRequestToJson(
        CreateMaintenanceRequest instance) =>
    <String, dynamic>{
      'vehicleId': instance.vehicleId,
      'type': _$MaintenanceTypeEnumMap[instance.type]!,
      'description': instance.description,
      'serviceProvider': instance.serviceProvider,
      'technician': instance.technician,
      'cost': instance.cost,
      'scheduledDate': instance.scheduledDate.toIso8601String(),
      'mileage': instance.mileage,
      'location': instance.location,
      'items': instance.items,
      'remarks': instance.remarks,
    };

UpdateMaintenanceRequest _$UpdateMaintenanceRequestFromJson(
        Map<String, dynamic> json) =>
    UpdateMaintenanceRequest(
      type: $enumDecodeNullable(_$MaintenanceTypeEnumMap, json['type']),
      status: $enumDecodeNullable(_$MaintenanceStatusEnumMap, json['status']),
      description: json['description'] as String?,
      serviceProvider: json['serviceProvider'] as String?,
      technician: json['technician'] as String?,
      cost: (json['cost'] as num?)?.toDouble(),
      scheduledDate: json['scheduledDate'] == null
          ? null
          : DateTime.parse(json['scheduledDate'] as String),
      completedDate: json['completedDate'] == null
          ? null
          : DateTime.parse(json['completedDate'] as String),
      mileage: (json['mileage'] as num?)?.toInt(),
      location: json['location'] as String?,
      items:
          (json['items'] as List<dynamic>?)?.map((e) => e as String).toList(),
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$UpdateMaintenanceRequestToJson(
        UpdateMaintenanceRequest instance) =>
    <String, dynamic>{
      'type': _$MaintenanceTypeEnumMap[instance.type],
      'status': _$MaintenanceStatusEnumMap[instance.status],
      'description': instance.description,
      'serviceProvider': instance.serviceProvider,
      'technician': instance.technician,
      'cost': instance.cost,
      'scheduledDate': instance.scheduledDate?.toIso8601String(),
      'completedDate': instance.completedDate?.toIso8601String(),
      'mileage': instance.mileage,
      'location': instance.location,
      'items': instance.items,
      'remarks': instance.remarks,
    };

MaintenanceStats _$MaintenanceStatsFromJson(Map<String, dynamic> json) =>
    MaintenanceStats(
      total: (json['total'] as num).toInt(),
      scheduled: (json['scheduled'] as num).toInt(),
      inProgress: (json['inProgress'] as num).toInt(),
      completed: (json['completed'] as num).toInt(),
      cancelled: (json['cancelled'] as num).toInt(),
      overdue: (json['overdue'] as num).toInt(),
      dueSoon: (json['dueSoon'] as num).toInt(),
      totalCost: (json['totalCost'] as num).toDouble(),
      averageCost: (json['averageCost'] as num).toDouble(),
    );

Map<String, dynamic> _$MaintenanceStatsToJson(MaintenanceStats instance) =>
    <String, dynamic>{
      'total': instance.total,
      'scheduled': instance.scheduled,
      'inProgress': instance.inProgress,
      'completed': instance.completed,
      'cancelled': instance.cancelled,
      'overdue': instance.overdue,
      'dueSoon': instance.dueSoon,
      'totalCost': instance.totalCost,
      'averageCost': instance.averageCost,
    };

MaintenanceItem _$MaintenanceItemFromJson(Map<String, dynamic> json) =>
    MaintenanceItem(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      category: json['category'] as String?,
      standardCost: (json['standardCost'] as num?)?.toDouble(),
      standardDuration: (json['standardDuration'] as num?)?.toInt(),
      isActive: json['isActive'] as bool,
    );

Map<String, dynamic> _$MaintenanceItemToJson(MaintenanceItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'category': instance.category,
      'standardCost': instance.standardCost,
      'standardDuration': instance.standardDuration,
      'isActive': instance.isActive,
    };

MaintenanceReminder _$MaintenanceReminderFromJson(Map<String, dynamic> json) =>
    MaintenanceReminder(
      id: json['id'] as String,
      vehicleId: json['vehicleId'] as String,
      vehiclePlateNumber: json['vehiclePlateNumber'] as String,
      type: $enumDecode(_$MaintenanceTypeEnumMap, json['type']),
      description: json['description'] as String,
      dueDate: DateTime.parse(json['dueDate'] as String),
      dueMileage: (json['dueMileage'] as num?)?.toInt(),
      isActive: json['isActive'] as bool,
      lastNotified: json['lastNotified'] == null
          ? null
          : DateTime.parse(json['lastNotified'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$MaintenanceReminderToJson(
        MaintenanceReminder instance) =>
    <String, dynamic>{
      'id': instance.id,
      'vehicleId': instance.vehicleId,
      'vehiclePlateNumber': instance.vehiclePlateNumber,
      'type': _$MaintenanceTypeEnumMap[instance.type]!,
      'description': instance.description,
      'dueDate': instance.dueDate.toIso8601String(),
      'dueMileage': instance.dueMileage,
      'isActive': instance.isActive,
      'lastNotified': instance.lastNotified?.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
    };

MaintenancePlan _$MaintenancePlanFromJson(Map<String, dynamic> json) =>
    MaintenancePlan(
      id: json['id'] as String,
      vehicleId: json['vehicleId'] as String,
      vehiclePlateNumber: json['vehiclePlateNumber'] as String,
      type: $enumDecode(_$MaintenanceTypeEnumMap, json['type']),
      description: json['description'] as String,
      intervalDays: (json['intervalDays'] as num).toInt(),
      intervalMileage: (json['intervalMileage'] as num?)?.toInt(),
      nextDueDate: DateTime.parse(json['nextDueDate'] as String),
      nextDueMileage: (json['nextDueMileage'] as num?)?.toInt(),
      isActive: json['isActive'] as bool,
      serviceProvider: json['serviceProvider'] as String?,
      items: (json['items'] as List<dynamic>).map((e) => e as String).toList(),
      remarks: json['remarks'] as String?,
      createdBy: json['createdBy'] as String,
      createdByName: json['createdByName'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$MaintenancePlanToJson(MaintenancePlan instance) =>
    <String, dynamic>{
      'id': instance.id,
      'vehicleId': instance.vehicleId,
      'vehiclePlateNumber': instance.vehiclePlateNumber,
      'type': _$MaintenanceTypeEnumMap[instance.type]!,
      'description': instance.description,
      'intervalDays': instance.intervalDays,
      'intervalMileage': instance.intervalMileage,
      'nextDueDate': instance.nextDueDate.toIso8601String(),
      'nextDueMileage': instance.nextDueMileage,
      'isActive': instance.isActive,
      'serviceProvider': instance.serviceProvider,
      'items': instance.items,
      'remarks': instance.remarks,
      'createdBy': instance.createdBy,
      'createdByName': instance.createdByName,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

CreateMaintenancePlanRequest _$CreateMaintenancePlanRequestFromJson(
        Map<String, dynamic> json) =>
    CreateMaintenancePlanRequest(
      vehicleId: json['vehicleId'] as String,
      type: $enumDecode(_$MaintenanceTypeEnumMap, json['type']),
      description: json['description'] as String,
      intervalDays: (json['intervalDays'] as num).toInt(),
      intervalMileage: (json['intervalMileage'] as num?)?.toInt(),
      nextDueDate: DateTime.parse(json['nextDueDate'] as String),
      nextDueMileage: (json['nextDueMileage'] as num?)?.toInt(),
      serviceProvider: json['serviceProvider'] as String?,
      items: (json['items'] as List<dynamic>).map((e) => e as String).toList(),
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$CreateMaintenancePlanRequestToJson(
        CreateMaintenancePlanRequest instance) =>
    <String, dynamic>{
      'vehicleId': instance.vehicleId,
      'type': _$MaintenanceTypeEnumMap[instance.type]!,
      'description': instance.description,
      'intervalDays': instance.intervalDays,
      'intervalMileage': instance.intervalMileage,
      'nextDueDate': instance.nextDueDate.toIso8601String(),
      'nextDueMileage': instance.nextDueMileage,
      'serviceProvider': instance.serviceProvider,
      'items': instance.items,
      'remarks': instance.remarks,
    };

CreateMaintenanceReminderRequest _$CreateMaintenanceReminderRequestFromJson(
        Map<String, dynamic> json) =>
    CreateMaintenanceReminderRequest(
      vehicleId: json['vehicleId'] as String,
      type: $enumDecode(_$MaintenanceTypeEnumMap, json['type']),
      description: json['description'] as String,
      dueDate: DateTime.parse(json['dueDate'] as String),
      dueMileage: (json['dueMileage'] as num?)?.toInt(),
    );

Map<String, dynamic> _$CreateMaintenanceReminderRequestToJson(
        CreateMaintenanceReminderRequest instance) =>
    <String, dynamic>{
      'vehicleId': instance.vehicleId,
      'type': _$MaintenanceTypeEnumMap[instance.type]!,
      'description': instance.description,
      'dueDate': instance.dueDate.toIso8601String(),
      'dueMileage': instance.dueMileage,
    };

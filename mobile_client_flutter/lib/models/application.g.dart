// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'application.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VehicleApplication _$VehicleApplicationFromJson(Map<String, dynamic> json) =>
    VehicleApplication(
      id: json['id'] as String,
      applicantId: json['applicantId'] as String,
      applicantName: json['applicantName'] as String,
      department: json['department'] as String,
      vehicleId: json['vehicleId'] as String?,
      vehiclePlateNumber: json['vehiclePlateNumber'] as String?,
      driverId: json['driverId'] as String?,
      driverName: json['driverName'] as String?,
      type: $enumDecode(_$ApplicationTypeEnumMap, json['type']),
      status: $enumDecode(_$ApplicationStatusEnumMap, json['status']),
      purpose: json['purpose'] as String,
      destination: json['destination'] as String,
      passengers: (json['passengers'] as num).toInt(),
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      remarks: json['remarks'] as String?,
      approvals: (json['approvals'] as List<dynamic>)
          .map((e) => ApplicationApproval.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      approvedAt: json['approvedAt'] == null
          ? null
          : DateTime.parse(json['approvedAt'] as String),
      rejectedAt: json['rejectedAt'] == null
          ? null
          : DateTime.parse(json['rejectedAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
    );

Map<String, dynamic> _$VehicleApplicationToJson(VehicleApplication instance) =>
    <String, dynamic>{
      'id': instance.id,
      'applicantId': instance.applicantId,
      'applicantName': instance.applicantName,
      'department': instance.department,
      'vehicleId': instance.vehicleId,
      'vehiclePlateNumber': instance.vehiclePlateNumber,
      'driverId': instance.driverId,
      'driverName': instance.driverName,
      'type': _$ApplicationTypeEnumMap[instance.type]!,
      'status': _$ApplicationStatusEnumMap[instance.status]!,
      'purpose': instance.purpose,
      'destination': instance.destination,
      'passengers': instance.passengers,
      'startTime': instance.startTime.toIso8601String(),
      'endTime': instance.endTime.toIso8601String(),
      'remarks': instance.remarks,
      'approvals': instance.approvals,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'approvedAt': instance.approvedAt?.toIso8601String(),
      'rejectedAt': instance.rejectedAt?.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
    };

const _$ApplicationTypeEnumMap = {
  ApplicationType.business: 'business',
  ApplicationType.personal: 'personal',
  ApplicationType.emergency: 'emergency',
  ApplicationType.maintenance: 'maintenance',
};

const _$ApplicationStatusEnumMap = {
  ApplicationStatus.pending: 'pending',
  ApplicationStatus.approved: 'approved',
  ApplicationStatus.rejected: 'rejected',
  ApplicationStatus.cancelled: 'cancelled',
  ApplicationStatus.inProgress: 'in_progress',
  ApplicationStatus.completed: 'completed',
};

ApplicationApproval _$ApplicationApprovalFromJson(Map<String, dynamic> json) =>
    ApplicationApproval(
      id: json['id'] as String,
      applicationId: json['applicationId'] as String,
      approverId: json['approverId'] as String,
      approverName: json['approverName'] as String,
      approverRole: json['approverRole'] as String,
      status: $enumDecode(_$ApprovalStatusEnumMap, json['status']),
      comments: json['comments'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      processedAt: json['processedAt'] == null
          ? null
          : DateTime.parse(json['processedAt'] as String),
      step: (json['step'] as num).toInt(),
    );

Map<String, dynamic> _$ApplicationApprovalToJson(
        ApplicationApproval instance) =>
    <String, dynamic>{
      'id': instance.id,
      'applicationId': instance.applicationId,
      'approverId': instance.approverId,
      'approverName': instance.approverName,
      'approverRole': instance.approverRole,
      'status': _$ApprovalStatusEnumMap[instance.status]!,
      'comments': instance.comments,
      'createdAt': instance.createdAt.toIso8601String(),
      'processedAt': instance.processedAt?.toIso8601String(),
      'step': instance.step,
    };

const _$ApprovalStatusEnumMap = {
  ApprovalStatus.pending: 'pending',
  ApprovalStatus.approved: 'approved',
  ApprovalStatus.rejected: 'rejected',
};

CreateApplicationRequest _$CreateApplicationRequestFromJson(
        Map<String, dynamic> json) =>
    CreateApplicationRequest(
      vehicleId: json['vehicleId'] as String?,
      driverId: json['driverId'] as String?,
      type: $enumDecode(_$ApplicationTypeEnumMap, json['type']),
      purpose: json['purpose'] as String,
      destination: json['destination'] as String,
      passengers: (json['passengers'] as num).toInt(),
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$CreateApplicationRequestToJson(
        CreateApplicationRequest instance) =>
    <String, dynamic>{
      'vehicleId': instance.vehicleId,
      'driverId': instance.driverId,
      'type': _$ApplicationTypeEnumMap[instance.type]!,
      'purpose': instance.purpose,
      'destination': instance.destination,
      'passengers': instance.passengers,
      'startTime': instance.startTime.toIso8601String(),
      'endTime': instance.endTime.toIso8601String(),
      'remarks': instance.remarks,
    };

UpdateApplicationRequest _$UpdateApplicationRequestFromJson(
        Map<String, dynamic> json) =>
    UpdateApplicationRequest(
      vehicleId: json['vehicleId'] as String?,
      driverId: json['driverId'] as String?,
      type: $enumDecodeNullable(_$ApplicationTypeEnumMap, json['type']),
      purpose: json['purpose'] as String?,
      destination: json['destination'] as String?,
      passengers: (json['passengers'] as num?)?.toInt(),
      startTime: json['startTime'] == null
          ? null
          : DateTime.parse(json['startTime'] as String),
      endTime: json['endTime'] == null
          ? null
          : DateTime.parse(json['endTime'] as String),
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$UpdateApplicationRequestToJson(
        UpdateApplicationRequest instance) =>
    <String, dynamic>{
      'vehicleId': instance.vehicleId,
      'driverId': instance.driverId,
      'type': _$ApplicationTypeEnumMap[instance.type],
      'purpose': instance.purpose,
      'destination': instance.destination,
      'passengers': instance.passengers,
      'startTime': instance.startTime?.toIso8601String(),
      'endTime': instance.endTime?.toIso8601String(),
      'remarks': instance.remarks,
    };

ApprovalRequest _$ApprovalRequestFromJson(Map<String, dynamic> json) =>
    ApprovalRequest(
      status: $enumDecode(_$ApprovalStatusEnumMap, json['status']),
      comments: json['comments'] as String?,
    );

Map<String, dynamic> _$ApprovalRequestToJson(ApprovalRequest instance) =>
    <String, dynamic>{
      'status': _$ApprovalStatusEnumMap[instance.status]!,
      'comments': instance.comments,
    };

ApplicationStats _$ApplicationStatsFromJson(Map<String, dynamic> json) =>
    ApplicationStats(
      total: (json['total'] as num).toInt(),
      pending: (json['pending'] as num).toInt(),
      approved: (json['approved'] as num).toInt(),
      rejected: (json['rejected'] as num).toInt(),
      cancelled: (json['cancelled'] as num).toInt(),
      inProgress: (json['inProgress'] as num).toInt(),
      completed: (json['completed'] as num).toInt(),
    );

Map<String, dynamic> _$ApplicationStatsToJson(ApplicationStats instance) =>
    <String, dynamic>{
      'total': instance.total,
      'pending': instance.pending,
      'approved': instance.approved,
      'rejected': instance.rejected,
      'cancelled': instance.cancelled,
      'inProgress': instance.inProgress,
      'completed': instance.completed,
    };

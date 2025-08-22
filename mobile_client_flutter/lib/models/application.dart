import 'package:json_annotation/json_annotation.dart';

part 'application.g.dart';

/// 车辆申请模型
@JsonSerializable()
class VehicleApplication {
  final String id;
  final String applicantId;
  final String applicantName;
  final String department;
  final String? vehicleId;
  final String? vehiclePlateNumber;
  final String? driverId;
  final String? driverName;
  final ApplicationType type;
  final ApplicationStatus status;
  final String purpose;
  final String destination;
  final int passengers;
  final DateTime startTime;
  final DateTime endTime;
  final String? remarks;
  final List<ApplicationApproval> approvals;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? approvedAt;
  final DateTime? rejectedAt;
  final DateTime? completedAt;

  const VehicleApplication({
    required this.id,
    required this.applicantId,
    required this.applicantName,
    required this.department,
    this.vehicleId,
    this.vehiclePlateNumber,
    this.driverId,
    this.driverName,
    required this.type,
    required this.status,
    required this.purpose,
    required this.destination,
    required this.passengers,
    required this.startTime,
    required this.endTime,
    this.remarks,
    required this.approvals,
    required this.createdAt,
    required this.updatedAt,
    this.approvedAt,
    this.rejectedAt,
    this.completedAt,
  });

  factory VehicleApplication.fromJson(Map<String, dynamic> json) => _$VehicleApplicationFromJson(json);
  Map<String, dynamic> toJson() => _$VehicleApplicationToJson(this);

  VehicleApplication copyWith({
    String? id,
    String? applicantId,
    String? applicantName,
    String? department,
    String? vehicleId,
    String? vehiclePlateNumber,
    String? driverId,
    String? driverName,
    ApplicationType? type,
    ApplicationStatus? status,
    String? purpose,
    String? destination,
    int? passengers,
    DateTime? startTime,
    DateTime? endTime,
    String? remarks,
    List<ApplicationApproval>? approvals,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? approvedAt,
    DateTime? rejectedAt,
    DateTime? completedAt,
  }) {
    return VehicleApplication(
      id: id ?? this.id,
      applicantId: applicantId ?? this.applicantId,
      applicantName: applicantName ?? this.applicantName,
      department: department ?? this.department,
      vehicleId: vehicleId ?? this.vehicleId,
      vehiclePlateNumber: vehiclePlateNumber ?? this.vehiclePlateNumber,
      driverId: driverId ?? this.driverId,
      driverName: driverName ?? this.driverName,
      type: type ?? this.type,
      status: status ?? this.status,
      purpose: purpose ?? this.purpose,
      destination: destination ?? this.destination,
      passengers: passengers ?? this.passengers,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      remarks: remarks ?? this.remarks,
      approvals: approvals ?? this.approvals,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      approvedAt: approvedAt ?? this.approvedAt,
      rejectedAt: rejectedAt ?? this.rejectedAt,
      completedAt: completedAt ?? this.completedAt,
    );
  }

  /// 获取申请持续时间（小时）
  double get durationInHours {
    return endTime.difference(startTime).inMinutes / 60.0;
  }

  /// 获取申请持续天数
  int get durationInDays {
    return endTime.difference(startTime).inDays + 1;
  }

  /// 检查申请是否可以取消
  bool get canCancel {
    return status == ApplicationStatus.pending || status == ApplicationStatus.approved;
  }

  /// 检查申请是否可以编辑
  bool get canEdit {
    return status == ApplicationStatus.pending;
  }

  /// 检查申请是否需要审批
  bool get needsApproval {
    return status == ApplicationStatus.pending;
  }

  /// 检查申请是否已完成
  bool get isCompleted {
    return status == ApplicationStatus.completed;
  }

  /// 检查申请是否已被拒绝
  bool get isRejected {
    return status == ApplicationStatus.rejected;
  }

  /// 检查申请是否已被取消
  bool get isCancelled {
    return status == ApplicationStatus.cancelled;
  }

  /// 检查申请是否紧急
  bool get isUrgent {
    return type == ApplicationType.emergency;
  }

  /// 获取当前审批步骤
  ApplicationApproval? get currentApproval {
    return approvals.where((approval) => approval.status == ApprovalStatus.pending).firstOrNull;
  }

  /// 获取最后一个审批步骤
  ApplicationApproval? get lastApproval {
    if (approvals.isEmpty) return null;
    return approvals.last;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is VehicleApplication && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'VehicleApplication{id: $id, applicantName: $applicantName, purpose: $purpose, status: $status}';
  }
}

/// 申请类型枚举
enum ApplicationType {
  @JsonValue('business')
  business,
  @JsonValue('personal')
  personal,
  @JsonValue('emergency')
  emergency,
  @JsonValue('maintenance')
  maintenance,
}

/// 申请类型扩展
extension ApplicationTypeExtension on ApplicationType {
  String get label {
    switch (this) {
      case ApplicationType.business:
        return '公务用车';
      case ApplicationType.personal:
        return '个人用车';
      case ApplicationType.emergency:
        return '紧急用车';
      case ApplicationType.maintenance:
        return '维护用车';
    }
  }

  String get value {
    switch (this) {
      case ApplicationType.business:
        return 'business';
      case ApplicationType.personal:
        return 'personal';
      case ApplicationType.emergency:
        return 'emergency';
      case ApplicationType.maintenance:
        return 'maintenance';
    }
  }
}

/// 申请状态枚举
enum ApplicationStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('approved')
  approved,
  @JsonValue('rejected')
  rejected,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
}

/// 申请状态扩展
extension ApplicationStatusExtension on ApplicationStatus {
  String get label {
    switch (this) {
      case ApplicationStatus.pending:
        return '待审批';
      case ApplicationStatus.approved:
        return '已批准';
      case ApplicationStatus.rejected:
        return '已拒绝';
      case ApplicationStatus.cancelled:
        return '已取消';
      case ApplicationStatus.inProgress:
        return '进行中';
      case ApplicationStatus.completed:
        return '已完成';
    }
  }

  String get value {
    switch (this) {
      case ApplicationStatus.pending:
        return 'pending';
      case ApplicationStatus.approved:
        return 'approved';
      case ApplicationStatus.rejected:
        return 'rejected';
      case ApplicationStatus.cancelled:
        return 'cancelled';
      case ApplicationStatus.inProgress:
        return 'in_progress';
      case ApplicationStatus.completed:
        return 'completed';
    }
  }

  bool get isPending => this == ApplicationStatus.pending;
  bool get isApproved => this == ApplicationStatus.approved;
  bool get isRejected => this == ApplicationStatus.rejected;
  bool get isCancelled => this == ApplicationStatus.cancelled;
  bool get isInProgress => this == ApplicationStatus.inProgress;
  bool get isCompleted => this == ApplicationStatus.completed;
}

/// 审批记录模型
@JsonSerializable()
class ApplicationApproval {
  final String id;
  final String applicationId;
  final String approverId;
  final String approverName;
  final String approverRole;
  final ApprovalStatus status;
  final String? comments;
  final DateTime createdAt;
  final DateTime? processedAt;
  final int step;

  const ApplicationApproval({
    required this.id,
    required this.applicationId,
    required this.approverId,
    required this.approverName,
    required this.approverRole,
    required this.status,
    this.comments,
    required this.createdAt,
    this.processedAt,
    required this.step,
  });

  factory ApplicationApproval.fromJson(Map<String, dynamic> json) => _$ApplicationApprovalFromJson(json);
  Map<String, dynamic> toJson() => _$ApplicationApprovalToJson(this);

  ApplicationApproval copyWith({
    String? id,
    String? applicationId,
    String? approverId,
    String? approverName,
    String? approverRole,
    ApprovalStatus? status,
    String? comments,
    DateTime? createdAt,
    DateTime? processedAt,
    int? step,
  }) {
    return ApplicationApproval(
      id: id ?? this.id,
      applicationId: applicationId ?? this.applicationId,
      approverId: approverId ?? this.approverId,
      approverName: approverName ?? this.approverName,
      approverRole: approverRole ?? this.approverRole,
      status: status ?? this.status,
      comments: comments ?? this.comments,
      createdAt: createdAt ?? this.createdAt,
      processedAt: processedAt ?? this.processedAt,
      step: step ?? this.step,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ApplicationApproval && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'ApplicationApproval{id: $id, approverName: $approverName, status: $status, step: $step}';
  }
}

/// 审批状态枚举
enum ApprovalStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('approved')
  approved,
  @JsonValue('rejected')
  rejected,
}

/// 审批状态扩展
extension ApprovalStatusExtension on ApprovalStatus {
  String get label {
    switch (this) {
      case ApprovalStatus.pending:
        return '待处理';
      case ApprovalStatus.approved:
        return '已批准';
      case ApprovalStatus.rejected:
        return '已拒绝';
    }
  }

  String get value {
    switch (this) {
      case ApprovalStatus.pending:
        return 'pending';
      case ApprovalStatus.approved:
        return 'approved';
      case ApprovalStatus.rejected:
        return 'rejected';
    }
  }

  bool get isPending => this == ApprovalStatus.pending;
  bool get isApproved => this == ApprovalStatus.approved;
  bool get isRejected => this == ApprovalStatus.rejected;
}

/// 创建申请请求模型
@JsonSerializable()
class CreateApplicationRequest {
  final String? vehicleId;
  final String? driverId;
  final ApplicationType type;
  final String purpose;
  final String destination;
  final int passengers;
  final DateTime startTime;
  final DateTime endTime;
  final String? remarks;

  const CreateApplicationRequest({
    this.vehicleId,
    this.driverId,
    required this.type,
    required this.purpose,
    required this.destination,
    required this.passengers,
    required this.startTime,
    required this.endTime,
    this.remarks,
  });

  factory CreateApplicationRequest.fromJson(Map<String, dynamic> json) => _$CreateApplicationRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateApplicationRequestToJson(this);
}

/// 更新申请请求模型
@JsonSerializable()
class UpdateApplicationRequest {
  final String? vehicleId;
  final String? driverId;
  final ApplicationType? type;
  final String? purpose;
  final String? destination;
  final int? passengers;
  final DateTime? startTime;
  final DateTime? endTime;
  final String? remarks;

  const UpdateApplicationRequest({
    this.vehicleId,
    this.driverId,
    this.type,
    this.purpose,
    this.destination,
    this.passengers,
    this.startTime,
    this.endTime,
    this.remarks,
  });

  factory UpdateApplicationRequest.fromJson(Map<String, dynamic> json) => _$UpdateApplicationRequestFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateApplicationRequestToJson(this);
}

/// 审批请求模型
@JsonSerializable()
class ApprovalRequest {
  final ApprovalStatus status;
  final String? comments;

  const ApprovalRequest({
    required this.status,
    this.comments,
  });

  factory ApprovalRequest.fromJson(Map<String, dynamic> json) => _$ApprovalRequestFromJson(json);
  Map<String, dynamic> toJson() => _$ApprovalRequestToJson(this);
}

/// 申请统计模型
@JsonSerializable()
class ApplicationStats {
  final int total;
  final int pending;
  final int approved;
  final int rejected;
  final int cancelled;
  final int inProgress;
  final int completed;

  const ApplicationStats({
    required this.total,
    required this.pending,
    required this.approved,
    required this.rejected,
    required this.cancelled,
    required this.inProgress,
    required this.completed,
  });

  factory ApplicationStats.fromJson(Map<String, dynamic> json) => _$ApplicationStatsFromJson(json);
  Map<String, dynamic> toJson() => _$ApplicationStatsToJson(this);

  /// 获取审批通过率
  double get approvalRate {
    final processed = approved + rejected;
    if (processed == 0) return 0.0;
    return approved / processed;
  }

  /// 获取完成率
  double get completionRate {
    if (total == 0) return 0.0;
    return completed / total;
  }

  /// 获取待处理率
  double get pendingRate {
    if (total == 0) return 0.0;
    return pending / total;
  }
}

/// 扩展方法：为List<T>添加firstOrNull
extension ListExtension<T> on List<T> {
  T? get firstOrNull {
    if (isEmpty) return null;
    return first;
  }
}
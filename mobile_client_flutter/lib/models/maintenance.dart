import 'package:json_annotation/json_annotation.dart';

part 'maintenance.g.dart';

/// 维护记录模型
@JsonSerializable()
class MaintenanceRecord {
  final String id;
  final String vehicleId;
  final String vehiclePlateNumber;
  final MaintenanceType type;
  final MaintenanceStatus status;
  final String description;
  final String? serviceProvider;
  final String? technician;
  final double? cost;
  final DateTime scheduledDate;
  final DateTime? completedDate;
  final int? mileage;
  final String? location;
  final List<String> items;
  final List<String>? attachments;
  final String? remarks;
  final String createdBy;
  final String createdByName;
  final DateTime createdAt;
  final DateTime updatedAt;

  const MaintenanceRecord({
    required this.id,
    required this.vehicleId,
    required this.vehiclePlateNumber,
    required this.type,
    required this.status,
    required this.description,
    this.serviceProvider,
    this.technician,
    this.cost,
    required this.scheduledDate,
    this.completedDate,
    this.mileage,
    this.location,
    required this.items,
    this.attachments,
    this.remarks,
    required this.createdBy,
    required this.createdByName,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MaintenanceRecord.fromJson(Map<String, dynamic> json) => _$MaintenanceRecordFromJson(json);
  Map<String, dynamic> toJson() => _$MaintenanceRecordToJson(this);

  MaintenanceRecord copyWith({
    String? id,
    String? vehicleId,
    String? vehiclePlateNumber,
    MaintenanceType? type,
    MaintenanceStatus? status,
    String? description,
    String? serviceProvider,
    String? technician,
    double? cost,
    DateTime? scheduledDate,
    DateTime? completedDate,
    int? mileage,
    String? location,
    List<String>? items,
    List<String>? attachments,
    String? remarks,
    String? createdBy,
    String? createdByName,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return MaintenanceRecord(
      id: id ?? this.id,
      vehicleId: vehicleId ?? this.vehicleId,
      vehiclePlateNumber: vehiclePlateNumber ?? this.vehiclePlateNumber,
      type: type ?? this.type,
      status: status ?? this.status,
      description: description ?? this.description,
      serviceProvider: serviceProvider ?? this.serviceProvider,
      technician: technician ?? this.technician,
      cost: cost ?? this.cost,
      scheduledDate: scheduledDate ?? this.scheduledDate,
      completedDate: completedDate ?? this.completedDate,
      mileage: mileage ?? this.mileage,
      location: location ?? this.location,
      items: items ?? this.items,
      attachments: attachments ?? this.attachments,
      remarks: remarks ?? this.remarks,
      createdBy: createdBy ?? this.createdBy,
      createdByName: createdByName ?? this.createdByName,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// 检查维护是否逾期
  bool get isOverdue {
    if (status == MaintenanceStatus.completed || status == MaintenanceStatus.cancelled) {
      return false;
    }
    return DateTime.now().isAfter(scheduledDate);
  }

  /// 检查维护是否即将到期（7天内）
  bool get isDueSoon {
    if (status == MaintenanceStatus.completed || status == MaintenanceStatus.cancelled) {
      return false;
    }
    final now = DateTime.now();
    final daysUntilDue = scheduledDate.difference(now).inDays;
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  }

  /// 获取维护持续时间（小时）
  double? get durationInHours {
    if (completedDate == null) return null;
    return completedDate!.difference(scheduledDate).inMinutes / 60.0;
  }

  /// 检查维护是否可以编辑
  bool get canEdit {
    return status == MaintenanceStatus.scheduled || status == MaintenanceStatus.inProgress;
  }

  /// 检查维护是否可以取消
  bool get canCancel {
    return status == MaintenanceStatus.scheduled;
  }

  /// 检查维护是否可以开始
  bool get canStart {
    return status == MaintenanceStatus.scheduled;
  }

  /// 检查维护是否可以完成
  bool get canComplete {
    return status == MaintenanceStatus.inProgress;
  }

  /// 检查维护是否已完成
  bool get isCompleted {
    return status == MaintenanceStatus.completed;
  }

  /// 检查维护是否已取消
  bool get isCancelled {
    return status == MaintenanceStatus.cancelled;
  }

  /// 检查维护是否进行中
  bool get isInProgress {
    return status == MaintenanceStatus.inProgress;
  }

  /// 获取维护项目数量
  int get itemCount {
    return items.length;
  }

  /// 获取附件数量
  int get attachmentCount {
    return attachments?.length ?? 0;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MaintenanceRecord && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'MaintenanceRecord{id: $id, vehiclePlateNumber: $vehiclePlateNumber, type: $type, status: $status}';
  }
}

/// 维护类型枚举
enum MaintenanceType {
  @JsonValue('routine')
  routine,
  @JsonValue('repair')
  repair,
  @JsonValue('inspection')
  inspection,
  @JsonValue('emergency')
  emergency,
  @JsonValue('upgrade')
  upgrade,
}

/// 维护类型扩展
extension MaintenanceTypeExtension on MaintenanceType {
  String get label {
    switch (this) {
      case MaintenanceType.routine:
        return '例行保养';
      case MaintenanceType.repair:
        return '维修';
      case MaintenanceType.inspection:
        return '检查';
      case MaintenanceType.emergency:
        return '紧急维修';
      case MaintenanceType.upgrade:
        return '升级改装';
    }
  }

  String get value {
    switch (this) {
      case MaintenanceType.routine:
        return 'routine';
      case MaintenanceType.repair:
        return 'repair';
      case MaintenanceType.inspection:
        return 'inspection';
      case MaintenanceType.emergency:
        return 'emergency';
      case MaintenanceType.upgrade:
        return 'upgrade';
    }
  }

  bool get isRoutine => this == MaintenanceType.routine;
  bool get isRepair => this == MaintenanceType.repair;
  bool get isInspection => this == MaintenanceType.inspection;
  bool get isEmergency => this == MaintenanceType.emergency;
  bool get isUpgrade => this == MaintenanceType.upgrade;
}

/// 维护状态枚举
enum MaintenanceStatus {
  @JsonValue('scheduled')
  scheduled,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
  @JsonValue('cancelled')
  cancelled,
}

/// 维护状态扩展
extension MaintenanceStatusExtension on MaintenanceStatus {
  String get label {
    switch (this) {
      case MaintenanceStatus.scheduled:
        return '已安排';
      case MaintenanceStatus.inProgress:
        return '进行中';
      case MaintenanceStatus.completed:
        return '已完成';
      case MaintenanceStatus.cancelled:
        return '已取消';
    }
  }

  String get value {
    switch (this) {
      case MaintenanceStatus.scheduled:
        return 'scheduled';
      case MaintenanceStatus.inProgress:
        return 'in_progress';
      case MaintenanceStatus.completed:
        return 'completed';
      case MaintenanceStatus.cancelled:
        return 'cancelled';
    }
  }

  bool get isScheduled => this == MaintenanceStatus.scheduled;
  bool get isInProgress => this == MaintenanceStatus.inProgress;
  bool get isCompleted => this == MaintenanceStatus.completed;
  bool get isCancelled => this == MaintenanceStatus.cancelled;
}

/// 创建维护记录请求模型
@JsonSerializable()
class CreateMaintenanceRequest {
  final String vehicleId;
  final MaintenanceType type;
  final String description;
  final String? serviceProvider;
  final String? technician;
  final double? cost;
  final DateTime scheduledDate;
  final int? mileage;
  final String? location;
  final List<String> items;
  final String? remarks;

  const CreateMaintenanceRequest({
    required this.vehicleId,
    required this.type,
    required this.description,
    this.serviceProvider,
    this.technician,
    this.cost,
    required this.scheduledDate,
    this.mileage,
    this.location,
    required this.items,
    this.remarks,
  });

  factory CreateMaintenanceRequest.fromJson(Map<String, dynamic> json) => _$CreateMaintenanceRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateMaintenanceRequestToJson(this);
}

/// 更新维护记录请求模型
@JsonSerializable()
class UpdateMaintenanceRequest {
  final MaintenanceType? type;
  final MaintenanceStatus? status;
  final String? description;
  final String? serviceProvider;
  final String? technician;
  final double? cost;
  final DateTime? scheduledDate;
  final DateTime? completedDate;
  final int? mileage;
  final String? location;
  final List<String>? items;
  final String? remarks;

  const UpdateMaintenanceRequest({
    this.type,
    this.status,
    this.description,
    this.serviceProvider,
    this.technician,
    this.cost,
    this.scheduledDate,
    this.completedDate,
    this.mileage,
    this.location,
    this.items,
    this.remarks,
  });

  factory UpdateMaintenanceRequest.fromJson(Map<String, dynamic> json) => _$UpdateMaintenanceRequestFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateMaintenanceRequestToJson(this);
}

/// 维护统计模型
@JsonSerializable()
class MaintenanceStats {
  final int total;
  final int scheduled;
  final int inProgress;
  final int completed;
  final int cancelled;
  final int overdue;
  final int dueSoon;
  final double totalCost;
  final double averageCost;

  const MaintenanceStats({
    required this.total,
    required this.scheduled,
    required this.inProgress,
    required this.completed,
    required this.cancelled,
    required this.overdue,
    required this.dueSoon,
    required this.totalCost,
    required this.averageCost,
  });

  factory MaintenanceStats.fromJson(Map<String, dynamic> json) => _$MaintenanceStatsFromJson(json);
  Map<String, dynamic> toJson() => _$MaintenanceStatsToJson(this);

  /// 获取完成率
  double get completionRate {
    if (total == 0) return 0.0;
    return completed / total;
  }

  /// 获取逾期率
  double get overdueRate {
    if (total == 0) return 0.0;
    return overdue / total;
  }

  /// 获取进行中的维护率
  double get inProgressRate {
    if (total == 0) return 0.0;
    return inProgress / total;
  }

  /// 获取需要关注的维护数量（逾期+即将到期）
  int get needsAttention {
    return overdue + dueSoon;
  }
}

/// 维护项目模型
@JsonSerializable()
class MaintenanceItem {
  final String id;
  final String name;
  final String description;
  final String? category;
  final double? standardCost;
  final int? standardDuration; // 标准工时（分钟）
  final bool isActive;

  const MaintenanceItem({
    required this.id,
    required this.name,
    required this.description,
    this.category,
    this.standardCost,
    this.standardDuration,
    required this.isActive,
  });

  factory MaintenanceItem.fromJson(Map<String, dynamic> json) => _$MaintenanceItemFromJson(json);
  Map<String, dynamic> toJson() => _$MaintenanceItemToJson(this);

  /// 获取标准工时（小时）
  double? get standardDurationInHours {
    if (standardDuration == null) return null;
    return standardDuration! / 60.0;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MaintenanceItem && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'MaintenanceItem{id: $id, name: $name, category: $category}';
  }
}

/// 维护提醒模型
@JsonSerializable()
class MaintenanceReminder {
  final String id;
  final String vehicleId;
  final String vehiclePlateNumber;
  final MaintenanceType type;
  final String description;
  final DateTime dueDate;
  final int? dueMileage;
  final bool isActive;
  final DateTime? lastNotified;
  final DateTime createdAt;

  const MaintenanceReminder({
    required this.id,
    required this.vehicleId,
    required this.vehiclePlateNumber,
    required this.type,
    required this.description,
    required this.dueDate,
    this.dueMileage,
    required this.isActive,
    this.lastNotified,
    required this.createdAt,
  });

  factory MaintenanceReminder.fromJson(Map<String, dynamic> json) => _$MaintenanceReminderFromJson(json);
  Map<String, dynamic> toJson() => _$MaintenanceReminderToJson(this);

  /// 检查提醒是否逾期
  bool get isOverdue {
    return DateTime.now().isAfter(dueDate);
  }

  /// 检查提醒是否即将到期（7天内）
  bool get isDueSoon {
    final now = DateTime.now();
    final daysUntilDue = dueDate.difference(now).inDays;
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  }

  /// 获取距离到期天数
  int get daysUntilDue {
    return dueDate.difference(DateTime.now()).inDays;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MaintenanceReminder && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'MaintenanceReminder{id: $id, vehiclePlateNumber: $vehiclePlateNumber, type: $type, dueDate: $dueDate}';
  }
}

/// 维护计划模型
@JsonSerializable()
class MaintenancePlan {
  final String id;
  final String vehicleId;
  final String vehiclePlateNumber;
  final MaintenanceType type;
  final String description;
  final int intervalDays;
  final int? intervalMileage;
  final DateTime nextDueDate;
  final int? nextDueMileage;
  final bool isActive;
  final String? serviceProvider;
  final List<String> items;
  final String? remarks;
  final String createdBy;
  final String createdByName;
  final DateTime createdAt;
  final DateTime updatedAt;

  const MaintenancePlan({
    required this.id,
    required this.vehicleId,
    required this.vehiclePlateNumber,
    required this.type,
    required this.description,
    required this.intervalDays,
    this.intervalMileage,
    required this.nextDueDate,
    this.nextDueMileage,
    required this.isActive,
    this.serviceProvider,
    required this.items,
    this.remarks,
    required this.createdBy,
    required this.createdByName,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MaintenancePlan.fromJson(Map<String, dynamic> json) => _$MaintenancePlanFromJson(json);
  Map<String, dynamic> toJson() => _$MaintenancePlanToJson(this);

  /// 检查计划是否逾期
  bool get isOverdue {
    return DateTime.now().isAfter(nextDueDate);
  }

  /// 检查计划是否即将到期（7天内）
  bool get isDueSoon {
    final now = DateTime.now();
    final daysUntilDue = nextDueDate.difference(now).inDays;
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  }

  /// 获取距离到期天数
  int get daysUntilDue {
    return nextDueDate.difference(DateTime.now()).inDays;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MaintenancePlan && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'MaintenancePlan{id: $id, vehiclePlateNumber: $vehiclePlateNumber, type: $type, nextDueDate: $nextDueDate}';
  }
}

/// 创建维护计划请求模型
@JsonSerializable()
class CreateMaintenancePlanRequest {
  final String vehicleId;
  final MaintenanceType type;
  final String description;
  final int intervalDays;
  final int? intervalMileage;
  final DateTime nextDueDate;
  final int? nextDueMileage;
  final String? serviceProvider;
  final List<String> items;
  final String? remarks;

  const CreateMaintenancePlanRequest({
    required this.vehicleId,
    required this.type,
    required this.description,
    required this.intervalDays,
    this.intervalMileage,
    required this.nextDueDate,
    this.nextDueMileage,
    this.serviceProvider,
    required this.items,
    this.remarks,
  });

  factory CreateMaintenancePlanRequest.fromJson(Map<String, dynamic> json) => _$CreateMaintenancePlanRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateMaintenancePlanRequestToJson(this);
}

/// 创建维护提醒请求模型
@JsonSerializable()
class CreateMaintenanceReminderRequest {
  final String vehicleId;
  final MaintenanceType type;
  final String description;
  final DateTime dueDate;
  final int? dueMileage;

  const CreateMaintenanceReminderRequest({
    required this.vehicleId,
    required this.type,
    required this.description,
    required this.dueDate,
    this.dueMileage,
  });

  factory CreateMaintenanceReminderRequest.fromJson(Map<String, dynamic> json) => _$CreateMaintenanceReminderRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateMaintenanceReminderRequestToJson(this);
}
import 'package:json_annotation/json_annotation.dart';

part 'expense.g.dart';

/// 费用记录模型
@JsonSerializable()
class ExpenseRecord {
  final String id;
  final String vehicleId;
  final String vehiclePlateNumber;
  final ExpenseType type;
  final ExpenseStatus status;
  final String description;
  final double amount;
  final String currency;
  final DateTime expenseDate;
  final String? vendor;
  final String? invoiceNumber;
  final String? receiptUrl;
  final int? mileage;
  final String? location;
  final String? category;
  final String? subcategory;
  final String? paymentMethod;
  final String? approvedBy;
  final String? approvedByName;
  final DateTime? approvedAt;
  final String? remarks;
  final List<String>? attachments;
  final String createdBy;
  final String createdByName;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ExpenseRecord({
    required this.id,
    required this.vehicleId,
    required this.vehiclePlateNumber,
    required this.type,
    required this.status,
    required this.description,
    required this.amount,
    required this.currency,
    required this.expenseDate,
    this.vendor,
    this.invoiceNumber,
    this.receiptUrl,
    this.mileage,
    this.location,
    this.category,
    this.subcategory,
    this.paymentMethod,
    this.approvedBy,
    this.approvedByName,
    this.approvedAt,
    this.remarks,
    this.attachments,
    required this.createdBy,
    required this.createdByName,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ExpenseRecord.fromJson(Map<String, dynamic> json) => _$ExpenseRecordFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseRecordToJson(this);

  ExpenseRecord copyWith({
    String? id,
    String? vehicleId,
    String? vehiclePlateNumber,
    ExpenseType? type,
    ExpenseStatus? status,
    String? description,
    double? amount,
    String? currency,
    DateTime? expenseDate,
    String? vendor,
    String? invoiceNumber,
    String? receiptUrl,
    int? mileage,
    String? location,
    String? category,
    String? subcategory,
    String? paymentMethod,
    String? approvedBy,
    String? approvedByName,
    DateTime? approvedAt,
    String? remarks,
    List<String>? attachments,
    String? createdBy,
    String? createdByName,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ExpenseRecord(
      id: id ?? this.id,
      vehicleId: vehicleId ?? this.vehicleId,
      vehiclePlateNumber: vehiclePlateNumber ?? this.vehiclePlateNumber,
      type: type ?? this.type,
      status: status ?? this.status,
      description: description ?? this.description,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      expenseDate: expenseDate ?? this.expenseDate,
      vendor: vendor ?? this.vendor,
      invoiceNumber: invoiceNumber ?? this.invoiceNumber,
      receiptUrl: receiptUrl ?? this.receiptUrl,
      mileage: mileage ?? this.mileage,
      location: location ?? this.location,
      category: category ?? this.category,
      subcategory: subcategory ?? this.subcategory,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      approvedBy: approvedBy ?? this.approvedBy,
      approvedByName: approvedByName ?? this.approvedByName,
      approvedAt: approvedAt ?? this.approvedAt,
      remarks: remarks ?? this.remarks,
      attachments: attachments ?? this.attachments,
      createdBy: createdBy ?? this.createdBy,
      createdByName: createdByName ?? this.createdByName,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  /// 检查费用是否需要审批
  bool get needsApproval {
    return status == ExpenseStatus.pending;
  }

  /// 检查费用是否已审批
  bool get isApproved {
    return status == ExpenseStatus.approved;
  }

  /// 检查费用是否被拒绝
  bool get isRejected {
    return status == ExpenseStatus.rejected;
  }

  /// 检查费用是否可以编辑
  bool get canEdit {
    return status == ExpenseStatus.draft || status == ExpenseStatus.pending;
  }

  /// 检查费用是否可以删除
  bool get canDelete {
    return status == ExpenseStatus.draft;
  }

  /// 检查费用是否可以提交审批
  bool get canSubmit {
    return status == ExpenseStatus.draft;
  }

  /// 检查费用是否可以撤回
  bool get canWithdraw {
    return status == ExpenseStatus.pending;
  }

  /// 检查费用是否有收据
  bool get hasReceipt {
    return receiptUrl != null && receiptUrl!.isNotEmpty;
  }

  /// 检查费用是否有附件
  bool get hasAttachments {
    return attachments != null && attachments!.isNotEmpty;
  }

  /// 获取附件数量
  int get attachmentCount {
    return attachments?.length ?? 0;
  }

  /// 获取格式化金额
  String get formattedAmount {
    return '$currency ${amount.toStringAsFixed(2)}';
  }

  /// 检查是否为大额费用（超过1000）
  bool get isLargeAmount {
    return amount >= 1000;
  }

  /// 获取费用年龄（天数）
  int get ageInDays {
    return DateTime.now().difference(expenseDate).inDays;
  }

  /// 检查费用是否为最近的（30天内）
  bool get isRecent {
    return ageInDays <= 30;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ExpenseRecord && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'ExpenseRecord{id: $id, vehiclePlateNumber: $vehiclePlateNumber, type: $type, amount: $formattedAmount}';
  }
}

/// 费用类型枚举
enum ExpenseType {
  @JsonValue('fuel')
  fuel,
  @JsonValue('maintenance')
  maintenance,
  @JsonValue('repair')
  repair,
  @JsonValue('insurance')
  insurance,
  @JsonValue('registration')
  registration,
  @JsonValue('parking')
  parking,
  @JsonValue('toll')
  toll,
  @JsonValue('fine')
  fine,
  @JsonValue('cleaning')
  cleaning,
  @JsonValue('other')
  other,
}

/// 费用类型扩展
extension ExpenseTypeExtension on ExpenseType {
  String get label {
    switch (this) {
      case ExpenseType.fuel:
        return '燃油费';
      case ExpenseType.maintenance:
        return '保养费';
      case ExpenseType.repair:
        return '维修费';
      case ExpenseType.insurance:
        return '保险费';
      case ExpenseType.registration:
        return '注册费';
      case ExpenseType.parking:
        return '停车费';
      case ExpenseType.toll:
        return '过路费';
      case ExpenseType.fine:
        return '罚款';
      case ExpenseType.cleaning:
        return '清洁费';
      case ExpenseType.other:
        return '其他';
    }
  }

  String get value {
    switch (this) {
      case ExpenseType.fuel:
        return 'fuel';
      case ExpenseType.maintenance:
        return 'maintenance';
      case ExpenseType.repair:
        return 'repair';
      case ExpenseType.insurance:
        return 'insurance';
      case ExpenseType.registration:
        return 'registration';
      case ExpenseType.parking:
        return 'parking';
      case ExpenseType.toll:
        return 'toll';
      case ExpenseType.fine:
        return 'fine';
      case ExpenseType.cleaning:
        return 'cleaning';
      case ExpenseType.other:
        return 'other';
    }
  }

  bool get isFuel => this == ExpenseType.fuel;
  bool get isMaintenance => this == ExpenseType.maintenance;
  bool get isRepair => this == ExpenseType.repair;
  bool get isInsurance => this == ExpenseType.insurance;
  bool get isRegistration => this == ExpenseType.registration;
  bool get isParking => this == ExpenseType.parking;
  bool get isToll => this == ExpenseType.toll;
  bool get isFine => this == ExpenseType.fine;
  bool get isCleaning => this == ExpenseType.cleaning;
  bool get isOther => this == ExpenseType.other;
}

/// 费用状态枚举
enum ExpenseStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('pending')
  pending,
  @JsonValue('approved')
  approved,
  @JsonValue('rejected')
  rejected,
}

/// 费用状态扩展
extension ExpenseStatusExtension on ExpenseStatus {
  String get label {
    switch (this) {
      case ExpenseStatus.draft:
        return '草稿';
      case ExpenseStatus.pending:
        return '待审批';
      case ExpenseStatus.approved:
        return '已审批';
      case ExpenseStatus.rejected:
        return '已拒绝';
    }
  }

  String get value {
    switch (this) {
      case ExpenseStatus.draft:
        return 'draft';
      case ExpenseStatus.pending:
        return 'pending';
      case ExpenseStatus.approved:
        return 'approved';
      case ExpenseStatus.rejected:
        return 'rejected';
    }
  }

  bool get isDraft => this == ExpenseStatus.draft;
  bool get isPending => this == ExpenseStatus.pending;
  bool get isApproved => this == ExpenseStatus.approved;
  bool get isRejected => this == ExpenseStatus.rejected;
}

/// 创建费用记录请求模型
@JsonSerializable()
class CreateExpenseRequest {
  final String vehicleId;
  final ExpenseType type;
  final String description;
  final double amount;
  final String currency;
  final DateTime expenseDate;
  final String? vendor;
  final String? invoiceNumber;
  final String? receiptUrl;
  final int? mileage;
  final String? location;
  final String? category;
  final String? subcategory;
  final String? paymentMethod;
  final String? remarks;
  final List<String>? attachments;

  const CreateExpenseRequest({
    required this.vehicleId,
    required this.type,
    required this.description,
    required this.amount,
    required this.currency,
    required this.expenseDate,
    this.vendor,
    this.invoiceNumber,
    this.receiptUrl,
    this.mileage,
    this.location,
    this.category,
    this.subcategory,
    this.paymentMethod,
    this.remarks,
    this.attachments,
  });

  factory CreateExpenseRequest.fromJson(Map<String, dynamic> json) => _$CreateExpenseRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateExpenseRequestToJson(this);
}

/// 更新费用记录请求模型
@JsonSerializable()
class UpdateExpenseRequest {
  final ExpenseType? type;
  final ExpenseStatus? status;
  final String? description;
  final double? amount;
  final String? currency;
  final DateTime? expenseDate;
  final String? vendor;
  final String? invoiceNumber;
  final String? receiptUrl;
  final int? mileage;
  final String? location;
  final String? category;
  final String? subcategory;
  final String? paymentMethod;
  final String? remarks;
  final List<String>? attachments;

  const UpdateExpenseRequest({
    this.type,
    this.status,
    this.description,
    this.amount,
    this.currency,
    this.expenseDate,
    this.vendor,
    this.invoiceNumber,
    this.receiptUrl,
    this.mileage,
    this.location,
    this.category,
    this.subcategory,
    this.paymentMethod,
    this.remarks,
    this.attachments,
  });

  factory UpdateExpenseRequest.fromJson(Map<String, dynamic> json) => _$UpdateExpenseRequestFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateExpenseRequestToJson(this);
}

/// 费用审批请求模型
@JsonSerializable()
class ExpenseApprovalRequest {
  final ExpenseStatus status;
  final String? remarks;

  const ExpenseApprovalRequest({
    required this.status,
    this.remarks,
  });

  factory ExpenseApprovalRequest.fromJson(Map<String, dynamic> json) => _$ExpenseApprovalRequestFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseApprovalRequestToJson(this);
}

/// 费用统计模型
@JsonSerializable()
class ExpenseStats {
  final int total;
  final int draft;
  final int pending;
  final int approved;
  final int rejected;
  final double totalAmount;
  final double averageAmount;
  final double monthlyTotal;
  final double yearlyTotal;
  final Map<String, double> byType;
  final Map<String, double> byMonth;

  const ExpenseStats({
    required this.total,
    required this.draft,
    required this.pending,
    required this.approved,
    required this.rejected,
    required this.totalAmount,
    required this.averageAmount,
    required this.monthlyTotal,
    required this.yearlyTotal,
    required this.byType,
    required this.byMonth,
  });

  factory ExpenseStats.fromJson(Map<String, dynamic> json) => _$ExpenseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseStatsToJson(this);

  /// 获取审批率
  double get approvalRate {
    final processed = approved + rejected;
    if (processed == 0) return 0.0;
    return approved / processed;
  }

  /// 获取拒绝率
  double get rejectionRate {
    final processed = approved + rejected;
    if (processed == 0) return 0.0;
    return rejected / processed;
  }

  /// 获取待处理费用数量
  int get pendingCount {
    return pending;
  }

  /// 获取草稿费用数量
  int get draftCount {
    return draft;
  }

  /// 获取已处理费用数量
  int get processedCount {
    return approved + rejected;
  }

  /// 获取最高费用类型
  String? get topExpenseType {
    if (byType.isEmpty) return null;
    return byType.entries.reduce((a, b) => a.value > b.value ? a : b).key;
  }

  /// 获取最高费用类型金额
  double get topExpenseTypeAmount {
    if (byType.isEmpty) return 0.0;
    return byType.values.reduce((a, b) => a > b ? a : b);
  }
}

/// 费用报告模型
@JsonSerializable()
class ExpenseReport {
  final String id;
  final String title;
  final DateTime startDate;
  final DateTime endDate;
  final List<String> vehicleIds;
  final List<ExpenseType> types;
  final ExpenseStats stats;
  final List<ExpenseRecord> expenses;
  final String createdBy;
  final String createdByName;
  final DateTime createdAt;

  const ExpenseReport({
    required this.id,
    required this.title,
    required this.startDate,
    required this.endDate,
    required this.vehicleIds,
    required this.types,
    required this.stats,
    required this.expenses,
    required this.createdBy,
    required this.createdByName,
    required this.createdAt,
  });

  factory ExpenseReport.fromJson(Map<String, dynamic> json) => _$ExpenseReportFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseReportToJson(this);

  /// 获取报告期间天数
  int get periodInDays {
    return endDate.difference(startDate).inDays + 1;
  }

  /// 获取日均费用
  double get dailyAverage {
    if (periodInDays == 0) return 0.0;
    return stats.totalAmount / periodInDays;
  }

  /// 获取车辆数量
  int get vehicleCount {
    return vehicleIds.length;
  }

  /// 获取费用类型数量
  int get typeCount {
    return types.length;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ExpenseReport && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'ExpenseReport{id: $id, title: $title, period: ${startDate.toString().split(' ')[0]} - ${endDate.toString().split(' ')[0]}}';
  }
}

/// 费用类别模型
@JsonSerializable()
class ExpenseCategory {
  final String id;
  final String name;
  final String description;
  final String? parentId;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ExpenseCategory({
    required this.id,
    required this.name,
    required this.description,
    this.parentId,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ExpenseCategory.fromJson(Map<String, dynamic> json) => _$ExpenseCategoryFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseCategoryToJson(this);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ExpenseCategory && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'ExpenseCategory{id: $id, name: $name}';
  }
}

/// 费用类别统计模型
@JsonSerializable()
class ExpenseCategoryStats {
  final String categoryId;
  final String categoryName;
  final int count;
  final double totalAmount;
  final double averageAmount;
  final double percentage;

  const ExpenseCategoryStats({
    required this.categoryId,
    required this.categoryName,
    required this.count,
    required this.totalAmount,
    required this.averageAmount,
    required this.percentage,
  });

  factory ExpenseCategoryStats.fromJson(Map<String, dynamic> json) => _$ExpenseCategoryStatsFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseCategoryStatsToJson(this);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ExpenseCategoryStats && other.categoryId == categoryId;
  }

  @override
  int get hashCode => categoryId.hashCode;

  @override
  String toString() {
    return 'ExpenseCategoryStats{categoryId: $categoryId, categoryName: $categoryName, count: $count, totalAmount: $totalAmount}';
  }
}

/// 月度费用统计模型
@JsonSerializable()
class MonthlyExpenseStats {
  final int year;
  final int month;
  final int count;
  final double totalAmount;
  final double averageAmount;
  final Map<String, double> byType;
  final Map<String, double> byCategory;

  const MonthlyExpenseStats({
    required this.year,
    required this.month,
    required this.count,
    required this.totalAmount,
    required this.averageAmount,
    required this.byType,
    required this.byCategory,
  });

  factory MonthlyExpenseStats.fromJson(Map<String, dynamic> json) => _$MonthlyExpenseStatsFromJson(json);
  Map<String, dynamic> toJson() => _$MonthlyExpenseStatsToJson(this);

  /// 获取月份名称
  String get monthName {
    const months = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return months[month - 1];
  }

  /// 获取年月字符串
  String get yearMonth {
    return '$year年${month.toString().padLeft(2, '0')}月';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MonthlyExpenseStats && other.year == year && other.month == month;
  }

  @override
  int get hashCode => Object.hash(year, month);

  @override
  String toString() {
    return 'MonthlyExpenseStats{year: $year, month: $month, count: $count, totalAmount: $totalAmount}';
  }
}

/// 创建费用报告请求模型
@JsonSerializable()
class CreateExpenseReportRequest {
  final String title;
  final DateTime startDate;
  final DateTime endDate;
  final List<String>? vehicleIds;
  final List<ExpenseType>? types;
  final List<ExpenseStatus>? statuses;

  const CreateExpenseReportRequest({
    required this.title,
    required this.startDate,
    required this.endDate,
    this.vehicleIds,
    this.types,
    this.statuses,
  });

  factory CreateExpenseReportRequest.fromJson(Map<String, dynamic> json) => _$CreateExpenseReportRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateExpenseReportRequestToJson(this);
}
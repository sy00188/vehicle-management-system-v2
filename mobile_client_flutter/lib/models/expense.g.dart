// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expense.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExpenseRecord _$ExpenseRecordFromJson(Map<String, dynamic> json) =>
    ExpenseRecord(
      id: json['id'] as String,
      vehicleId: json['vehicleId'] as String,
      vehiclePlateNumber: json['vehiclePlateNumber'] as String,
      type: $enumDecode(_$ExpenseTypeEnumMap, json['type']),
      status: $enumDecode(_$ExpenseStatusEnumMap, json['status']),
      description: json['description'] as String,
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      expenseDate: DateTime.parse(json['expenseDate'] as String),
      vendor: json['vendor'] as String?,
      invoiceNumber: json['invoiceNumber'] as String?,
      receiptUrl: json['receiptUrl'] as String?,
      mileage: (json['mileage'] as num?)?.toInt(),
      location: json['location'] as String?,
      category: json['category'] as String?,
      subcategory: json['subcategory'] as String?,
      paymentMethod: json['paymentMethod'] as String?,
      approvedBy: json['approvedBy'] as String?,
      approvedByName: json['approvedByName'] as String?,
      approvedAt: json['approvedAt'] == null
          ? null
          : DateTime.parse(json['approvedAt'] as String),
      remarks: json['remarks'] as String?,
      attachments: (json['attachments'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      createdBy: json['createdBy'] as String,
      createdByName: json['createdByName'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$ExpenseRecordToJson(ExpenseRecord instance) =>
    <String, dynamic>{
      'id': instance.id,
      'vehicleId': instance.vehicleId,
      'vehiclePlateNumber': instance.vehiclePlateNumber,
      'type': _$ExpenseTypeEnumMap[instance.type]!,
      'status': _$ExpenseStatusEnumMap[instance.status]!,
      'description': instance.description,
      'amount': instance.amount,
      'currency': instance.currency,
      'expenseDate': instance.expenseDate.toIso8601String(),
      'vendor': instance.vendor,
      'invoiceNumber': instance.invoiceNumber,
      'receiptUrl': instance.receiptUrl,
      'mileage': instance.mileage,
      'location': instance.location,
      'category': instance.category,
      'subcategory': instance.subcategory,
      'paymentMethod': instance.paymentMethod,
      'approvedBy': instance.approvedBy,
      'approvedByName': instance.approvedByName,
      'approvedAt': instance.approvedAt?.toIso8601String(),
      'remarks': instance.remarks,
      'attachments': instance.attachments,
      'createdBy': instance.createdBy,
      'createdByName': instance.createdByName,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$ExpenseTypeEnumMap = {
  ExpenseType.fuel: 'fuel',
  ExpenseType.maintenance: 'maintenance',
  ExpenseType.repair: 'repair',
  ExpenseType.insurance: 'insurance',
  ExpenseType.registration: 'registration',
  ExpenseType.parking: 'parking',
  ExpenseType.toll: 'toll',
  ExpenseType.fine: 'fine',
  ExpenseType.cleaning: 'cleaning',
  ExpenseType.other: 'other',
};

const _$ExpenseStatusEnumMap = {
  ExpenseStatus.draft: 'draft',
  ExpenseStatus.pending: 'pending',
  ExpenseStatus.approved: 'approved',
  ExpenseStatus.rejected: 'rejected',
};

CreateExpenseRequest _$CreateExpenseRequestFromJson(
        Map<String, dynamic> json) =>
    CreateExpenseRequest(
      vehicleId: json['vehicleId'] as String,
      type: $enumDecode(_$ExpenseTypeEnumMap, json['type']),
      description: json['description'] as String,
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      expenseDate: DateTime.parse(json['expenseDate'] as String),
      vendor: json['vendor'] as String?,
      invoiceNumber: json['invoiceNumber'] as String?,
      receiptUrl: json['receiptUrl'] as String?,
      mileage: (json['mileage'] as num?)?.toInt(),
      location: json['location'] as String?,
      category: json['category'] as String?,
      subcategory: json['subcategory'] as String?,
      paymentMethod: json['paymentMethod'] as String?,
      remarks: json['remarks'] as String?,
      attachments: (json['attachments'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
    );

Map<String, dynamic> _$CreateExpenseRequestToJson(
        CreateExpenseRequest instance) =>
    <String, dynamic>{
      'vehicleId': instance.vehicleId,
      'type': _$ExpenseTypeEnumMap[instance.type]!,
      'description': instance.description,
      'amount': instance.amount,
      'currency': instance.currency,
      'expenseDate': instance.expenseDate.toIso8601String(),
      'vendor': instance.vendor,
      'invoiceNumber': instance.invoiceNumber,
      'receiptUrl': instance.receiptUrl,
      'mileage': instance.mileage,
      'location': instance.location,
      'category': instance.category,
      'subcategory': instance.subcategory,
      'paymentMethod': instance.paymentMethod,
      'remarks': instance.remarks,
      'attachments': instance.attachments,
    };

UpdateExpenseRequest _$UpdateExpenseRequestFromJson(
        Map<String, dynamic> json) =>
    UpdateExpenseRequest(
      type: $enumDecodeNullable(_$ExpenseTypeEnumMap, json['type']),
      status: $enumDecodeNullable(_$ExpenseStatusEnumMap, json['status']),
      description: json['description'] as String?,
      amount: (json['amount'] as num?)?.toDouble(),
      currency: json['currency'] as String?,
      expenseDate: json['expenseDate'] == null
          ? null
          : DateTime.parse(json['expenseDate'] as String),
      vendor: json['vendor'] as String?,
      invoiceNumber: json['invoiceNumber'] as String?,
      receiptUrl: json['receiptUrl'] as String?,
      mileage: (json['mileage'] as num?)?.toInt(),
      location: json['location'] as String?,
      category: json['category'] as String?,
      subcategory: json['subcategory'] as String?,
      paymentMethod: json['paymentMethod'] as String?,
      remarks: json['remarks'] as String?,
      attachments: (json['attachments'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
    );

Map<String, dynamic> _$UpdateExpenseRequestToJson(
        UpdateExpenseRequest instance) =>
    <String, dynamic>{
      'type': _$ExpenseTypeEnumMap[instance.type],
      'status': _$ExpenseStatusEnumMap[instance.status],
      'description': instance.description,
      'amount': instance.amount,
      'currency': instance.currency,
      'expenseDate': instance.expenseDate?.toIso8601String(),
      'vendor': instance.vendor,
      'invoiceNumber': instance.invoiceNumber,
      'receiptUrl': instance.receiptUrl,
      'mileage': instance.mileage,
      'location': instance.location,
      'category': instance.category,
      'subcategory': instance.subcategory,
      'paymentMethod': instance.paymentMethod,
      'remarks': instance.remarks,
      'attachments': instance.attachments,
    };

ExpenseApprovalRequest _$ExpenseApprovalRequestFromJson(
        Map<String, dynamic> json) =>
    ExpenseApprovalRequest(
      status: $enumDecode(_$ExpenseStatusEnumMap, json['status']),
      remarks: json['remarks'] as String?,
    );

Map<String, dynamic> _$ExpenseApprovalRequestToJson(
        ExpenseApprovalRequest instance) =>
    <String, dynamic>{
      'status': _$ExpenseStatusEnumMap[instance.status]!,
      'remarks': instance.remarks,
    };

ExpenseStats _$ExpenseStatsFromJson(Map<String, dynamic> json) => ExpenseStats(
      total: (json['total'] as num).toInt(),
      draft: (json['draft'] as num).toInt(),
      pending: (json['pending'] as num).toInt(),
      approved: (json['approved'] as num).toInt(),
      rejected: (json['rejected'] as num).toInt(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      averageAmount: (json['averageAmount'] as num).toDouble(),
      monthlyTotal: (json['monthlyTotal'] as num).toDouble(),
      yearlyTotal: (json['yearlyTotal'] as num).toDouble(),
      byType: (json['byType'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
      byMonth: (json['byMonth'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
    );

Map<String, dynamic> _$ExpenseStatsToJson(ExpenseStats instance) =>
    <String, dynamic>{
      'total': instance.total,
      'draft': instance.draft,
      'pending': instance.pending,
      'approved': instance.approved,
      'rejected': instance.rejected,
      'totalAmount': instance.totalAmount,
      'averageAmount': instance.averageAmount,
      'monthlyTotal': instance.monthlyTotal,
      'yearlyTotal': instance.yearlyTotal,
      'byType': instance.byType,
      'byMonth': instance.byMonth,
    };

ExpenseReport _$ExpenseReportFromJson(Map<String, dynamic> json) =>
    ExpenseReport(
      id: json['id'] as String,
      title: json['title'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      vehicleIds: (json['vehicleIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      types: (json['types'] as List<dynamic>)
          .map((e) => $enumDecode(_$ExpenseTypeEnumMap, e))
          .toList(),
      stats: ExpenseStats.fromJson(json['stats'] as Map<String, dynamic>),
      expenses: (json['expenses'] as List<dynamic>)
          .map((e) => ExpenseRecord.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdBy: json['createdBy'] as String,
      createdByName: json['createdByName'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$ExpenseReportToJson(ExpenseReport instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'vehicleIds': instance.vehicleIds,
      'types': instance.types.map((e) => _$ExpenseTypeEnumMap[e]!).toList(),
      'stats': instance.stats,
      'expenses': instance.expenses,
      'createdBy': instance.createdBy,
      'createdByName': instance.createdByName,
      'createdAt': instance.createdAt.toIso8601String(),
    };

ExpenseCategory _$ExpenseCategoryFromJson(Map<String, dynamic> json) =>
    ExpenseCategory(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      parentId: json['parentId'] as String?,
      isActive: json['isActive'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$ExpenseCategoryToJson(ExpenseCategory instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'parentId': instance.parentId,
      'isActive': instance.isActive,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

ExpenseCategoryStats _$ExpenseCategoryStatsFromJson(
        Map<String, dynamic> json) =>
    ExpenseCategoryStats(
      categoryId: json['categoryId'] as String,
      categoryName: json['categoryName'] as String,
      count: (json['count'] as num).toInt(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      averageAmount: (json['averageAmount'] as num).toDouble(),
      percentage: (json['percentage'] as num).toDouble(),
    );

Map<String, dynamic> _$ExpenseCategoryStatsToJson(
        ExpenseCategoryStats instance) =>
    <String, dynamic>{
      'categoryId': instance.categoryId,
      'categoryName': instance.categoryName,
      'count': instance.count,
      'totalAmount': instance.totalAmount,
      'averageAmount': instance.averageAmount,
      'percentage': instance.percentage,
    };

MonthlyExpenseStats _$MonthlyExpenseStatsFromJson(Map<String, dynamic> json) =>
    MonthlyExpenseStats(
      year: (json['year'] as num).toInt(),
      month: (json['month'] as num).toInt(),
      count: (json['count'] as num).toInt(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      averageAmount: (json['averageAmount'] as num).toDouble(),
      byType: (json['byType'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
      byCategory: (json['byCategory'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
    );

Map<String, dynamic> _$MonthlyExpenseStatsToJson(
        MonthlyExpenseStats instance) =>
    <String, dynamic>{
      'year': instance.year,
      'month': instance.month,
      'count': instance.count,
      'totalAmount': instance.totalAmount,
      'averageAmount': instance.averageAmount,
      'byType': instance.byType,
      'byCategory': instance.byCategory,
    };

CreateExpenseReportRequest _$CreateExpenseReportRequestFromJson(
        Map<String, dynamic> json) =>
    CreateExpenseReportRequest(
      title: json['title'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      vehicleIds: (json['vehicleIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      types: (json['types'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$ExpenseTypeEnumMap, e))
          .toList(),
      statuses: (json['statuses'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$ExpenseStatusEnumMap, e))
          .toList(),
    );

Map<String, dynamic> _$CreateExpenseReportRequestToJson(
        CreateExpenseReportRequest instance) =>
    <String, dynamic>{
      'title': instance.title,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'vehicleIds': instance.vehicleIds,
      'types': instance.types?.map((e) => _$ExpenseTypeEnumMap[e]!).toList(),
      'statuses':
          instance.statuses?.map((e) => _$ExpenseStatusEnumMap[e]!).toList(),
    };

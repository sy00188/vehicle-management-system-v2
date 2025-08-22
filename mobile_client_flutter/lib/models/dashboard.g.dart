// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DashboardData _$DashboardDataFromJson(Map<String, dynamic> json) =>
    DashboardData(
      stats: DashboardStats.fromJson(json['stats'] as Map<String, dynamic>),
      recentActivities: (json['recentActivities'] as List<dynamic>)
          .map((e) => ActivityRecord.fromJson(e as Map<String, dynamic>))
          .toList(),
      todoItems: (json['todoItems'] as List<dynamic>)
          .map((e) => TodoItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      quickActions: (json['quickActions'] as List<dynamic>)
          .map((e) => QuickAction.fromJson(e as Map<String, dynamic>))
          .toList(),
      usageChart:
          UsageChartData.fromJson(json['usageChart'] as Map<String, dynamic>),
      expenseChart: ExpenseChartData.fromJson(
          json['expenseChart'] as Map<String, dynamic>),
      upcomingMaintenance: (json['upcomingMaintenance'] as List<dynamic>)
          .map((e) => MaintenanceReminder.fromJson(e as Map<String, dynamic>))
          .toList(),
      pendingApplications: (json['pendingApplications'] as List<dynamic>)
          .map((e) => VehicleApplication.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$DashboardDataToJson(DashboardData instance) =>
    <String, dynamic>{
      'stats': instance.stats,
      'recentActivities': instance.recentActivities,
      'todoItems': instance.todoItems,
      'quickActions': instance.quickActions,
      'usageChart': instance.usageChart,
      'expenseChart': instance.expenseChart,
      'upcomingMaintenance': instance.upcomingMaintenance,
      'pendingApplications': instance.pendingApplications,
    };

DashboardStats _$DashboardStatsFromJson(Map<String, dynamic> json) =>
    DashboardStats(
      vehicles: VehicleStats.fromJson(json['vehicles'] as Map<String, dynamic>),
      applications: ApplicationStats.fromJson(
          json['applications'] as Map<String, dynamic>),
      drivers: DriverStats.fromJson(json['drivers'] as Map<String, dynamic>),
      maintenance: MaintenanceStats.fromJson(
          json['maintenance'] as Map<String, dynamic>),
      expenses: ExpenseStats.fromJson(json['expenses'] as Map<String, dynamic>),
      system: SystemStats.fromJson(json['system'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$DashboardStatsToJson(DashboardStats instance) =>
    <String, dynamic>{
      'vehicles': instance.vehicles,
      'applications': instance.applications,
      'drivers': instance.drivers,
      'maintenance': instance.maintenance,
      'expenses': instance.expenses,
      'system': instance.system,
    };

SystemStats _$SystemStatsFromJson(Map<String, dynamic> json) => SystemStats(
      totalUsers: (json['totalUsers'] as num).toInt(),
      activeUsers: (json['activeUsers'] as num).toInt(),
      onlineUsers: (json['onlineUsers'] as num).toInt(),
      systemLoad: (json['systemLoad'] as num).toDouble(),
      memoryUsage: (json['memoryUsage'] as num).toDouble(),
      diskUsage: (json['diskUsage'] as num).toDouble(),
      lastBackup: DateTime.parse(json['lastBackup'] as String),
      errorCount: (json['errorCount'] as num).toInt(),
      warningCount: (json['warningCount'] as num).toInt(),
    );

Map<String, dynamic> _$SystemStatsToJson(SystemStats instance) =>
    <String, dynamic>{
      'totalUsers': instance.totalUsers,
      'activeUsers': instance.activeUsers,
      'onlineUsers': instance.onlineUsers,
      'systemLoad': instance.systemLoad,
      'memoryUsage': instance.memoryUsage,
      'diskUsage': instance.diskUsage,
      'lastBackup': instance.lastBackup.toIso8601String(),
      'errorCount': instance.errorCount,
      'warningCount': instance.warningCount,
    };

ActivityRecord _$ActivityRecordFromJson(Map<String, dynamic> json) =>
    ActivityRecord(
      id: json['id'] as String,
      type: $enumDecode(_$ActivityTypeEnumMap, json['type']),
      title: json['title'] as String,
      description: json['description'] as String,
      entityId: json['entityId'] as String?,
      entityType: json['entityType'] as String?,
      userId: json['userId'] as String,
      userName: json['userName'] as String,
      userAvatar: json['userAvatar'] as String?,
      timestamp: DateTime.parse(json['timestamp'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ActivityRecordToJson(ActivityRecord instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': _$ActivityTypeEnumMap[instance.type]!,
      'title': instance.title,
      'description': instance.description,
      'entityId': instance.entityId,
      'entityType': instance.entityType,
      'userId': instance.userId,
      'userName': instance.userName,
      'userAvatar': instance.userAvatar,
      'timestamp': instance.timestamp.toIso8601String(),
      'metadata': instance.metadata,
    };

const _$ActivityTypeEnumMap = {
  ActivityType.vehicleCreated: 'vehicle_created',
  ActivityType.vehicleUpdated: 'vehicle_updated',
  ActivityType.vehicleDeleted: 'vehicle_deleted',
  ActivityType.applicationSubmitted: 'application_submitted',
  ActivityType.applicationApproved: 'application_approved',
  ActivityType.applicationRejected: 'application_rejected',
  ActivityType.driverCreated: 'driver_created',
  ActivityType.driverUpdated: 'driver_updated',
  ActivityType.maintenanceScheduled: 'maintenance_scheduled',
  ActivityType.maintenanceCompleted: 'maintenance_completed',
  ActivityType.expenseSubmitted: 'expense_submitted',
  ActivityType.expenseApproved: 'expense_approved',
  ActivityType.userLogin: 'user_login',
  ActivityType.userLogout: 'user_logout',
  ActivityType.systemBackup: 'system_backup',
  ActivityType.systemError: 'system_error',
};

TodoItem _$TodoItemFromJson(Map<String, dynamic> json) => TodoItem(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$TodoTypeEnumMap, json['type']),
      priority: $enumDecode(_$TodoPriorityEnumMap, json['priority']),
      dueDate: DateTime.parse(json['dueDate'] as String),
      entityId: json['entityId'] as String?,
      entityType: json['entityType'] as String?,
      assignedTo: json['assignedTo'] as String?,
      assignedToName: json['assignedToName'] as String?,
      isCompleted: json['isCompleted'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$TodoItemToJson(TodoItem instance) => <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'type': _$TodoTypeEnumMap[instance.type]!,
      'priority': _$TodoPriorityEnumMap[instance.priority]!,
      'dueDate': instance.dueDate.toIso8601String(),
      'entityId': instance.entityId,
      'entityType': instance.entityType,
      'assignedTo': instance.assignedTo,
      'assignedToName': instance.assignedToName,
      'isCompleted': instance.isCompleted,
      'createdAt': instance.createdAt.toIso8601String(),
    };

const _$TodoTypeEnumMap = {
  TodoType.maintenance: 'maintenance',
  TodoType.application: 'application',
  TodoType.expense: 'expense',
  TodoType.inspection: 'inspection',
  TodoType.renewal: 'renewal',
  TodoType.other: 'other',
};

const _$TodoPriorityEnumMap = {
  TodoPriority.low: 'low',
  TodoPriority.medium: 'medium',
  TodoPriority.high: 'high',
  TodoPriority.urgent: 'urgent',
};

QuickAction _$QuickActionFromJson(Map<String, dynamic> json) => QuickAction(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      route: json['route'] as String,
      params: json['params'] as Map<String, dynamic>?,
      isEnabled: json['isEnabled'] as bool,
      permission: json['permission'] as String?,
    );

Map<String, dynamic> _$QuickActionToJson(QuickAction instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'icon': instance.icon,
      'route': instance.route,
      'params': instance.params,
      'isEnabled': instance.isEnabled,
      'permission': instance.permission,
    };

UsageChartData _$UsageChartDataFromJson(Map<String, dynamic> json) =>
    UsageChartData(
      title: json['title'] as String,
      subtitle: json['subtitle'] as String,
      data: (json['data'] as List<dynamic>)
          .map((e) => ChartDataPoint.fromJson(e as Map<String, dynamic>))
          .toList(),
      type: $enumDecode(_$ChartTypeEnumMap, json['type']),
      xAxisLabel: json['xAxisLabel'] as String,
      yAxisLabel: json['yAxisLabel'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
    );

Map<String, dynamic> _$UsageChartDataToJson(UsageChartData instance) =>
    <String, dynamic>{
      'title': instance.title,
      'subtitle': instance.subtitle,
      'data': instance.data,
      'type': _$ChartTypeEnumMap[instance.type]!,
      'xAxisLabel': instance.xAxisLabel,
      'yAxisLabel': instance.yAxisLabel,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
    };

const _$ChartTypeEnumMap = {
  ChartType.line: 'line',
  ChartType.bar: 'bar',
  ChartType.pie: 'pie',
  ChartType.area: 'area',
  ChartType.scatter: 'scatter',
};

ExpenseChartData _$ExpenseChartDataFromJson(Map<String, dynamic> json) =>
    ExpenseChartData(
      title: json['title'] as String,
      subtitle: json['subtitle'] as String,
      data: (json['data'] as List<dynamic>)
          .map((e) => ChartDataPoint.fromJson(e as Map<String, dynamic>))
          .toList(),
      type: $enumDecode(_$ChartTypeEnumMap, json['type']),
      xAxisLabel: json['xAxisLabel'] as String,
      yAxisLabel: json['yAxisLabel'] as String,
      currency: json['currency'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
    );

Map<String, dynamic> _$ExpenseChartDataToJson(ExpenseChartData instance) =>
    <String, dynamic>{
      'title': instance.title,
      'subtitle': instance.subtitle,
      'data': instance.data,
      'type': _$ChartTypeEnumMap[instance.type]!,
      'xAxisLabel': instance.xAxisLabel,
      'yAxisLabel': instance.yAxisLabel,
      'currency': instance.currency,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
    };

ChartDataPoint _$ChartDataPointFromJson(Map<String, dynamic> json) =>
    ChartDataPoint(
      label: json['label'] as String,
      value: (json['value'] as num).toDouble(),
      color: json['color'] as String?,
      timestamp: json['timestamp'] == null
          ? null
          : DateTime.parse(json['timestamp'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ChartDataPointToJson(ChartDataPoint instance) =>
    <String, dynamic>{
      'label': instance.label,
      'value': instance.value,
      'color': instance.color,
      'timestamp': instance.timestamp?.toIso8601String(),
      'metadata': instance.metadata,
    };

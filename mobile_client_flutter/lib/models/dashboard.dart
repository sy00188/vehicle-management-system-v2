import 'package:json_annotation/json_annotation.dart';
import 'vehicle.dart';
import 'application.dart';
import 'driver.dart';
import 'maintenance.dart';
import 'expense.dart';

part 'dashboard.g.dart';

/// 仪表板数据模型
@JsonSerializable()
class DashboardData {
  final DashboardStats stats;
  final List<ActivityRecord> recentActivities;
  final List<TodoItem> todoItems;
  final List<QuickAction> quickActions;
  final UsageChartData usageChart;
  final ExpenseChartData expenseChart;
  final List<MaintenanceReminder> upcomingMaintenance;
  final List<VehicleApplication> pendingApplications;

  const DashboardData({
    required this.stats,
    required this.recentActivities,
    required this.todoItems,
    required this.quickActions,
    required this.usageChart,
    required this.expenseChart,
    required this.upcomingMaintenance,
    required this.pendingApplications,
  });

  factory DashboardData.fromJson(Map<String, dynamic> json) => _$DashboardDataFromJson(json);
  Map<String, dynamic> toJson() => _$DashboardDataToJson(this);

  /// 获取需要关注的项目数量
  int get attentionItemsCount {
    return todoItems.length + 
           upcomingMaintenance.where((m) => m.isOverdue || m.isDueSoon).length +
           pendingApplications.length;
  }

  /// 检查是否有紧急事项
  bool get hasUrgentItems {
    return todoItems.any((item) => item.priority == TodoPriority.high) ||
           upcomingMaintenance.any((m) => m.isOverdue) ||
           pendingApplications.any((app) => app.isUrgent);
  }

  /// 获取最近活动数量
  int get recentActivityCount {
    return recentActivities.length;
  }

  /// 获取快速操作数量
  int get quickActionCount {
    return quickActions.length;
  }
}

/// 仪表板统计数据模型
@JsonSerializable()
class DashboardStats {
  final VehicleStats vehicles;
  final ApplicationStats applications;
  final DriverStats drivers;
  final MaintenanceStats maintenance;
  final ExpenseStats expenses;
  final SystemStats system;

  const DashboardStats({
    required this.vehicles,
    required this.applications,
    required this.drivers,
    required this.maintenance,
    required this.expenses,
    required this.system,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) => _$DashboardStatsFromJson(json);
  Map<String, dynamic> toJson() => _$DashboardStatsToJson(this);

  /// 获取总体健康度评分（0-100）
  double get overallHealthScore {
    double vehicleScore = vehicles.available / vehicles.total * 100;
    double maintenanceScore = (1 - maintenance.overdueRate) * 100;
    double applicationScore = applications.approvalRate * 100;
    double expenseScore = (1 - expenses.rejectionRate) * 100;
    
    return (vehicleScore + maintenanceScore + applicationScore + expenseScore) / 4;
  }

  /// 检查系统是否健康
  bool get isSystemHealthy {
    return overallHealthScore >= 80;
  }

  /// 获取需要关注的统计项目
  List<String> get attentionItems {
    List<String> items = [];
    
    if (maintenance.overdue > 0) {
      items.add('${maintenance.overdue}个逾期维护');
    }
    
    if (applications.pending > 10) {
      items.add('${applications.pending}个待审批申请');
    }
    
    if (vehicles.maintenance > vehicles.total * 0.2) {
      items.add('${vehicles.maintenance}辆车辆维护中');
    }
    
    if (expenses.pending > 20) {
      items.add('${expenses.pending}个待审批费用');
    }
    
    return items;
  }
}

/// 系统统计数据模型
@JsonSerializable()
class SystemStats {
  final int totalUsers;
  final int activeUsers;
  final int onlineUsers;
  final double systemLoad;
  final double memoryUsage;
  final double diskUsage;
  final DateTime lastBackup;
  final int errorCount;
  final int warningCount;

  const SystemStats({
    required this.totalUsers,
    required this.activeUsers,
    required this.onlineUsers,
    required this.systemLoad,
    required this.memoryUsage,
    required this.diskUsage,
    required this.lastBackup,
    required this.errorCount,
    required this.warningCount,
  });

  factory SystemStats.fromJson(Map<String, dynamic> json) => _$SystemStatsFromJson(json);
  Map<String, dynamic> toJson() => _$SystemStatsToJson(this);

  /// 获取用户活跃率
  double get userActivityRate {
    if (totalUsers == 0) return 0.0;
    return activeUsers / totalUsers;
  }

  /// 获取在线用户率
  double get onlineUserRate {
    if (activeUsers == 0) return 0.0;
    return onlineUsers / activeUsers;
  }

  /// 检查系统负载是否正常
  bool get isLoadNormal {
    return systemLoad < 0.8;
  }

  /// 检查内存使用是否正常
  bool get isMemoryNormal {
    return memoryUsage < 0.8;
  }

  /// 检查磁盘使用是否正常
  bool get isDiskNormal {
    return diskUsage < 0.8;
  }

  /// 检查备份是否及时（24小时内）
  bool get isBackupRecent {
    return DateTime.now().difference(lastBackup).inHours <= 24;
  }

  /// 检查系统是否健康
  bool get isSystemHealthy {
    return isLoadNormal && isMemoryNormal && isDiskNormal && 
           errorCount == 0 && isBackupRecent;
  }
}

/// 活动记录模型
@JsonSerializable()
class ActivityRecord {
  final String id;
  final ActivityType type;
  final String title;
  final String description;
  final String? entityId;
  final String? entityType;
  final String userId;
  final String userName;
  final String? userAvatar;
  final DateTime timestamp;
  final Map<String, dynamic>? metadata;

  const ActivityRecord({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    this.entityId,
    this.entityType,
    required this.userId,
    required this.userName,
    this.userAvatar,
    required this.timestamp,
    this.metadata,
  });

  factory ActivityRecord.fromJson(Map<String, dynamic> json) => _$ActivityRecordFromJson(json);
  Map<String, dynamic> toJson() => _$ActivityRecordToJson(this);

  /// 获取活动年龄（分钟）
  int get ageInMinutes {
    return DateTime.now().difference(timestamp).inMinutes;
  }

  /// 检查活动是否为最近的（1小时内）
  bool get isRecent {
    return ageInMinutes <= 60;
  }

  /// 获取格式化时间
  String get formattedTime {
    final now = DateTime.now();
    final diff = now.difference(timestamp);
    
    if (diff.inMinutes < 1) {
      return '刚刚';
    } else if (diff.inMinutes < 60) {
      return '${diff.inMinutes}分钟前';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}小时前';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}天前';
    } else {
      return '${timestamp.month}月${timestamp.day}日';
    }
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ActivityRecord && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'ActivityRecord{id: $id, type: $type, title: $title, user: $userName}';
  }
}

/// 活动类型枚举
enum ActivityType {
  @JsonValue('vehicle_created')
  vehicleCreated,
  @JsonValue('vehicle_updated')
  vehicleUpdated,
  @JsonValue('vehicle_deleted')
  vehicleDeleted,
  @JsonValue('application_submitted')
  applicationSubmitted,
  @JsonValue('application_approved')
  applicationApproved,
  @JsonValue('application_rejected')
  applicationRejected,
  @JsonValue('driver_created')
  driverCreated,
  @JsonValue('driver_updated')
  driverUpdated,
  @JsonValue('maintenance_scheduled')
  maintenanceScheduled,
  @JsonValue('maintenance_completed')
  maintenanceCompleted,
  @JsonValue('expense_submitted')
  expenseSubmitted,
  @JsonValue('expense_approved')
  expenseApproved,
  @JsonValue('user_login')
  userLogin,
  @JsonValue('user_logout')
  userLogout,
  @JsonValue('system_backup')
  systemBackup,
  @JsonValue('system_error')
  systemError,
}

/// 活动类型扩展
extension ActivityTypeExtension on ActivityType {
  String get label {
    switch (this) {
      case ActivityType.vehicleCreated:
        return '车辆创建';
      case ActivityType.vehicleUpdated:
        return '车辆更新';
      case ActivityType.vehicleDeleted:
        return '车辆删除';
      case ActivityType.applicationSubmitted:
        return '申请提交';
      case ActivityType.applicationApproved:
        return '申请批准';
      case ActivityType.applicationRejected:
        return '申请拒绝';
      case ActivityType.driverCreated:
        return '驾驶员创建';
      case ActivityType.driverUpdated:
        return '驾驶员更新';
      case ActivityType.maintenanceScheduled:
        return '维护安排';
      case ActivityType.maintenanceCompleted:
        return '维护完成';
      case ActivityType.expenseSubmitted:
        return '费用提交';
      case ActivityType.expenseApproved:
        return '费用批准';
      case ActivityType.userLogin:
        return '用户登录';
      case ActivityType.userLogout:
        return '用户登出';
      case ActivityType.systemBackup:
        return '系统备份';
      case ActivityType.systemError:
        return '系统错误';
    }
  }

  String get icon {
    switch (this) {
      case ActivityType.vehicleCreated:
      case ActivityType.vehicleUpdated:
      case ActivityType.vehicleDeleted:
        return '🚗';
      case ActivityType.applicationSubmitted:
      case ActivityType.applicationApproved:
      case ActivityType.applicationRejected:
        return '📋';
      case ActivityType.driverCreated:
      case ActivityType.driverUpdated:
        return '👤';
      case ActivityType.maintenanceScheduled:
      case ActivityType.maintenanceCompleted:
        return '🔧';
      case ActivityType.expenseSubmitted:
      case ActivityType.expenseApproved:
        return '💰';
      case ActivityType.userLogin:
      case ActivityType.userLogout:
        return '🔐';
      case ActivityType.systemBackup:
        return '💾';
      case ActivityType.systemError:
        return '⚠️';
    }
  }
}

/// 待办事项模型
@JsonSerializable()
class TodoItem {
  final String id;
  final String title;
  final String description;
  final TodoType type;
  final TodoPriority priority;
  final DateTime dueDate;
  final String? entityId;
  final String? entityType;
  final String? assignedTo;
  final String? assignedToName;
  final bool isCompleted;
  final DateTime createdAt;

  const TodoItem({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.priority,
    required this.dueDate,
    this.entityId,
    this.entityType,
    this.assignedTo,
    this.assignedToName,
    required this.isCompleted,
    required this.createdAt,
  });

  factory TodoItem.fromJson(Map<String, dynamic> json) => _$TodoItemFromJson(json);
  Map<String, dynamic> toJson() => _$TodoItemToJson(this);

  /// 检查待办事项是否逾期
  bool get isOverdue {
    if (isCompleted) return false;
    return DateTime.now().isAfter(dueDate);
  }

  /// 检查待办事项是否即将到期（24小时内）
  bool get isDueSoon {
    if (isCompleted) return false;
    final now = DateTime.now();
    final hoursUntilDue = dueDate.difference(now).inHours;
    return hoursUntilDue <= 24 && hoursUntilDue >= 0;
  }

  /// 获取距离到期时间（小时）
  int get hoursUntilDue {
    return dueDate.difference(DateTime.now()).inHours;
  }

  /// 获取格式化到期时间
  String get formattedDueDate {
    final now = DateTime.now();
    final diff = dueDate.difference(now);
    
    if (isOverdue) {
      final overdueDiff = now.difference(dueDate);
      if (overdueDiff.inHours < 24) {
        return '逾期${overdueDiff.inHours}小时';
      } else {
        return '逾期${overdueDiff.inDays}天';
      }
    } else if (diff.inHours < 1) {
      return '${diff.inMinutes}分钟内到期';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}小时内到期';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}天内到期';
    } else {
      return '${dueDate.month}月${dueDate.day}日到期';
    }
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is TodoItem && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'TodoItem{id: $id, title: $title, priority: $priority, dueDate: $dueDate}';
  }
}

/// 待办事项类型枚举
enum TodoType {
  @JsonValue('maintenance')
  maintenance,
  @JsonValue('application')
  application,
  @JsonValue('expense')
  expense,
  @JsonValue('inspection')
  inspection,
  @JsonValue('renewal')
  renewal,
  @JsonValue('other')
  other,
}

/// 待办事项类型扩展
extension TodoTypeExtension on TodoType {
  String get label {
    switch (this) {
      case TodoType.maintenance:
        return '维护';
      case TodoType.application:
        return '申请';
      case TodoType.expense:
        return '费用';
      case TodoType.inspection:
        return '检查';
      case TodoType.renewal:
        return '续期';
      case TodoType.other:
        return '其他';
    }
  }
}

/// 待办事项优先级枚举
enum TodoPriority {
  @JsonValue('low')
  low,
  @JsonValue('medium')
  medium,
  @JsonValue('high')
  high,
  @JsonValue('urgent')
  urgent,
}

/// 待办事项优先级扩展
extension TodoPriorityExtension on TodoPriority {
  String get label {
    switch (this) {
      case TodoPriority.low:
        return '低';
      case TodoPriority.medium:
        return '中';
      case TodoPriority.high:
        return '高';
      case TodoPriority.urgent:
        return '紧急';
    }
  }

  int get value {
    switch (this) {
      case TodoPriority.low:
        return 1;
      case TodoPriority.medium:
        return 2;
      case TodoPriority.high:
        return 3;
      case TodoPriority.urgent:
        return 4;
    }
  }
}

/// 快速操作模型
@JsonSerializable()
class QuickAction {
  final String id;
  final String title;
  final String description;
  final String icon;
  final String route;
  final Map<String, dynamic>? params;
  final bool isEnabled;
  final String? permission;

  const QuickAction({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.route,
    this.params,
    required this.isEnabled,
    this.permission,
  });

  factory QuickAction.fromJson(Map<String, dynamic> json) => _$QuickActionFromJson(json);
  Map<String, dynamic> toJson() => _$QuickActionToJson(this);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is QuickAction && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'QuickAction{id: $id, title: $title, route: $route}';
  }
}

/// 使用情况图表数据模型
@JsonSerializable()
class UsageChartData {
  final String title;
  final String subtitle;
  final List<ChartDataPoint> data;
  final ChartType type;
  final String xAxisLabel;
  final String yAxisLabel;
  final DateTime startDate;
  final DateTime endDate;

  const UsageChartData({
    required this.title,
    required this.subtitle,
    required this.data,
    required this.type,
    required this.xAxisLabel,
    required this.yAxisLabel,
    required this.startDate,
    required this.endDate,
  });

  factory UsageChartData.fromJson(Map<String, dynamic> json) => _$UsageChartDataFromJson(json);
  Map<String, dynamic> toJson() => _$UsageChartDataToJson(this);

  /// 获取最大值
  double get maxValue {
    if (data.isEmpty) return 0.0;
    return data.map((point) => point.value).reduce((a, b) => a > b ? a : b);
  }

  /// 获取最小值
  double get minValue {
    if (data.isEmpty) return 0.0;
    return data.map((point) => point.value).reduce((a, b) => a < b ? a : b);
  }

  /// 获取平均值
  double get averageValue {
    if (data.isEmpty) return 0.0;
    final sum = data.map((point) => point.value).reduce((a, b) => a + b);
    return sum / data.length;
  }

  /// 获取总和
  double get totalValue {
    if (data.isEmpty) return 0.0;
    return data.map((point) => point.value).reduce((a, b) => a + b);
  }

  /// 获取数据点数量
  int get dataPointCount {
    return data.length;
  }
}

/// 费用图表数据模型
@JsonSerializable()
class ExpenseChartData {
  final String title;
  final String subtitle;
  final List<ChartDataPoint> data;
  final ChartType type;
  final String xAxisLabel;
  final String yAxisLabel;
  final String currency;
  final DateTime startDate;
  final DateTime endDate;

  const ExpenseChartData({
    required this.title,
    required this.subtitle,
    required this.data,
    required this.type,
    required this.xAxisLabel,
    required this.yAxisLabel,
    required this.currency,
    required this.startDate,
    required this.endDate,
  });

  factory ExpenseChartData.fromJson(Map<String, dynamic> json) => _$ExpenseChartDataFromJson(json);
  Map<String, dynamic> toJson() => _$ExpenseChartDataToJson(this);

  /// 获取最大费用
  double get maxExpense {
    if (data.isEmpty) return 0.0;
    return data.map((point) => point.value).reduce((a, b) => a > b ? a : b);
  }

  /// 获取最小费用
  double get minExpense {
    if (data.isEmpty) return 0.0;
    return data.map((point) => point.value).reduce((a, b) => a < b ? a : b);
  }

  /// 获取平均费用
  double get averageExpense {
    if (data.isEmpty) return 0.0;
    final sum = data.map((point) => point.value).reduce((a, b) => a + b);
    return sum / data.length;
  }

  /// 获取总费用
  double get totalExpense {
    if (data.isEmpty) return 0.0;
    return data.map((point) => point.value).reduce((a, b) => a + b);
  }

  /// 获取格式化总费用
  String get formattedTotalExpense {
    return '$currency ${totalExpense.toStringAsFixed(2)}';
  }

  /// 获取格式化平均费用
  String get formattedAverageExpense {
    return '$currency ${averageExpense.toStringAsFixed(2)}';
  }
}

/// 图表数据点模型
@JsonSerializable()
class ChartDataPoint {
  final String label;
  final double value;
  final String? color;
  final DateTime? timestamp;
  final Map<String, dynamic>? metadata;

  const ChartDataPoint({
    required this.label,
    required this.value,
    this.color,
    this.timestamp,
    this.metadata,
  });

  factory ChartDataPoint.fromJson(Map<String, dynamic> json) => _$ChartDataPointFromJson(json);
  Map<String, dynamic> toJson() => _$ChartDataPointToJson(this);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ChartDataPoint && 
           other.label == label && 
           other.value == value &&
           other.timestamp == timestamp;
  }

  @override
  int get hashCode => Object.hash(label, value, timestamp);

  @override
  String toString() {
    return 'ChartDataPoint{label: $label, value: $value, timestamp: $timestamp}';
  }
}

/// 图表类型枚举
enum ChartType {
  @JsonValue('line')
  line,
  @JsonValue('bar')
  bar,
  @JsonValue('pie')
  pie,
  @JsonValue('area')
  area,
  @JsonValue('scatter')
  scatter,
}

/// 图表类型扩展
extension ChartTypeExtension on ChartType {
  String get label {
    switch (this) {
      case ChartType.line:
        return '折线图';
      case ChartType.bar:
        return '柱状图';
      case ChartType.pie:
        return '饼图';
      case ChartType.area:
        return '面积图';
      case ChartType.scatter:
        return '散点图';
    }
  }
}
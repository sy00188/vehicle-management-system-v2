/// 应用权限常量定义
class AppPermissions {
  // 车辆管理权限
  static const String permissionVehicleView = 'vehicle:view';
  static const String permissionVehicleCreate = 'vehicle:create';
  static const String permissionVehicleEdit = 'vehicle:edit';
  static const String permissionVehicleDelete = 'vehicle:delete';
  
  // 申请管理权限
  static const String permissionApplicationView = 'application:view';
  static const String permissionApplicationCreate = 'application:create';
  static const String permissionApplicationEdit = 'application:edit';
  static const String permissionApplicationDelete = 'application:delete';
  static const String permissionApplicationApprove = 'application:approve';
  
  // 驾驶员管理权限
  static const String permissionDriverView = 'driver:view';
  static const String permissionDriverCreate = 'driver:create';
  static const String permissionDriverEdit = 'driver:edit';
  static const String permissionDriverDelete = 'driver:delete';
  
  // 维护管理权限
  static const String permissionMaintenanceView = 'maintenance:view';
  static const String permissionMaintenanceCreate = 'maintenance:create';
  static const String permissionMaintenanceEdit = 'maintenance:edit';
  static const String permissionMaintenanceDelete = 'maintenance:delete';
  
  // 费用管理权限
  static const String permissionExpenseView = 'expense:view';
  static const String permissionExpenseCreate = 'expense:create';
  static const String permissionExpenseEdit = 'expense:edit';
  static const String permissionExpenseDelete = 'expense:delete';
  static const String permissionExpenseApprove = 'expense:approve';
  
  // 系统管理权限
  static const String permissionSystemUserManage = 'system:user:manage';
  static const String permissionSystemRoleManage = 'system:role:manage';
  static const String permissionSystemPermissionManage = 'system:permission:manage';
  static const String permissionSystemConfigManage = 'system:config:manage';
  static const String permissionSystemLogView = 'system:log:view';
  
  // 报表权限
  static const String permissionReportView = 'report:view';
  static const String permissionReportExport = 'report:export';
  
  // 通知权限
  static const String permissionNotificationSend = 'notification:send';
  static const String permissionNotificationManage = 'notification:manage';
  
  /// 获取所有权限列表
  static List<String> getAllPermissions() {
    return [
      // 车辆管理
      permissionVehicleView,
      permissionVehicleCreate,
      permissionVehicleEdit,
      permissionVehicleDelete,
      
      // 申请管理
      permissionApplicationView,
      permissionApplicationCreate,
      permissionApplicationEdit,
      permissionApplicationDelete,
      permissionApplicationApprove,
      
      // 驾驶员管理
      permissionDriverView,
      permissionDriverCreate,
      permissionDriverEdit,
      permissionDriverDelete,
      
      // 维护管理
      permissionMaintenanceView,
      permissionMaintenanceCreate,
      permissionMaintenanceEdit,
      permissionMaintenanceDelete,
      
      // 费用管理
      permissionExpenseView,
      permissionExpenseCreate,
      permissionExpenseEdit,
      permissionExpenseDelete,
      permissionExpenseApprove,
      
      // 系统管理
      permissionSystemUserManage,
      permissionSystemRoleManage,
      permissionSystemPermissionManage,
      permissionSystemConfigManage,
      permissionSystemLogView,
      
      // 报表
      permissionReportView,
      permissionReportExport,
      
      // 通知
      permissionNotificationSend,
      permissionNotificationManage,
    ];
  }
  
  /// 获取权限的显示名称
  static String getPermissionDisplayName(String permission) {
    switch (permission) {
      // 车辆管理
      case permissionVehicleView:
        return '查看车辆';
      case permissionVehicleCreate:
        return '创建车辆';
      case permissionVehicleEdit:
        return '编辑车辆';
      case permissionVehicleDelete:
        return '删除车辆';
        
      // 申请管理
      case permissionApplicationView:
        return '查看申请';
      case permissionApplicationCreate:
        return '创建申请';
      case permissionApplicationEdit:
        return '编辑申请';
      case permissionApplicationDelete:
        return '删除申请';
      case permissionApplicationApprove:
        return '审批申请';
        
      // 驾驶员管理
      case permissionDriverView:
        return '查看驾驶员';
      case permissionDriverCreate:
        return '创建驾驶员';
      case permissionDriverEdit:
        return '编辑驾驶员';
      case permissionDriverDelete:
        return '删除驾驶员';
        
      // 维护管理
      case permissionMaintenanceView:
        return '查看维护记录';
      case permissionMaintenanceCreate:
        return '创建维护记录';
      case permissionMaintenanceEdit:
        return '编辑维护记录';
      case permissionMaintenanceDelete:
        return '删除维护记录';
        
      // 费用管理
      case permissionExpenseView:
        return '查看费用';
      case permissionExpenseCreate:
        return '创建费用';
      case permissionExpenseEdit:
        return '编辑费用';
      case permissionExpenseDelete:
        return '删除费用';
      case permissionExpenseApprove:
        return '审批费用';
        
      // 系统管理
      case permissionSystemUserManage:
        return '用户管理';
      case permissionSystemRoleManage:
        return '角色管理';
      case permissionSystemPermissionManage:
        return '权限管理';
      case permissionSystemConfigManage:
        return '系统配置';
      case permissionSystemLogView:
        return '查看日志';
        
      // 报表
      case permissionReportView:
        return '查看报表';
      case permissionReportExport:
        return '导出报表';
        
      // 通知
      case permissionNotificationSend:
        return '发送通知';
      case permissionNotificationManage:
        return '通知管理';
        
      default:
        return permission;
    }
  }
  
  /// 按模块分组权限
  static Map<String, List<String>> getPermissionsByModule() {
    return {
      '车辆管理': [
        permissionVehicleView,
        permissionVehicleCreate,
        permissionVehicleEdit,
        permissionVehicleDelete,
      ],
      '申请管理': [
        permissionApplicationView,
        permissionApplicationCreate,
        permissionApplicationEdit,
        permissionApplicationDelete,
        permissionApplicationApprove,
      ],
      '驾驶员管理': [
        permissionDriverView,
        permissionDriverCreate,
        permissionDriverEdit,
        permissionDriverDelete,
      ],
      '维护管理': [
        permissionMaintenanceView,
        permissionMaintenanceCreate,
        permissionMaintenanceEdit,
        permissionMaintenanceDelete,
      ],
      '费用管理': [
        permissionExpenseView,
        permissionExpenseCreate,
        permissionExpenseEdit,
        permissionExpenseDelete,
        permissionExpenseApprove,
      ],
      '系统管理': [
        permissionSystemUserManage,
        permissionSystemRoleManage,
        permissionSystemPermissionManage,
        permissionSystemConfigManage,
        permissionSystemLogView,
      ],
      '报表管理': [
        permissionReportView,
        permissionReportExport,
      ],
      '通知管理': [
        permissionNotificationSend,
        permissionNotificationManage,
      ],
    };
  }
}
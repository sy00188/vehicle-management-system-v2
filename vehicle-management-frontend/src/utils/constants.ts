// 应用配置常量
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_TITLE || '车辆管理系统',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  tokenKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token',
  userKey: import.meta.env.VITE_USER_STORAGE_KEY || 'user_info',
};

// 分页配置
export const PAGINATION = {
  defaultPageSize: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20,
  maxPageSize: Number(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,
  pageSizeOptions: [10, 20, 50, 100],
};

// 文件上传配置
export const FILE_UPLOAD = {
  maxSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  allowedTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ],
  imageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// 车辆状态
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired',
} as const;

export const VEHICLE_STATUS_LABELS = {
  [VEHICLE_STATUS.AVAILABLE]: '可用',
  [VEHICLE_STATUS.IN_USE]: '使用中',
  [VEHICLE_STATUS.MAINTENANCE]: '维修中',
  [VEHICLE_STATUS.RETIRED]: '已退役',
};

export const VEHICLE_STATUS_COLORS = {
  [VEHICLE_STATUS.AVAILABLE]: 'success',
  [VEHICLE_STATUS.IN_USE]: 'warning',
  [VEHICLE_STATUS.MAINTENANCE]: 'error',
  [VEHICLE_STATUS.RETIRED]: 'gray',
} as const;

// 车辆类型
export const VEHICLE_TYPES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  TRUCK: 'truck',
  VAN: 'van',
  BUS: 'bus',
  MOTORCYCLE: 'motorcycle',
} as const;

export const VEHICLE_TYPE_LABELS = {
  [VEHICLE_TYPES.SEDAN]: '轿车',
  [VEHICLE_TYPES.SUV]: 'SUV',
  [VEHICLE_TYPES.TRUCK]: '货车',
  [VEHICLE_TYPES.VAN]: '面包车',
  [VEHICLE_TYPES.BUS]: '客车',
  [VEHICLE_TYPES.MOTORCYCLE]: '摩托车',
};

// 申请状态
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: '待审批',
  [APPLICATION_STATUS.APPROVED]: '已批准',
  [APPLICATION_STATUS.REJECTED]: '已拒绝',
  [APPLICATION_STATUS.IN_PROGRESS]: '进行中',
  [APPLICATION_STATUS.COMPLETED]: '已完成',
  [APPLICATION_STATUS.CANCELLED]: '已取消',
};

export const APPLICATION_STATUS_COLORS = {
  [APPLICATION_STATUS.PENDING]: 'warning',
  [APPLICATION_STATUS.APPROVED]: 'success',
  [APPLICATION_STATUS.REJECTED]: 'error',
  [APPLICATION_STATUS.IN_PROGRESS]: 'primary',
  [APPLICATION_STATUS.COMPLETED]: 'success',
  [APPLICATION_STATUS.CANCELLED]: 'gray',
} as const;

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DRIVER: 'driver',
  USER: 'user',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: '系统管理员',
  [USER_ROLES.MANAGER]: '车队管理员',
  [USER_ROLES.DRIVER]: '驾驶员',
  [USER_ROLES.USER]: '普通用户',
};

// 驾驶员状态
export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  ON_LEAVE: 'on_leave',
  INACTIVE: 'inactive',
} as const;

export const DRIVER_STATUS_LABELS = {
  [DRIVER_STATUS.AVAILABLE]: '空闲',
  [DRIVER_STATUS.BUSY]: '忙碌',
  [DRIVER_STATUS.ON_LEAVE]: '请假',
  [DRIVER_STATUS.INACTIVE]: '停用',
};

export const DRIVER_STATUS_COLORS = {
  [DRIVER_STATUS.AVAILABLE]: 'success',
  [DRIVER_STATUS.BUSY]: 'warning',
  [DRIVER_STATUS.ON_LEAVE]: 'primary',
  [DRIVER_STATUS.INACTIVE]: 'gray',
} as const;

// 驾照类型
export const LICENSE_TYPES = {
  A1: 'A1',
  A2: 'A2',
  A3: 'A3',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
  D1: 'D1',
  D2: 'D2',
  E: 'E',
  F: 'F',
  M: 'M',
  N: 'N',
  P: 'P',
} as const;

export const LICENSE_TYPE_LABELS = {
  [LICENSE_TYPES.A1]: 'A1 - 大型摩托车',
  [LICENSE_TYPES.A2]: 'A2 - 中型摩托车',
  [LICENSE_TYPES.A3]: 'A3 - 三轮摩托车',
  [LICENSE_TYPES.B1]: 'B1 - 中型客车',
  [LICENSE_TYPES.B2]: 'B2 - 大型货车',
  [LICENSE_TYPES.C1]: 'C1 - 小型汽车',
  [LICENSE_TYPES.C2]: 'C2 - 小型自动挡汽车',
  [LICENSE_TYPES.D1]: 'D1 - 普通三轮摩托车',
  [LICENSE_TYPES.D2]: 'D2 - 普通二轮摩托车',
  [LICENSE_TYPES.E]: 'E - 普通二轮摩托车',
  [LICENSE_TYPES.F]: 'F - 轻便摩托车',
  [LICENSE_TYPES.M]: 'M - 轮式自行机械车',
  [LICENSE_TYPES.N]: 'N - 无轨电车',
  [LICENSE_TYPES.P]: 'P - 有轨电车',
};

// 驾驶员排序选项
export const DRIVER_SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  RATING_ASC: 'rating_asc',
  RATING_DESC: 'rating_desc',
  TASKS_ASC: 'tasks_asc',
  TASKS_DESC: 'tasks_desc',
  JOIN_DATE_ASC: 'join_date_asc',
  JOIN_DATE_DESC: 'join_date_desc',
} as const;

export const DRIVER_SORT_LABELS = {
  [DRIVER_SORT_OPTIONS.NAME_ASC]: '姓名 A-Z',
  [DRIVER_SORT_OPTIONS.NAME_DESC]: '姓名 Z-A',
  [DRIVER_SORT_OPTIONS.RATING_ASC]: '评分从低到高',
  [DRIVER_SORT_OPTIONS.RATING_DESC]: '评分从高到低',
  [DRIVER_SORT_OPTIONS.TASKS_ASC]: '任务数从少到多',
  [DRIVER_SORT_OPTIONS.TASKS_DESC]: '任务数从多到少',
  [DRIVER_SORT_OPTIONS.JOIN_DATE_ASC]: '入职时间从早到晚',
  [DRIVER_SORT_OPTIONS.JOIN_DATE_DESC]: '入职时间从晚到早',
};

// 维修状态
export const MAINTENANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const MAINTENANCE_STATUS_LABELS = {
  [MAINTENANCE_STATUS.PENDING]: '待维修',
  [MAINTENANCE_STATUS.IN_PROGRESS]: '维修中',
  [MAINTENANCE_STATUS.COMPLETED]: '已完成',
  [MAINTENANCE_STATUS.CANCELLED]: '已取消',
};

export const MAINTENANCE_STATUS_COLORS = {
  [MAINTENANCE_STATUS.PENDING]: 'warning',
  [MAINTENANCE_STATUS.IN_PROGRESS]: 'primary',
  [MAINTENANCE_STATUS.COMPLETED]: 'success',
  [MAINTENANCE_STATUS.CANCELLED]: 'gray',
} as const;

// 维修类型
export const MAINTENANCE_TYPE = {
  ROUTINE: 'routine',
  REPAIR: 'repair',
  EMERGENCY: 'emergency',
  INSPECTION: 'inspection',
} as const;

export const MAINTENANCE_TYPE_LABELS = {
  [MAINTENANCE_TYPE.ROUTINE]: '例行保养',
  [MAINTENANCE_TYPE.REPAIR]: '故障维修',
  [MAINTENANCE_TYPE.EMERGENCY]: '紧急维修',
  [MAINTENANCE_TYPE.INSPECTION]: '安全检查',
};

// 维修优先级
export const MAINTENANCE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const MAINTENANCE_PRIORITY_LABELS = {
  [MAINTENANCE_PRIORITY.LOW]: '低',
  [MAINTENANCE_PRIORITY.MEDIUM]: '中',
  [MAINTENANCE_PRIORITY.HIGH]: '高',
  [MAINTENANCE_PRIORITY.URGENT]: '紧急',
};

export const MAINTENANCE_PRIORITY_COLORS = {
  [MAINTENANCE_PRIORITY.LOW]: 'gray',
  [MAINTENANCE_PRIORITY.MEDIUM]: 'primary',
  [MAINTENANCE_PRIORITY.HIGH]: 'warning',
  [MAINTENANCE_PRIORITY.URGENT]: 'error',
} as const;

// 维修排序选项
export const MAINTENANCE_SORT_OPTIONS = {
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  PRIORITY_ASC: 'priority_asc',
  PRIORITY_DESC: 'priority_desc',
  COST_ASC: 'cost_asc',
  COST_DESC: 'cost_desc',
  STATUS_ASC: 'status_asc',
  STATUS_DESC: 'status_desc',
} as const;

export const MAINTENANCE_SORT_LABELS = {
  [MAINTENANCE_SORT_OPTIONS.DATE_ASC]: '日期从早到晚',
  [MAINTENANCE_SORT_OPTIONS.DATE_DESC]: '日期从晚到早',
  [MAINTENANCE_SORT_OPTIONS.PRIORITY_ASC]: '优先级从低到高',
  [MAINTENANCE_SORT_OPTIONS.PRIORITY_DESC]: '优先级从高到低',
  [MAINTENANCE_SORT_OPTIONS.COST_ASC]: '费用从低到高',
  [MAINTENANCE_SORT_OPTIONS.COST_DESC]: '费用从高到低',
  [MAINTENANCE_SORT_OPTIONS.STATUS_ASC]: '状态 A-Z',
  [MAINTENANCE_SORT_OPTIONS.STATUS_DESC]: '状态 Z-A',
};

// 费用管理相关常量
export const EXPENSE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;

export const EXPENSE_STATUS_LABELS = {
  [EXPENSE_STATUS.PENDING]: '待审批',
  [EXPENSE_STATUS.APPROVED]: '已批准',
  [EXPENSE_STATUS.REJECTED]: '已拒绝',
  [EXPENSE_STATUS.PAID]: '已支付',
};

export const EXPENSE_STATUS_COLORS = {
  [EXPENSE_STATUS.PENDING]: 'warning',
  [EXPENSE_STATUS.APPROVED]: 'success',
  [EXPENSE_STATUS.REJECTED]: 'error',
  [EXPENSE_STATUS.PAID]: 'gray',
} as const;

export const EXPENSE_TYPE = {
  FUEL: 'fuel',
  MAINTENANCE: 'maintenance',
  INSURANCE: 'insurance',
  REGISTRATION: 'registration',
  FINE: 'fine',
  PARKING: 'parking',
  TOLL: 'toll',
  OTHER: 'other',
} as const;

export const EXPENSE_TYPE_LABELS = {
  [EXPENSE_TYPE.FUEL]: '燃油费',
  [EXPENSE_TYPE.MAINTENANCE]: '维修费',
  [EXPENSE_TYPE.INSURANCE]: '保险费',
  [EXPENSE_TYPE.REGISTRATION]: '注册费',
  [EXPENSE_TYPE.FINE]: '罚款',
  [EXPENSE_TYPE.PARKING]: '停车费',
  [EXPENSE_TYPE.TOLL]: '过路费',
  [EXPENSE_TYPE.OTHER]: '其他',
};

export const EXPENSE_TYPE_COLORS = {
  [EXPENSE_TYPE.FUEL]: 'orange',
  [EXPENSE_TYPE.MAINTENANCE]: 'blue',
  [EXPENSE_TYPE.INSURANCE]: 'green',
  [EXPENSE_TYPE.REGISTRATION]: 'purple',
  [EXPENSE_TYPE.FINE]: 'error',
  [EXPENSE_TYPE.PARKING]: 'purple',
  [EXPENSE_TYPE.TOLL]: 'green',
  [EXPENSE_TYPE.OTHER]: 'gray',
} as const;

export const EXPENSE_SORT_OPTIONS = {
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  AMOUNT_ASC: 'amount_asc',
  AMOUNT_DESC: 'amount_desc',
  STATUS_ASC: 'status_asc',
  STATUS_DESC: 'status_desc',
} as const;

export const EXPENSE_SORT_LABELS = {
  [EXPENSE_SORT_OPTIONS.DATE_ASC]: '日期从早到晚',
  [EXPENSE_SORT_OPTIONS.DATE_DESC]: '日期从晚到早',
  [EXPENSE_SORT_OPTIONS.AMOUNT_ASC]: '金额从低到高',
  [EXPENSE_SORT_OPTIONS.AMOUNT_DESC]: '金额从高到低',
  [EXPENSE_SORT_OPTIONS.STATUS_ASC]: '状态 A-Z',
  [EXPENSE_SORT_OPTIONS.STATUS_DESC]: '状态 Z-A',
};

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: '/vehicles/:id',
  APPLICATIONS: '/applications',
  APPLICATION_DETAIL: '/applications/:id',
  DRIVERS: '/drivers',
  DRIVER_DETAIL: '/drivers/:id',
  EXPENSES: '/expenses',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// 导航菜单
export const NAVIGATION_ITEMS = [
  {
    key: 'dashboard',
    label: '仪表板',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
  },
  {
    key: 'vehicles',
    label: '车辆管理',
    path: ROUTES.VEHICLES,
    icon: 'vehicles',
  },
  {
    key: 'applications',
    label: '申请管理',
    path: ROUTES.APPLICATIONS,
    icon: 'applications',
  },
  {
    key: 'drivers',
    label: '驾驶员管理',
    path: ROUTES.DRIVERS,
    icon: 'drivers',
  },
  {
    key: 'expenses',
    label: '费用管理',
    path: ROUTES.EXPENSES,
    icon: 'expenses',
  },
  {
    key: 'notifications',
    label: '通知管理',
    path: ROUTES.NOTIFICATIONS,
    icon: 'notifications',
  },
  {
    key: 'reports',
    label: '报表分析',
    path: '/reports',
    icon: 'reports',
  },
  {
    key: 'settings',
    label: '系统设置',
    path: ROUTES.SETTINGS,
    icon: 'settings',
  },
];

// 时间格式
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '权限不足，无法访问该资源',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '数据验证失败，请检查输入内容',
  FILE_TOO_LARGE: '文件大小超出限制',
  FILE_TYPE_NOT_ALLOWED: '不支持的文件类型',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  CREATE_SUCCESS: '创建成功',
  UPLOAD_SUCCESS: '上传成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
};

// 设置管理相关常量
export const SETTINGS_TABS = {
  USER_MANAGEMENT: 'user_management',
  PERMISSION_CONFIG: 'permission_config',
  SYSTEM_PARAMS: 'system_params',
  BACKUP_RESTORE: 'backup_restore',
  SYSTEM_LOGS: 'system_logs',
} as const;

export const SETTINGS_TAB_LABELS = {
  [SETTINGS_TABS.USER_MANAGEMENT]: '用户管理',
  [SETTINGS_TABS.PERMISSION_CONFIG]: '权限配置',
  [SETTINGS_TABS.SYSTEM_PARAMS]: '系统参数',
  [SETTINGS_TABS.BACKUP_RESTORE]: '备份恢复',
  [SETTINGS_TABS.SYSTEM_LOGS]: '系统日志',
};

// 权限模块
export const PERMISSION_MODULES = {
  DASHBOARD: 'dashboard',
  VEHICLES: 'vehicles',
  APPLICATIONS: 'applications',
  DRIVERS: 'drivers',
  MAINTENANCE: 'maintenance',
  EXPENSES: 'expenses',
  SETTINGS: 'settings',
  REPORTS: 'reports',
} as const;

export const PERMISSION_MODULE_LABELS = {
  [PERMISSION_MODULES.DASHBOARD]: '仪表板',
  [PERMISSION_MODULES.VEHICLES]: '车辆管理',
  [PERMISSION_MODULES.APPLICATIONS]: '申请管理',
  [PERMISSION_MODULES.DRIVERS]: '驾驶员管理',
  [PERMISSION_MODULES.MAINTENANCE]: '维修管理',
  [PERMISSION_MODULES.EXPENSES]: '费用管理',
  [PERMISSION_MODULES.SETTINGS]: '系统设置',
  [PERMISSION_MODULES.REPORTS]: '报表管理',
};

// 权限操作
export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  APPROVE: 'approve',
  EXPORT: 'export',
} as const;

export const PERMISSION_ACTION_LABELS = {
  [PERMISSION_ACTIONS.VIEW]: '查看',
  [PERMISSION_ACTIONS.CREATE]: '新增',
  [PERMISSION_ACTIONS.EDIT]: '编辑',
  [PERMISSION_ACTIONS.DELETE]: '删除',
  [PERMISSION_ACTIONS.APPROVE]: '审批',
  [PERMISSION_ACTIONS.EXPORT]: '导出',
};

// 系统参数类型
export const SYSTEM_PARAM_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  JSON: 'json',
} as const;

export const SYSTEM_PARAM_TYPE_LABELS = {
  [SYSTEM_PARAM_TYPES.TEXT]: '文本',
  [SYSTEM_PARAM_TYPES.NUMBER]: '数字',
  [SYSTEM_PARAM_TYPES.BOOLEAN]: '布尔值',
  [SYSTEM_PARAM_TYPES.SELECT]: '选择',
  [SYSTEM_PARAM_TYPES.JSON]: 'JSON',
};

// 备份状态
export const BACKUP_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const BACKUP_STATUS_LABELS = {
  [BACKUP_STATUS.PENDING]: '等待中',
  [BACKUP_STATUS.IN_PROGRESS]: '进行中',
  [BACKUP_STATUS.COMPLETED]: '已完成',
  [BACKUP_STATUS.FAILED]: '失败',
};

export const BACKUP_STATUS_COLORS = {
  [BACKUP_STATUS.PENDING]: 'warning',
  [BACKUP_STATUS.IN_PROGRESS]: 'primary',
  [BACKUP_STATUS.COMPLETED]: 'success',
  [BACKUP_STATUS.FAILED]: 'error',
} as const;

// 日志级别
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export const LOG_LEVEL_LABELS = {
  [LOG_LEVELS.DEBUG]: '调试',
  [LOG_LEVELS.INFO]: '信息',
  [LOG_LEVELS.WARN]: '警告',
  [LOG_LEVELS.ERROR]: '错误',
};

export const LOG_LEVEL_COLORS = {
  [LOG_LEVELS.DEBUG]: 'gray',
  [LOG_LEVELS.INFO]: 'primary',
  [LOG_LEVELS.WARN]: 'warning',
  [LOG_LEVELS.ERROR]: 'error',
} as const;

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
  PENDING: 'pending',
} as const;

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: '正常',
  [USER_STATUS.INACTIVE]: '停用',
  [USER_STATUS.LOCKED]: '锁定',
  [USER_STATUS.PENDING]: '待激活',
};

export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.INACTIVE]: 'gray',
  [USER_STATUS.LOCKED]: 'error',
  [USER_STATUS.PENDING]: 'warning',
} as const;

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPES.SUCCESS]: '成功',
  [NOTIFICATION_TYPES.ERROR]: '错误',
  [NOTIFICATION_TYPES.WARNING]: '警告',
  [NOTIFICATION_TYPES.INFO]: '信息',
};

export const NOTIFICATION_TYPE_COLORS = {
  [NOTIFICATION_TYPES.SUCCESS]: 'success',
  [NOTIFICATION_TYPES.ERROR]: 'error',
  [NOTIFICATION_TYPES.WARNING]: 'warning',
  [NOTIFICATION_TYPES.INFO]: 'primary',
} as const;

// 通知状态
export const NOTIFICATION_STATUS = {
  READ: 'read',
  UNREAD: 'unread',
} as const;

export const NOTIFICATION_STATUS_LABELS = {
  [NOTIFICATION_STATUS.READ]: '已读',
  [NOTIFICATION_STATUS.UNREAD]: '未读',
};

// 通知排序选项
export const NOTIFICATION_SORT_OPTIONS = {
  DATE_DESC: 'date_desc',
  DATE_ASC: 'date_asc',
  TYPE_ASC: 'type_asc',
  TYPE_DESC: 'type_desc',
  STATUS_ASC: 'status_asc',
  STATUS_DESC: 'status_desc',
} as const;

export const NOTIFICATION_SORT_LABELS = {
  [NOTIFICATION_SORT_OPTIONS.DATE_DESC]: '时间从新到旧',
  [NOTIFICATION_SORT_OPTIONS.DATE_ASC]: '时间从旧到新',
  [NOTIFICATION_SORT_OPTIONS.TYPE_ASC]: '类型 A-Z',
  [NOTIFICATION_SORT_OPTIONS.TYPE_DESC]: '类型 Z-A',
  [NOTIFICATION_SORT_OPTIONS.STATUS_ASC]: '状态 A-Z',
  [NOTIFICATION_SORT_OPTIONS.STATUS_DESC]: '状态 Z-A',
};

// 通知筛选选项
export const NOTIFICATION_FILTER_OPTIONS = {
  ALL: 'all',
  UNREAD: 'unread',
  READ: 'read',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const NOTIFICATION_FILTER_LABELS = {
  [NOTIFICATION_FILTER_OPTIONS.ALL]: '全部',
  [NOTIFICATION_FILTER_OPTIONS.UNREAD]: '未读',
  [NOTIFICATION_FILTER_OPTIONS.READ]: '已读',
  [NOTIFICATION_FILTER_OPTIONS.SUCCESS]: '成功',
  [NOTIFICATION_FILTER_OPTIONS.ERROR]: '错误',
  [NOTIFICATION_FILTER_OPTIONS.WARNING]: '警告',
  [NOTIFICATION_FILTER_OPTIONS.INFO]: '信息',
};
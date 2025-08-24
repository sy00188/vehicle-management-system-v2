// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 车辆相关类型
export interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: 'sedan' | 'suv' | 'truck' | 'van';
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  department: string;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  image?: string;
  purchaseDate: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  currentDriver?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  notes?: string;
  maintenanceType?: string;
  createdAt: string;
  updatedAt: string;
}

// 申请相关类型
export interface Application {
  id: string;
  applicantId: string;
  applicant: User;
  vehicleId?: string;
  vehicle?: Vehicle;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  passengers: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  approvedBy?: string;
  approver?: User;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 驾驶员相关类型
export interface Driver {
  id: string;
  userId: string;
  user: User;
  name: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  experience: number;
  status: 'available' | 'busy' | 'on_leave' | 'inactive';
  phone: string;
  email: string;
  rating: number;
  monthlyTasks: number;
  totalTasks: number;
  currentTask?: string;
  leaveReason?: string;
  leaveEndDate?: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
  updatedAt: string;
}

// 附件类型
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// 审批历史类型
export interface ApprovalHistory {
  id: string;
  action: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'paid';
  userId: string;
  userName: string;
  timestamp: string;
  comment: string;
}

// 费用相关类型
export interface Expense {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  type: 'fuel' | 'maintenance' | 'insurance' | 'registration' | 'fine' | 'parking' | 'toll' | 'other';
  amount: number;
  description: string;
  date: string;
  receiptDate: string;
  receipt?: string;
  attachments?: Attachment[];
  approvedBy?: string;
  approver?: User;
  approvedAt?: string;
  rejectionReason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentDate?: string;
  serviceProvider?: string;
  location?: string;
  duration?: string;
  mileage?: number;
  createdBy: string;
  creator?: User;
  approvalHistory?: ApprovalHistory[];
  createdAt: string;
  updatedAt: string;
}

// 费用统计类型
export interface ExpenseStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  paid: number;
  totalAmount: number;
  monthlyAmount: number;
  fuelCost: number;
  maintenanceCost: number;
  insuranceCost: number;
  otherCost: number;
}

// 费用筛选类型
export interface ExpenseFilters {
  status?: Expense['status'];
  type?: Expense['type'];
  vehicleId?: string;
  createdBy?: string;
  serviceProvider?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

// 维修记录类型
export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  type: 'routine' | 'repair' | 'emergency' | 'inspection';
  description: string;
  cost: number;
  date: string;
  completedDate?: string;
  nextMaintenanceDate?: string;
  serviceProvider: string;
  mileageAtService: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  parts?: string[];
  notes?: string;
  createdBy: string;
  creator: User;
  createdAt: string;
  updatedAt: string;
}

// 维修统计类型
export interface MaintenanceStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  totalCost: number;
  averageCost: number;
}

// 维修筛选类型
export interface MaintenanceFilters {
  status?: MaintenanceRecord['status'];
  type?: MaintenanceRecord['type'];
  priority?: MaintenanceRecord['priority'];
  vehicleId?: string;
  serviceProvider?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 统计数据类型
export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  pendingApplications: number;
  monthlyExpenses: number;
  expenseChange: number;
  usageRate: number;
}

// 图表数据类型
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// 筛选和搜索类型
export interface VehicleFilters {
  status?: Vehicle['status'];
  type?: Vehicle['type'];
  department?: string;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// 车辆统计类型
export interface VehicleStats {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  utilizationRate?: number;
}

// 创建车辆数据类型
export interface CreateVehicleData {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: Vehicle['type'];
  department: string;
  fuelType: Vehicle['fuelType'];
  seats: number;
  purchaseDate: string;
  notes?: string;
}

// 更新车辆数据类型
export interface UpdateVehicleData {
  plateNumber?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  type?: Vehicle['type'];
  status?: Vehicle['status'];
  department?: string;
  mileage?: number;
  fuelType?: Vehicle['fuelType'];
  seats?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  maintenanceType?: string;
}

export interface ApplicationFilters {
  status?: Application['status'];
  applicantId?: string;
  vehicleId?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// 表单类型
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  fullName: string;
  username: string;
  employeeId: string;
  department: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  phone?: string;
  employeeId?: string;
}

export interface VehicleForm {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: Vehicle['type'];
  department: string;
  seats: number;
  fuelType: Vehicle['fuelType'];
  purchaseDate: string;
  mileage: number;
}

export interface ApplicationForm {
  vehicleId: string;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  passengers: number;
  driverRequired: boolean;
  notes?: string;
}

// 仪表板相关类型
export interface ActivityRecord {
  id: string;
  type: 'application' | 'approval' | 'maintenance' | 'vehicle_added' | 'expense';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

export interface TodoItem {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  action: string;
}

export interface UsageChartData {
  month: string;
  usageRate: number;
}

export interface ExpenseChartData {
  category: string;
  amount: number;
  color?: string;
}

// 申请统计类型
export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: number;
}

// 设置管理相关类型
export interface Permission {
  id: string;
  module: string;
  action: string;
  allowed: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserManagement extends User {
  status: 'active' | 'inactive' | 'locked' | 'pending';
  lastLoginAt?: string;
  loginCount: number;
  roles: Role[];
  permissions: Permission[];
}

export interface SystemParameter {
  id: string;
  key: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'json';
  options?: string[];
  description: string;
  category: string;
  isRequired: boolean;
  isReadonly: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BackupRecord {
  id: string;
  name: string;
  type: 'manual' | 'scheduled';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  size?: number;
  filePath?: string;
  downloadUrl?: string;
  description?: string;
  createdBy: string;
  creator: User;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  module: string;
  action: string;
  message: string;
  userId?: string;
  user?: User;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  duration?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface PermissionMatrix {
  [roleId: string]: {
    [module: string]: {
      [action: string]: boolean;
    };
  };
}

export interface SystemInfo {
  version: string;
  environment: string;
  database: {
    type: string;
    version: string;
    size: string;
  };
  server: {
    os: string;
    memory: {
      total: string;
      used: string;
      free: string;
    };
    cpu: {
      cores: number;
      usage: number;
    };
    disk: {
      total: string;
      used: string;
      free: string;
    };
  };
  uptime: string;
  lastBackup?: string;
}

export interface SettingsFilters {
  // 用户管理筛选
  userStatus?: UserManagement['status'];
  userRole?: string;
  userDepartment?: string;
  userSearch?: string;
  
  // 系统参数筛选
  paramCategory?: string;
  paramType?: SystemParameter['type'];
  paramSearch?: string;
  
  // 备份记录筛选
  backupStatus?: BackupRecord['status'];
  backupType?: BackupRecord['type'];
  backupDateRange?: {
    start: string;
    end: string;
  };
  
  // 系统日志筛选
  logLevel?: SystemLog['level'];
  logModule?: string;
  logUserId?: string;
  logDateRange?: {
    start: string;
    end: string;
  };
  logSearch?: string;
}

export interface UserForm {
  username: string;
  email: string;
  name: string;
  department: string;
  roles: string[];
  status: UserManagement['status'];
  password?: string;
  confirmPassword?: string;
}

export interface RoleForm {
  name: string;
  description: string;
  permissions: {
    module: string;
    actions: string[];
  }[];
}

export interface SystemParameterForm {
  key: string;
  name: string;
  value: string;
  type: SystemParameter['type'];
  options?: string[];
  description: string;
  category: string;
  isRequired: boolean;
  validation?: SystemParameter['validation'];
}

export interface BackupForm {
  name: string;
  type: BackupRecord['type'];
  description?: string;
  includeFiles: boolean;
  includeDatabase: boolean;
  compression: boolean;
}
// 费用类型常量
export const EXPENSE_TYPES = {
  FUEL: 'fuel',
  MAINTENANCE: 'maintenance',
  INSURANCE: 'insurance',
  PARKING: 'parking',
  TOLL: 'toll',
  FINE: 'fine',
  OTHER: 'other'
} as const;

// 费用状态常量
export const EXPENSE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid'
} as const;

// 车辆状态常量
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  IN_USE: 'in-use',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired'
} as const;

// 申请状态常量
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// 驾驶员状态常量
export const DRIVER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

// 驾照类型常量
export const LICENSE_TYPES = {
  A1: 'A1',
  A2: 'A2',
  A3: 'A3',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
  D: 'D',
  E: 'E',
  F: 'F',
  M: 'M',
  N: 'N',
  P: 'P'
} as const;

// 维修状态常量
export const MAINTENANCE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// 维修类型常量
export const MAINTENANCE_TYPES = {
  ROUTINE: 'routine',
  REPAIR: 'repair',
  INSPECTION: 'inspection',
  EMERGENCY: 'emergency'
} as const;
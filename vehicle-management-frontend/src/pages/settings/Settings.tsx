import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../../components/ui/AlertDialog';
import Label from '../../components/ui/Label';
// import Switch from '../../components/ui/Switch';
import Textarea from '../../components/ui/Textarea';
import Checkbox from '../../components/ui/Checkbox';
import Progress from '../../components/ui/Progress';
import Separator from '../../components/ui/Separator';
// import ScrollArea from '../../components/ui/ScrollArea';
import {
  Users,
  Shield,
  Settings as SettingsIcon,
  Database,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserPlus,
  Save,
  Server,
  HardDrive,
} from 'lucide-react';
import {
  SETTINGS_TABS,
  SETTINGS_TAB_LABELS,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS,
  PERMISSION_MODULE_LABELS,
  PERMISSION_ACTION_LABELS,
  SYSTEM_PARAM_TYPE_LABELS,
  BACKUP_STATUS_LABELS,
  BACKUP_STATUS_COLORS,
  LOG_LEVEL_LABELS,
  LOG_LEVEL_COLORS,
} from '../../utils/constants';
import type {
  UserManagement,
  Role,
  // SystemParameter,
  BackupRecord,
  SystemLog,
  SystemInfo,
  // User,
} from '../../types';
import { getUsers, /* createUser, updateUser, deleteUser, updateUserStatus, */ getUserStats, type UserFilters } from '../../services/userService';
import { getRoles, createRole, updateRole, deleteRole, getRolePermissions, updateRolePermissions, /* getRoleStats, type RoleFilters, */ type RoleData } from '../../services/roleService';
// import { validateUserForm, hasFormErrors, getPasswordStrength, type UserFormData, type UserFormErrors } from '../../utils/userValidation';
import { systemParamsService, type SystemParam, type SystemParamFormData, type SystemParamQueryParams } from '../../services/systemParamsService';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(SETTINGS_TABS.USER_MANAGEMENT);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isParamDialogOpen, setIsParamDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingParam, setEditingParam] = useState<SystemParam | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 用户管理相关状态
  // const [users, setUsers] = useState<User[]>([]);
  // const [userStats, setUserStats] = useState<any>(null);
  // const [loading, setLoading] = useState(false);
  const [currentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [totalUsers, setTotalUsers] = useState(0);
  // const [userFormData, setUserFormData] = useState<UserFormData>({});
  // const [userFormErrors, setUserFormErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 角色管理相关状态
  const [roles, setRoles] = useState<Role[]>([]);
  // const [roleStats, setRoleStats] = useState<any>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleFormData, setRoleFormData] = useState<Omit<RoleData, 'permissions'> & { permissions?: Record<string, boolean> }>({ name: '', description: '', permissions: {} });
  const [rolePermissions, setRolePermissions] = useState<Record<string, boolean>>({});
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<string>('');

  // 系统参数相关状态
  const [systemParams, setSystemParams] = useState<SystemParam[]>([]);
  // const [paramLoading, setParamLoading] = useState(false);
  // const [paramSearchTerm, setParamSearchTerm] = useState('');
  // const [selectedParamCategory, setSelectedParamCategory] = useState<string>('');
  // const [selectedParamType, setSelectedParamType] = useState<string>('');
  const [paramFormData, setParamFormData] = useState<SystemParamFormData>({
    key: '',
    value: '',
    type: 'STRING',
    category: '',
    description: '',
    isPublic: false
  });
  // const [paramFormErrors, setParamFormErrors] = useState<any>({});
  // const [paramCategories, setParamCategories] = useState<string[]>([]);

  // 组件加载时获取数据
  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  useEffect(() => {
    loadRoles();
    loadRoleStats();
  }, []);

  useEffect(() => {
    if (selectedRoleForPermissions) {
      loadRolePermissions(selectedRoleForPermissions);
    }
  }, [selectedRoleForPermissions]);

  useEffect(() => {
    loadSystemParams();
    // loadParamCategories(); // 暂时注释掉，因为setParamCategories未使用
  }, []); // 注释掉依赖项，因为相关状态变量已被注释

  // Mock data
  const mockUsers: UserManagement[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      name: '系统管理员',
      role: 'admin',
      department: 'IT部门',
      status: 'active',
      lastLoginAt: '2024-01-15 09:30:00',
      loginCount: 156,
      avatar: '/avatars/admin.jpg',
      createdAt: '2023-01-01 00:00:00',
      updatedAt: '2024-01-15 09:30:00',
      roles: [
        {
          id: 'role-1',
          name: '超级管理员',
          description: '拥有系统所有权限',
          permissions: [],
          isSystem: true,
          createdAt: '2023-01-01 00:00:00',
          updatedAt: '2023-01-01 00:00:00',
        },
      ],
      permissions: [],
    },
    {
      id: '2',
      username: 'manager1',
      email: 'manager1@company.com',
      name: '张经理',
      role: 'manager',
      department: '运营部',
      status: 'active',
      lastLoginAt: '2024-01-15 08:45:00',
      loginCount: 89,
      createdAt: '2023-06-01 00:00:00',
      updatedAt: '2024-01-15 08:45:00',
      roles: [
        {
          id: 'role-2',
          name: '车队管理员',
          description: '管理车辆和驾驶员',
          permissions: [],
          isSystem: false,
          createdAt: '2023-06-01 00:00:00',
          updatedAt: '2023-06-01 00:00:00',
        },
      ],
      permissions: [],
    },
    {
      id: '3',
      username: 'driver1',
      email: 'driver1@company.com',
      name: '李师傅',
      role: 'user',
      department: '运输部',
      status: 'active',
      lastLoginAt: '2024-01-14 17:20:00',
      loginCount: 234,
      createdAt: '2023-03-15 00:00:00',
      updatedAt: '2024-01-14 17:20:00',
      roles: [
        {
          id: 'role-3',
          name: '驾驶员',
          description: '查看任务和车辆信息',
          permissions: [],
          isSystem: false,
          createdAt: '2023-03-15 00:00:00',
          updatedAt: '2023-03-15 00:00:00',
        },
      ],
      permissions: [],
    },
  ];

  // Removed mockRoles as it's not used

  // 移除mockSystemParams，直接使用从API获取的systemParams

  const mockBackupRecords: BackupRecord[] = [
    {
      id: '1',
      name: '每日自动备份_20240115',
      type: 'scheduled',
      status: 'completed',
      size: 1024 * 1024 * 256, // 256MB
      filePath: '/backups/daily_20240115.sql.gz',
      downloadUrl: '/api/backups/download/1',
      description: '每日自动备份',
      createdBy: 'system',
      creator: {
        id: 'system',
        username: 'system',
        email: 'system@company.com',
        name: '系统',
        role: 'admin',
        department: '系统',
        createdAt: '2023-01-01 00:00:00',
        updatedAt: '2023-01-01 00:00:00',
      },
      createdAt: '2024-01-15 02:00:00',
      completedAt: '2024-01-15 02:15:00',
    },
    {
      id: '2',
      name: '手动备份_升级前',
      type: 'manual',
      status: 'completed',
      size: 1024 * 1024 * 512, // 512MB
      filePath: '/backups/manual_20240110.sql.gz',
      downloadUrl: '/api/backups/download/2',
      description: '系统升级前的手动备份',
      createdBy: '1',
      creator: {
        id: '1',
        username: 'admin',
        email: 'admin@company.com',
        name: '系统管理员',
        role: 'admin',
        department: 'IT部门',
        createdAt: '2023-01-01 00:00:00',
        updatedAt: '2024-01-15 09:30:00',
      },
      createdAt: '2024-01-10 14:30:00',
      completedAt: '2024-01-10 14:45:00',
    },
    {
      id: '3',
      name: '备份进行中',
      type: 'manual',
      status: 'in_progress',
      description: '当前正在进行的备份',
      createdBy: '1',
      creator: {
        id: '1',
        username: 'admin',
        email: 'admin@company.com',
        name: '系统管理员',
        role: 'admin',
        department: 'IT部门',
        createdAt: '2023-01-01 00:00:00',
        updatedAt: '2024-01-15 09:30:00',
      },
      createdAt: '2024-01-15 10:00:00',
    },
  ];

  const mockSystemLogs: SystemLog[] = [
    {
      id: '1',
      level: 'info',
      module: 'auth',
      action: 'login',
      message: '用户登录成功',
      userId: '1',
      user: {
        id: '1',
        username: 'admin',
        email: 'admin@company.com',
        name: '系统管理员',
        role: 'admin',
        department: 'IT部门',
        createdAt: '2023-01-01 00:00:00',
        updatedAt: '2024-01-15 09:30:00',
      },
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      requestId: 'req_123456',
      duration: 150,
      timestamp: '2024-01-15 09:30:00',
    },
    {
      id: '2',
      level: 'warn',
      module: 'vehicle',
      action: 'update',
      message: '车辆信息更新失败：车牌号已存在',
      userId: '2',
      user: {
        id: '2',
        username: 'manager1',
        email: 'manager1@company.com',
        name: '张经理',
        role: 'manager',
        department: '运营部',
        createdAt: '2023-06-01 00:00:00',
        updatedAt: '2024-01-15 08:45:00',
      },
      ip: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      requestId: 'req_123457',
      duration: 89,
      metadata: {
        plateNumber: '京A12345',
        vehicleId: 'v123',
      },
      timestamp: '2024-01-15 08:45:30',
    },
    {
      id: '3',
      level: 'error',
      module: 'backup',
      action: 'create',
      message: '备份创建失败：磁盘空间不足',
      ip: '127.0.0.1',
      userAgent: 'System/1.0',
      requestId: 'req_123458',
      duration: 5000,
      metadata: {
        availableSpace: '1.2GB',
        requiredSpace: '2.5GB',
      },
      timestamp: '2024-01-15 02:00:00',
    },
  ];

  const mockSystemInfo: SystemInfo = {
    version: '1.0.0',
    environment: 'production',
    database: {
      type: 'PostgreSQL',
      version: '14.9',
      size: '2.3 GB',
    },
    server: {
      os: 'Ubuntu 20.04 LTS',
      memory: {
        total: '16 GB',
        used: '8.2 GB',
        free: '7.8 GB',
      },
      cpu: {
        cores: 8,
        usage: 35,
      },
      disk: {
        total: '500 GB',
        used: '180 GB',
        free: '320 GB',
      },
    },
    uptime: '15天 8小时 30分钟',
    lastBackup: '2024-01-15 02:15:00',
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string, type: 'user' | 'backup' | 'log') => {
    switch (type) {
      case 'user':
        return USER_STATUS_COLORS[status as keyof typeof USER_STATUS_COLORS] || 'gray';
      case 'backup':
        return BACKUP_STATUS_COLORS[status as keyof typeof BACKUP_STATUS_COLORS] || 'gray';
      case 'log':
        return LOG_LEVEL_COLORS[status as keyof typeof LOG_LEVEL_COLORS] || 'gray';
      default:
        return 'gray';
    }
  };

  // 用户数据加载函数
  const loadUsers = async () => {
    try {
      // setLoading(true);
      const filters: UserFilters = {
        search: searchTerm,
        role: selectedRole || undefined,
        status: selectedStatus || undefined
      };
      
      const response = await getUsers(currentPage, 10, filters);
      console.log('Users loaded:', response); // 临时日志
      // setUsers(response.data);
      // setTotalPages(response.totalPages);
      // setTotalUsers(response.total);
    } catch (error) {
      console.error('加载用户列表失败:', error);
    } finally {
      // setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await getUserStats();
      console.log('User stats loaded:', stats); // 临时日志
      // setUserStats(stats);
    } catch (error) {
      console.error('加载用户统计失败:', error);
    }
  };

  // 角色数据加载函数
  const loadRoles = async () => {
    try {
      setRoleLoading(true);
      const response = await getRoles(1, 100); // 获取所有角色
      setRoles(response.data);
    } catch (error) {
      console.error('加载角色列表失败:', error);
    } finally {
      setRoleLoading(false);
    }
  };

  const loadRoleStats = async () => {
    try {
      // const stats = await getRoleStats();
      // setRoleStats(stats);
    } catch (error) {
      console.error('加载角色统计失败:', error);
    }
  };

  const loadRolePermissions = async (roleId: string) => {
    try {
      const response = await getRolePermissions(roleId);
      if (response.success && response.data) {
        // 将权限数组转换为Record<string, boolean>格式
        const permissionsMap: Record<string, boolean> = {};
        if (Array.isArray(response.data)) {
          response.data.forEach((permission: string) => {
            permissionsMap[permission] = true;
          });
        }
        setRolePermissions(permissionsMap);
      }
    } catch (error) {
      console.error('加载角色权限失败:', error);
    }
  };

  // 用户表单处理函数
  // const handleUserFormChange = (field: keyof UserFormData, value: any) => {
  //   const newFormData = { ...userFormData, [field]: value };
  //   setUserFormData(newFormData);
  //   
  //   // 实时验证
  //   const errors = validateUserForm(newFormData);
  //   setUserFormErrors(errors);
  // };

  // const handleSaveUser = async () => {
  //   try {
  //     setIsSubmitting(true);
  //     
  //     // 验证表单
  //     const errors = validateUserForm(userFormData);
  //     if (hasFormErrors(errors)) {
  //       setUserFormErrors(errors);
  //       return;
  //     }

  //     // 构造用户数据，确保类型匹配
  //     const userData = {
  //       username: userFormData.username || '',
  //       email: userFormData.email || '',
  //       name: userFormData.name || '',
  //       role: (userFormData.role as 'user' | 'admin' | 'manager') || 'user',
  //       department: selectedDepartment || '默认部门'
  //     };

  //     if (editingUser) {
  //       // 更新用户
  //       await updateUser(editingUser.id, userData);
  //     } else {
  //       // 创建用户
  //       await createUser(userData);
  //     }

  //     setIsUserDialogOpen(false);
  //     await loadUsers();
  //     await loadUserStats();
  //   } catch (error) {
  //     console.error('保存用户失败:', error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleDeleteUser = async (userId: string) => {
  //   try {
  //     await deleteUser(userId);
  //     await loadUsers();
  //     await loadUserStats();
  //   } catch (error) {
  //     console.error('删除用户失败:', error);
  //   }
  // };

  // const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
  //   try {
  //     const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  //     await updateUserStatus(userId, newStatus);
  //     await loadUsers();
  //     await loadUserStats();
  //   } catch (error) {
  //     console.error('更新用户状态失败:', error);
  //   }
  // };

  const handleCreateUser = () => {
    setEditingUser(null);
    // setUserFormData({});
    // setUserFormErrors({});
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: UserManagement) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  // 角色表单处理函数
  const handleRoleFormChange = (field: keyof RoleData | 'permissions', value: any) => {
    setRoleFormData({ ...roleFormData, [field]: value });
  };

  const handleSaveRole = async () => {
    try {
      setIsSubmitting(true);
      
      // 将 permissions 从 Record<string, boolean> 转换为 string[]
      const permissionsArray = roleFormData.permissions 
        ? Object.keys(roleFormData.permissions).filter(key => roleFormData.permissions![key])
        : [];
      
      const roleDataForApi: RoleData = {
        name: roleFormData.name,
        description: roleFormData.description,
        permissions: permissionsArray,
        isSystem: roleFormData.isSystem
      };
      
      if (editingRole) {
        // 更新角色
        await updateRole(editingRole.id, roleDataForApi);
      } else {
        // 创建角色
        await createRole(roleDataForApi);
      }

      setIsRoleDialogOpen(false);
      await loadRoles();
      await loadRoleStats();
    } catch (error) {
      console.error('保存角色失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole(roleId);
      await loadRoles();
      await loadRoleStats();
    } catch (error) {
      console.error('删除角色失败:', error);
    }
  };

  const handleUpdateRolePermissions = async () => {
    try {
      if (selectedRoleForPermissions) {
        // 将Record<string, boolean>转换为string[]格式
        const permissionArray = Object.keys(rolePermissions).filter(key => rolePermissions[key]);
        await updateRolePermissions(selectedRoleForPermissions, permissionArray);
        await loadRoles();
      }
    } catch (error) {
      console.error('更新角色权限失败:', error);
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleFormData({ name: '', description: '' });
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormData({ name: role.name, description: role.description });
    setIsRoleDialogOpen(true);
  };

  const handleCreateParam = () => {
    setEditingParam(null);
    setIsParamDialogOpen(true);
  };

  const handleEditParam = (param: SystemParam) => {
    setEditingParam(param);
    setIsParamDialogOpen(true);
  };

  // 系统参数API调用函数
  const loadSystemParams = async () => {
    try {
      // setParamLoading(true);
      const queryParams: SystemParamQueryParams = {
        // search: paramSearchTerm,
        // category: selectedParamCategory
      };
      const response = await systemParamsService.getAllParams(queryParams);
      setSystemParams(response.data.settings);
    } catch (error) {
      console.error('加载系统参数失败:', error);
    } finally {
      // setParamLoading(false);
    }
  };

  // const loadParamCategories = async () => {
  //   try {
  //     const response = await systemParamsService.getCategories();
  //     setParamCategories(response.data);
  //   } catch (error) {
  //     console.error('加载参数分类失败:', error);
  //   }
  // };

  const handleSaveParam = async () => {
    try {
      setIsSubmitting(true);
      
      if (editingParam) {
        // 更新参数
        await systemParamsService.updateParam(editingParam.key, paramFormData);
      } else {
        // 创建参数
        await systemParamsService.createParam(paramFormData);
      }

      setIsParamDialogOpen(false);
      await loadSystemParams();
    } catch (error) {
      console.error('保存系统参数失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParam = async (paramKey: string) => {
    try {
      await systemParamsService.deleteParam(paramKey);
      await loadSystemParams();
    } catch (error) {
      console.error('删除系统参数失败:', error);
    }
  };

  const handleParamFormChange = (field: keyof SystemParamFormData, value: any) => {
    const newFormData = { ...paramFormData, [field]: value };
    setParamFormData(newFormData);
    
    // 简单验证
    // const errors: Record<string, string> = {};
    // if (!newFormData.key) errors.key = '参数键名不能为空';
    // if (!newFormData.value) errors.value = '参数值不能为空';
    // if (!newFormData.category) errors.category = '参数分类不能为空';
    // setParamFormErrors(errors);
  };

  const handleCreateBackup = () => {
    setIsBackupDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
          <p className="text-muted-foreground mt-2">
            管理系统配置、用户权限和数据备份
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value={SETTINGS_TABS.USER_MANAGEMENT} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {SETTINGS_TAB_LABELS[SETTINGS_TABS.USER_MANAGEMENT]}
          </TabsTrigger>
          <TabsTrigger value={SETTINGS_TABS.PERMISSION_CONFIG} className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {SETTINGS_TAB_LABELS[SETTINGS_TABS.PERMISSION_CONFIG]}
          </TabsTrigger>
          <TabsTrigger value={SETTINGS_TABS.SYSTEM_PARAMS} className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            {SETTINGS_TAB_LABELS[SETTINGS_TABS.SYSTEM_PARAMS]}
          </TabsTrigger>
          <TabsTrigger value={SETTINGS_TABS.BACKUP_RESTORE} className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            {SETTINGS_TAB_LABELS[SETTINGS_TABS.BACKUP_RESTORE]}
          </TabsTrigger>
          <TabsTrigger value={SETTINGS_TABS.SYSTEM_LOGS} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {SETTINGS_TAB_LABELS[SETTINGS_TABS.SYSTEM_LOGS]}
          </TabsTrigger>
        </TabsList>

        {/* 用户管理 */}
        <TabsContent value={SETTINGS_TABS.USER_MANAGEMENT} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  用户管理
                </CardTitle>
                <Button onClick={handleCreateUser} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  新增用户
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 筛选器 */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索用户名、姓名或邮箱..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部角色</SelectItem>
                    {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部状态</SelectItem>
                    {Object.entries(USER_STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部部门</SelectItem>
                    <SelectItem value="IT部门">IT部门</SelectItem>
                    <SelectItem value="运营部">运营部</SelectItem>
                    <SelectItem value="运输部">运输部</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 用户列表 */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户信息</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>最后登录</TableHead>
                      <TableHead>登录次数</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.username} • {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {USER_ROLE_LABELS[user.role as keyof typeof USER_ROLE_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(user.status, 'user') === 'success' ? 'default' : 'secondary'}
                            className={`
                              ${getStatusColor(user.status, 'user') === 'success' ? 'bg-green-100 text-green-800' : ''}
                              ${getStatusColor(user.status, 'user') === 'error' ? 'bg-red-100 text-red-800' : ''}
                              ${getStatusColor(user.status, 'user') === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${getStatusColor(user.status, 'user') === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
                            `}
                          >
                            {USER_STATUS_LABELS[user.status as keyof typeof USER_STATUS_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLoginAt ? (
                            <div className="text-sm">
                              {user.lastLoginAt}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">从未登录</span>
                          )}
                        </TableCell>
                        <TableCell>{user.loginCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={user.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                            >
                              {user.status === 'active' ? (
                                <Lock className="h-4 w-4" />
                              ) : (
                                <Unlock className="h-4 w-4" />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    确定要删除用户 "{user.name}" 吗？此操作不可撤销。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                    删除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 权限配置 */}
        <TabsContent value={SETTINGS_TABS.PERMISSION_CONFIG} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 角色管理 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    角色管理
                  </CardTitle>
                  <Button onClick={handleCreateRole} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roleLoading ? (
                    <div className="text-center py-4">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">加载角色列表...</p>
                    </div>
                  ) : roles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>暂无角色数据</p>
                    </div>
                  ) : (
                    roles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{role.name}</h4>
                            {role.isSystem && (
                              <Badge variant="secondary" className="text-xs">
                                系统角色
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            disabled={role.isSystem}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!role.isSystem && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    确定要删除角色 "{role.name}" 吗？此操作不可撤销。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteRole(role.id)}
                                  >
                                    删除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 权限矩阵 */}
            <Card>
              <CardHeader>
                <CardTitle>权限矩阵</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    选择角色查看其权限配置
                  </div>
                  <Select value={selectedRoleForPermissions} onValueChange={setSelectedRoleForPermissions}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* 权限表格 */}
                  {selectedRoleForPermissions ? (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>模块</TableHead>
                            <TableHead className="text-center">查看</TableHead>
                            <TableHead className="text-center">新增</TableHead>
                            <TableHead className="text-center">编辑</TableHead>
                            <TableHead className="text-center">删除</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(PERMISSION_MODULE_LABELS).map(([module, label]) => (
                            <TableRow key={module}>
                              <TableCell className="font-medium">{label}</TableCell>
                              {Object.entries(PERMISSION_ACTION_LABELS).map(([action, _actionLabel]) => (
                                <TableCell key={action} className="text-center">
                                  <Checkbox 
                                    checked={rolePermissions[`${module}_${action}`] || false}
                                    onCheckedChange={(checked) => {
                                      const permissionKey = `${module}_${action}`;
                                      const updatedPermissions = {
                                        ...rolePermissions,
                                        [permissionKey]: checked
                                      };
                                      setRolePermissions(updatedPermissions);
                                      handleUpdateRolePermissions();
                                    }}
                                    disabled={roles.find(r => r.id === selectedRoleForPermissions)?.isSystem}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {/* 权限操作按钮 */}
                      <div className="p-4 border-t bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {roles.find(r => r.id === selectedRoleForPermissions)?.isSystem ? 
                              '系统角色权限不可修改' : 
                              '修改权限后将自动保存'
                            }
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const allPermissions: Record<string, boolean> = {};
                                Object.keys(PERMISSION_MODULE_LABELS).forEach(module => {
                                  Object.keys(PERMISSION_ACTION_LABELS).forEach(action => {
                                    allPermissions[`${module}_${action}`] = true;
                                  });
                                });
                                setRolePermissions(allPermissions);
                                handleUpdateRolePermissions();
                              }}
                              disabled={roles.find(r => r.id === selectedRoleForPermissions)?.isSystem}
                            >
                              全选
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const noPermissions: Record<string, boolean> = {};
                                Object.keys(PERMISSION_MODULE_LABELS).forEach(module => {
                                  Object.keys(PERMISSION_ACTION_LABELS).forEach(action => {
                                    noPermissions[`${module}_${action}`] = false;
                                  });
                                });
                                setRolePermissions(noPermissions);
                                handleUpdateRolePermissions();
                              }}
                              disabled={roles.find(r => r.id === selectedRoleForPermissions)?.isSystem}
                            >
                              清空
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>请选择角色查看权限配置</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 系统参数 */}
        <TabsContent value={SETTINGS_TABS.SYSTEM_PARAMS} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  系统参数
                </CardTitle>
                <Button onClick={handleCreateParam}>
                  <Plus className="h-4 w-4 mr-2" />
                  新增参数
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 筛选器 */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索参数名称或键名..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部分类</SelectItem>
                    <SelectItem value="基础设置">基础设置</SelectItem>
                    <SelectItem value="界面设置">界面设置</SelectItem>
                    <SelectItem value="通知设置">通知设置</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部类型</SelectItem>
                    {Object.entries(SYSTEM_PARAM_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 参数列表 */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>参数名称</TableHead>
                      <TableHead>键名</TableHead>
                      <TableHead>当前值</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemParams.map((param) => (
                      <TableRow key={param.key}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{param.key}</div>
                            <div className="text-sm text-muted-foreground">
                              {param.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {param.key}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-32 truncate">
                            {param.type === 'BOOLEAN' ? (
                                  <Badge variant={param.value === 'true' ? 'default' : 'secondary'}>
                                {param.value === 'true' ? '启用' : '禁用'}
                              </Badge>
                            ) : (
                              param.value
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {SYSTEM_PARAM_TYPE_LABELS[param.type.toLowerCase() as keyof typeof SYSTEM_PARAM_TYPE_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell>{param.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={param.isPublic ? 'default' : 'secondary'} className="text-xs">
                              {param.isPublic ? '公开' : '私有'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditParam(param)}
                              disabled={false}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {true && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      确定要删除参数 "{param.key}" 吗？此操作不可撤销。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => handleDeleteParam(param.key)}
                                    >
                                      删除
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 备份恢复 */}
        <TabsContent value={SETTINGS_TABS.BACKUP_RESTORE} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 系统信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  系统信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">版本</span>
                    <span className="text-sm font-medium">{mockSystemInfo.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">环境</span>
                    <Badge variant="outline">{mockSystemInfo.environment}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">运行时间</span>
                    <span className="text-sm font-medium">{mockSystemInfo.uptime}</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span className="text-sm font-medium">数据库</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">类型</span>
                        <span>{mockSystemInfo.database.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">版本</span>
                        <span>{mockSystemInfo.database.version}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">大小</span>
                        <span>{mockSystemInfo.database.size}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      <span className="text-sm font-medium">服务器</span>
                    </div>
                    <div className="pl-6 space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">内存使用</span>
                          <span>{mockSystemInfo.server.memory.used} / {mockSystemInfo.server.memory.total}</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">CPU使用</span>
                          <span>{mockSystemInfo.server.cpu.usage}%</span>
                        </div>
                        <Progress value={mockSystemInfo.server.cpu.usage} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">磁盘使用</span>
                          <span>{mockSystemInfo.server.disk.used} / {mockSystemInfo.server.disk.total}</span>
                        </div>
                        <Progress value={36} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 备份管理 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    备份管理
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      恢复
                    </Button>
                    <Button onClick={handleCreateBackup} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      创建备份
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 筛选器 */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索备份名称..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全部</SelectItem>
                      <SelectItem value="manual">手动</SelectItem>
                      <SelectItem value="scheduled">定时</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全部</SelectItem>
                      {Object.entries(BACKUP_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 备份列表 */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>备份名称</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>大小</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead>创建者</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBackupRecords.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{backup.name}</div>
                              {backup.description && (
                                <div className="text-sm text-muted-foreground">
                                  {backup.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={backup.type === 'manual' ? 'default' : 'secondary'}>
                              {backup.type === 'manual' ? '手动' : '定时'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={getStatusColor(backup.status, 'backup') === 'success' ? 'default' : 'secondary'}
                                className={`
                                  ${getStatusColor(backup.status, 'backup') === 'success' ? 'bg-green-100 text-green-800' : ''}
                                  ${getStatusColor(backup.status, 'backup') === 'error' ? 'bg-red-100 text-red-800' : ''}
                                  ${getStatusColor(backup.status, 'backup') === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${getStatusColor(backup.status, 'backup') === 'primary' ? 'bg-blue-100 text-blue-800' : ''}
                                `}
                              >
                                {BACKUP_STATUS_LABELS[backup.status as keyof typeof BACKUP_STATUS_LABELS]}
                              </Badge>
                              {backup.status === 'in_progress' && (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {backup.size ? formatFileSize(backup.size) : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {backup.createdAt}
                              {backup.completedAt && backup.status === 'completed' && (
                                <div className="text-xs text-muted-foreground">
                                  完成于 {backup.completedAt}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{backup.creator.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {backup.status === 'completed' && backup.downloadUrl && (
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {backup.status === 'completed' && (
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                  <Upload className="h-4 w-4" />
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      确定要删除备份 "{backup.name}" 吗？此操作不可撤销。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                      删除
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 系统日志 */}
        <TabsContent value={SETTINGS_TABS.SYSTEM_LOGS} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  系统日志
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    导出日志
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    刷新
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 筛选器 */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索日志内容..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部级别</SelectItem>
                    {Object.entries(LOG_LEVEL_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="模块" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部模块</SelectItem>
                    <SelectItem value="auth">认证</SelectItem>
                    <SelectItem value="vehicle">车辆</SelectItem>
                    <SelectItem value="backup">备份</SelectItem>
                    <SelectItem value="system">系统</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="用户" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部用户</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 日志列表 */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>级别</TableHead>
                      <TableHead>模块</TableHead>
                      <TableHead>操作</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>消息</TableHead>
                      <TableHead>IP地址</TableHead>
                      <TableHead>耗时</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSystemLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(log.level, 'log') === 'error' ? 'destructive' : 'secondary'}
                            className={`
                              ${getStatusColor(log.level, 'log') === 'primary' ? 'bg-blue-100 text-blue-800' : ''}
                              ${getStatusColor(log.level, 'log') === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${getStatusColor(log.level, 'log') === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
                            `}
                          >
                            {LOG_LEVEL_LABELS[log.level as keyof typeof LOG_LEVEL_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {log.module}
                          </code>
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          {log.user ? (
                            <div className="text-sm">
                              <div className="font-medium">{log.user.name}</div>
                              <div className="text-muted-foreground">{log.user.username}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">系统</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-64 truncate" title={log.message}>
                            {log.message}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{log.ip}</TableCell>
                        <TableCell className="text-sm">
                          {log.duration ? `${log.duration}ms` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 用户对话框 */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? '编辑用户' : '新增用户'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  defaultValue={editingUser?.username}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  placeholder="请输入姓名"
                  defaultValue={editingUser?.name}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱"
                defaultValue={editingUser?.email}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select defaultValue={editingUser?.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">部门</Label>
                <Select defaultValue={editingUser?.department}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT部门">IT部门</SelectItem>
                    <SelectItem value="运营部">运营部</SelectItem>
                    <SelectItem value="运输部">运输部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveParam} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 角色对话框 */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? '编辑角色' : '新增角色'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">角色名称</Label>
                <Input
                  id="roleName"
                  name="name"
                  placeholder="请输入角色名称"
                  value={roleFormData.name}
                  onChange={(e) => handleRoleFormChange('name', e.target.value)}
                  disabled={editingRole?.isSystem}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">角色描述</Label>
                <Input
                  id="roleDescription"
                  name="description"
                  placeholder="请输入角色描述"
                  value={roleFormData.description}
                  onChange={(e) => handleRoleFormChange('description', e.target.value)}
                  disabled={editingRole?.isSystem}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>权限配置</Label>
              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  {Object.entries(PERMISSION_MODULE_LABELS).map(([module, label]) => {
                    const modulePermissions = Object.keys(PERMISSION_ACTION_LABELS).map(action => `${module}_${action}`);
                    const allModuleChecked = modulePermissions.every(perm => roleFormData.permissions?.[perm]);
                    // const _someModuleChecked = modulePermissions.some(perm => roleFormData.permissions?.[perm]);
                    
                    return (
                      <div key={module} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`module-${module}`}
                            checked={allModuleChecked}
                            // Note: indeterminate state would need custom implementation
                            onCheckedChange={(checked) => {
                              const updatedPermissions = { ...(roleFormData.permissions || {}) };
                              modulePermissions.forEach(perm => {
                                updatedPermissions[perm] = checked as boolean;
                              });
                              setRoleFormData(prev => ({
                                ...prev,
                                permissions: updatedPermissions
                              }));
                            }}
                            disabled={editingRole?.isSystem}
                          />
                          <Label htmlFor={`module-${module}`} className="font-medium">
                            {label}
                          </Label>
                        </div>
                        <div className="pl-6 grid grid-cols-4 gap-4">
                          {Object.entries(PERMISSION_ACTION_LABELS).map(([action, actionLabel]) => {
                            const permissionKey = `${module}_${action}`;
                            return (
                              <div key={action} className="flex items-center gap-2">
                                <Checkbox 
                                  id={`${module}-${action}`}
                                  checked={roleFormData.permissions?.[permissionKey] || false}
                                  onCheckedChange={(checked) => {
                                    setRoleFormData(prev => ({
                                      ...prev,
                                      permissions: {
                                        ...(prev.permissions || {}),
                                        [permissionKey]: checked as boolean
                                      }
                                    }));
                                  }}
                                  disabled={editingRole?.isSystem}
                                />
                                <Label htmlFor={`${module}-${action}`} className="text-sm">
                                  {actionLabel}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {editingRole?.isSystem && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <Lock className="h-4 w-4 inline mr-1" />
                  系统角色不可修改名称、描述和权限配置
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleSaveRole}
                disabled={!roleFormData.name.trim() || editingRole?.isSystem}
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 系统参数对话框 */}
      <Dialog open={isParamDialogOpen} onOpenChange={setIsParamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingParam ? '编辑参数' : '新增参数'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paramName">参数名称</Label>
                <Input
                  id="paramName"
                  name="name"
                  placeholder="请输入参数名称"
                  defaultValue={editingParam?.key}
                  onChange={(e) => handleParamFormChange('key', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paramKey">参数键名</Label>
                <Input
                  id="paramKey"
                  name="key"
                  placeholder="请输入参数键名"
                  defaultValue={editingParam?.key}
                  onChange={(e) => handleParamFormChange('key', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paramType">参数类型</Label>
                <Select defaultValue={editingParam?.type} onValueChange={(value) => handleParamFormChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SYSTEM_PARAM_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paramCategory">参数分类</Label>
                <Input
                  id="paramCategory"
                  name="category"
                  placeholder="请输入参数分类"
                  defaultValue={editingParam?.category}
                  onChange={(e) => handleParamFormChange('category', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paramValue">参数值</Label>
              <Input
                id="paramValue"
                name="value"
                placeholder="请输入参数值"
                defaultValue={editingParam?.value}
                onChange={(e) => handleParamFormChange('value', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paramDescription">参数描述</Label>
              <Textarea
                id="paramDescription"
                name="description"
                placeholder="请输入参数描述"
                defaultValue={editingParam?.description}
                onChange={(e) => handleParamFormChange('description', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={editingParam?.isPublic}
                />
                <Label htmlFor="isPublic">公开参数</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isReadonly"
                  checked={false}
                  disabled
                />
                <Label htmlFor="isReadonly">只读参数（暂不支持）</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsParamDialogOpen(false)}>
                取消
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 备份对话框 */}
      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建备份</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backupName">备份名称</Label>
              <Input
                id="backupName"
                placeholder="请输入备份名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupDescription">备份描述</Label>
              <Textarea
                id="backupDescription"
                placeholder="请输入备份描述（可选）"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeFiles" checked={true} />
              <Label htmlFor="includeFiles">包含文件数据</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                取消
              </Button>
              <Button>
                <Database className="h-4 w-4 mr-2" />
                开始备份
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
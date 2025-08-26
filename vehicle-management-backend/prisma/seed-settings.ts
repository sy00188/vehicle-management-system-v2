import { PrismaClient, SettingType } from '@prisma/client';
import * as process from 'process';

const prisma = new PrismaClient();

// 默认系统参数配置
const defaultSettings = [
  // 系统配置
  {
    key: 'system.maintenance_mode',
    value: 'false',
    type: SettingType.BOOLEAN,
    category: 'system',
    description: '系统维护模式开关',
    isPublic: false
  },
  {
    key: 'system.max_upload_size',
    value: '10485760',
    type: SettingType.NUMBER,
    category: 'system',
    description: '最大文件上传大小（字节）',
    isPublic: false
  },
  {
    key: 'system.session_timeout',
    value: '3600',
    type: SettingType.NUMBER,
    category: 'system',
    description: '会话超时时间（秒）',
    isPublic: false
  },
  {
    key: 'system.default_page_size',
    value: '20',
    type: SettingType.NUMBER,
    category: 'system',
    description: '默认分页大小',
    isPublic: true
  },
  {
    key: 'system.app_name',
    value: '车辆管理系统',
    type: SettingType.STRING,
    category: 'system',
    description: '应用程序名称',
    isPublic: true
  },
  {
    key: 'system.app_version',
    value: '1.0.0',
    type: SettingType.STRING,
    category: 'system',
    description: '应用程序版本',
    isPublic: true
  },

  // 通知配置
  {
    key: 'notification.email_enabled',
    value: 'true',
    type: SettingType.BOOLEAN,
    category: 'notification',
    description: '启用邮件通知',
    isPublic: false
  },
  {
    key: 'notification.sms_enabled',
    value: 'false',
    type: SettingType.BOOLEAN,
    category: 'notification',
    description: '启用短信通知',
    isPublic: false
  },
  {
    key: 'notification.push_enabled',
    value: 'true',
    type: SettingType.BOOLEAN,
    category: 'notification',
    description: '启用推送通知',
    isPublic: false
  },
  {
    key: 'notification.email_from',
    value: 'noreply@vehicle-management.com',
    type: SettingType.STRING,
    category: 'notification',
    description: '邮件发送地址',
    isPublic: false
  },

  // 审批配置
  {
    key: 'approval.auto_approve_limit',
    value: '1000',
    type: SettingType.NUMBER,
    category: 'approval',
    description: '自动审批金额上限（元）',
    isPublic: false
  },
  {
    key: 'approval.require_manager_approval',
    value: 'true',
    type: SettingType.BOOLEAN,
    category: 'approval',
    description: '需要经理审批',
    isPublic: false
  },
  {
    key: 'approval.max_advance_days',
    value: '30',
    type: SettingType.NUMBER,
    category: 'approval',
    description: '最大提前申请天数',
    isPublic: false
  },

  // 车辆配置
  {
    key: 'vehicle.default_fuel_type',
    value: 'GASOLINE',
    type: SettingType.STRING,
    category: 'vehicle',
    description: '默认燃料类型',
    isPublic: false
  },
  {
    key: 'vehicle.maintenance_interval_km',
    value: '10000',
    type: SettingType.NUMBER,
    category: 'vehicle',
    description: '保养间隔里程（公里）',
    isPublic: false
  },
  {
    key: 'vehicle.insurance_reminder_days',
    value: '30',
    type: SettingType.NUMBER,
    category: 'vehicle',
    description: '保险到期提醒天数',
    isPublic: false
  },

  // 安全配置
  {
    key: 'security.password_min_length',
    value: '8',
    type: SettingType.NUMBER,
    category: 'security',
    description: '密码最小长度',
    isPublic: true
  },
  {
    key: 'security.login_attempts_limit',
    value: '5',
    type: SettingType.NUMBER,
    category: 'security',
    description: '登录尝试次数限制',
    isPublic: false
  },
  {
    key: 'security.account_lockout_duration',
    value: '1800',
    type: SettingType.NUMBER,
    category: 'security',
    description: '账户锁定时长（秒）',
    isPublic: false
  },

  // 费用配置
  {
    key: 'expense.default_currency',
    value: 'CNY',
    type: SettingType.STRING,
    category: 'expense',
    description: '默认货币',
    isPublic: true
  },
  {
    key: 'expense.fuel_price_per_liter',
    value: '7.5',
    type: SettingType.NUMBER,
    category: 'expense',
    description: '燃油价格（元/升）',
    isPublic: false
  },

  // 报表配置
  {
    key: 'report.default_date_range',
    value: '30',
    type: SettingType.NUMBER,
    category: 'report',
    description: '默认报表日期范围（天）',
    isPublic: false
  },
  {
    key: 'report.export_formats',
    value: '["PDF", "Excel", "CSV"]',
    type: SettingType.JSON,
    category: 'report',
    description: '支持的导出格式',
    isPublic: false
  }
];

async function seedSettings() {
  console.log('开始初始化系统参数...');

  try {
    // 检查是否已有设置数据
    const existingCount = await prisma.setting.count();
    
    if (existingCount > 0) {
      console.log(`已存在 ${existingCount} 个系统参数，跳过初始化`);
      return;
    }

    // 批量创建设置
    const result = await prisma.setting.createMany({
      data: defaultSettings,
      skipDuplicates: true
    });

    console.log(`成功创建 ${result.count} 个系统参数`);

    // 显示创建的参数分类
    const categories = [...new Set(defaultSettings.map(s => s.category))];
    console.log('创建的参数分类:', categories.join(', '));

  } catch (error) {
    console.error('初始化系统参数失败:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedSettings();
    console.log('系统参数初始化完成');
  } catch (error) {
    console.error('系统参数初始化失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (typeof require !== 'undefined' && require.main === module) {
  main();
}

export { seedSettings, defaultSettings };
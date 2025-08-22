import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 获取所有设置
router.get('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const category = req.query.category as string;
  const search = req.query.search as string;

  // 构建查询条件
  const where: any = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { key: { contains: search } },
      { description: { contains: search } }
    ];
  }

  const settings = await prisma.setting.findMany({
    where,
    orderBy: [
      { category: 'asc' },
      { key: 'asc' }
    ]
  });

  // 按类别分组
  const groupedSettings = settings.reduce((acc: Record<string, any[]>, setting: any) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  res.json({
    success: true,
    data: {
      settings,
      groupedSettings
    }
  });
}));

// 获取单个设置
router.get('/:key', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const { key } = req.params;

  const setting = await prisma.setting.findUnique({
    where: { key }
  });

  if (!setting) {
    throw new NotFoundError('设置项不存在');
  }

  res.json({
    success: true,
    data: setting
  });
}));

// 创建设置
router.post('/', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const {
    key,
    value,
    type,
    category,
    description,
    isPublic = false
  } = req.body;

  // 验证必填字段
  if (!key || !value || !type || !category) {
    throw new ValidationError('键名、值、类型和类别为必填项');
  }

  // 检查键名是否已存在
  const existingSetting = await prisma.setting.findUnique({
    where: { key }
  });

  if (existingSetting) {
    throw new ValidationError('设置键名已存在');
  }

  // 验证值类型
  let validatedValue = value;
  try {
    switch (type.toUpperCase()) {
      case 'JSON':
        validatedValue = JSON.stringify(JSON.parse(value));
        break;
      case 'NUMBER':
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new ValidationError('数值类型的值必须是有效数字');
        }
        validatedValue = numValue.toString();
        break;
      case 'BOOLEAN':
        if (value !== 'true' && value !== 'false') {
          throw new ValidationError('布尔类型的值必须是true或false');
        }
        break;
      case 'STRING':
      default:
        // 字符串类型不需要特殊验证
        break;
    }
  } catch (error) {
    throw new ValidationError(`值格式不正确: ${error}`);
  }

  // 创建设置
  const setting = await prisma.setting.create({
    data: {
      key,
      value: validatedValue,
      type: type.toUpperCase(),
      category,
      description,
      isPublic
    }
  });

  res.status(201).json({
    success: true,
    message: '设置创建成功',
    data: setting
  });
}));

// 更新设置
router.put('/:key', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { key } = req.params;
  const {
    value,
    type,
    category,
    description,
    isPublic
  } = req.body;

  // 检查设置是否存在
  const existingSetting = await prisma.setting.findUnique({
    where: { key }
  });

  if (!existingSetting) {
    throw new NotFoundError('设置项不存在');
  }

  // 构建更新数据
  const updateData: any = {};

  if (value !== undefined) {
    const settingType = type || existingSetting.type;
    
    // 验证值类型
    try {
      switch (settingType.toUpperCase()) {
        case 'JSON':
          updateData.value = JSON.stringify(JSON.parse(value));
          break;
        case 'NUMBER':
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            throw new ValidationError('数值类型的值必须是有效数字');
          }
          updateData.value = numValue.toString();
          break;
        case 'BOOLEAN':
          if (value !== 'true' && value !== 'false') {
            throw new ValidationError('布尔类型的值必须是true或false');
          }
          updateData.value = value;
          break;
        case 'STRING':
        default:
          updateData.value = value;
          break;
      }
    } catch (error) {
      throw new ValidationError(`值格式不正确: ${error}`);
    }
  }

  if (type !== undefined) updateData.type = type.toUpperCase();
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description;
  if (isPublic !== undefined) updateData.isPublic = isPublic;

  // 更新设置
  const setting = await prisma.setting.update({
    where: { key },
    data: updateData
  });

  res.json({
    success: true,
    message: '设置更新成功',
    data: setting
  });
}));

// 删除设置
router.delete('/:key', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { key } = req.params;

  // 检查设置是否存在
  const existingSetting = await prisma.setting.findUnique({
    where: { key }
  });

  if (!existingSetting) {
    throw new NotFoundError('设置项不存在');
  }

  // 删除设置
  await prisma.setting.delete({
    where: { key }
  });

  res.json({
    success: true,
    message: '设置删除成功'
  });
}));

// 批量更新设置
router.put('/batch/update', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { settings } = req.body;

  if (!Array.isArray(settings) || settings.length === 0) {
    throw new ValidationError('设置列表不能为空');
  }

  // 验证所有设置
  const updatePromises = settings.map(async (settingData: any) => {
    const { key, value, type, category, description, isPublic } = settingData;

    if (!key) {
      throw new ValidationError('每个设置项都必须包含键名');
    }

    // 检查设置是否存在
    const existingSetting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!existingSetting) {
      throw new NotFoundError(`设置项 ${key} 不存在`);
    }

    // 构建更新数据
    const updateData: any = {};

    if (value !== undefined) {
      const settingType = type || existingSetting.type;
      
      // 验证值类型
      try {
        switch (settingType.toUpperCase()) {
          case 'JSON':
            updateData.value = JSON.stringify(JSON.parse(value));
            break;
          case 'NUMBER':
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
              throw new ValidationError(`设置项 ${key} 的数值类型值必须是有效数字`);
            }
            updateData.value = numValue.toString();
            break;
          case 'BOOLEAN':
            if (value !== 'true' && value !== 'false') {
              throw new ValidationError(`设置项 ${key} 的布尔类型值必须是true或false`);
            }
            updateData.value = value;
            break;
          case 'STRING':
          default:
            updateData.value = value;
            break;
        }
      } catch (error) {
        throw new ValidationError(`设置项 ${key} 的值格式不正确: ${error}`);
      }
    }

    if (type !== undefined) updateData.type = type.toUpperCase();
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    return prisma.setting.update({
      where: { key },
      data: updateData
    });
  });

  // 执行所有更新
  const updatedSettings = await Promise.all(updatePromises);

  res.json({
    success: true,
    message: `成功更新 ${updatedSettings.length} 个设置项`,
    data: updatedSettings
  });
}));

// 获取公开设置（无需认证）
router.get('/public/all', asyncHandler(async (req, res) => {
  const settings = await prisma.setting.findMany({
    where: {
      isPublic: true
    },
    select: {
      key: true,
      value: true,
      type: true,
      category: true,
      description: true
    },
    orderBy: [
      { category: 'asc' },
      { key: 'asc' }
    ]
  });

  // 按类别分组
  const groupedSettings = settings.reduce((acc: Record<string, any[]>, setting: any) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  res.json({
    success: true,
    data: {
      settings,
      groupedSettings
    }
  });
}));

// 获取设置类别列表
router.get('/categories/list', authMiddleware, requireRole(['ADMIN', 'MANAGER']), asyncHandler(async (req, res) => {
  const categories = await prisma.setting.findMany({
    select: {
      category: true
    },
    distinct: ['category'],
    orderBy: {
      category: 'asc'
    }
  });

  const categoryList = categories.map((item: any) => item.category);

  res.json({
    success: true,
    data: categoryList
  });
}));

// 重置设置为默认值
router.post('/reset/defaults', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const { keys } = req.body;

  if (!Array.isArray(keys) || keys.length === 0) {
    throw new ValidationError('要重置的设置键名列表不能为空');
  }

  // 定义默认设置值
  const defaultSettings: Record<string, any> = {
    'system.maintenance_mode': { value: 'false', type: 'BOOLEAN' },
    'system.max_upload_size': { value: '10485760', type: 'NUMBER' }, // 10MB
    'system.session_timeout': { value: '3600', type: 'NUMBER' }, // 1小时
    'notification.email_enabled': { value: 'true', type: 'BOOLEAN' },
    'notification.sms_enabled': { value: 'false', type: 'BOOLEAN' },
    'approval.auto_approve_limit': { value: '1000', type: 'NUMBER' },
    'approval.require_manager_approval': { value: 'true', type: 'BOOLEAN' }
  };

  const resetPromises = keys.map(async (key: string) => {
    const defaultSetting = defaultSettings[key];
    if (!defaultSetting) {
      throw new ValidationError(`未找到设置项 ${key} 的默认值`);
    }

    // 检查设置是否存在
    const existingSetting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!existingSetting) {
      throw new NotFoundError(`设置项 ${key} 不存在`);
    }

    return prisma.setting.update({
      where: { key },
      data: {
        value: defaultSetting.value,
        type: defaultSetting.type
      }
    });
  });

  const resetSettings = await Promise.all(resetPromises);

  res.json({
    success: true,
    message: `成功重置 ${resetSettings.length} 个设置项为默认值`,
    data: resetSettings
  });
}));

// 导出设置配置
router.get('/export/config', authMiddleware, requireRole(['ADMIN']), asyncHandler(async (req, res) => {
  const includePrivate = req.query.includePrivate === 'true';

  const where: any = {};
  if (!includePrivate) {
    where.isPublic = true;
  }

  const settings = await prisma.setting.findMany({
    where,
    select: {
      key: true,
      value: true,
      type: true,
      category: true,
      description: true,
      isPublic: true
    },
    orderBy: [
      { category: 'asc' },
      { key: 'asc' }
    ]
  });

  const exportData = {
    exportTime: new Date().toISOString(),
    includePrivate,
    settings
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="settings-export-${new Date().toISOString().split('T')[0]}.json"`);
  
  res.json({
    success: true,
    data: exportData
  });
}));

export default router;
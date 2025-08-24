import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子数据初始化...');

  // 创建管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vehicle.com' },
    update: {},
    create: {
      email: 'admin@vehicle.com',
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
      phone: '13800138000',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('管理员用户创建成功:', adminUser.email);

  // 创建普通用户
  const userPassword = await bcrypt.hash('user123', 10);
  
  const normalUser = await prisma.user.upsert({
    where: { email: 'user@vehicle.com' },
    update: {},
    create: {
      email: 'user@vehicle.com',
      username: 'user',
      password: userPassword,
      name: '普通用户',
      phone: '13800138001',
        role: 'USER',
        status: 'ACTIVE',
    },
  });

  console.log('普通用户创建成功:', normalUser.email);

  // 创建司机用户
  const driverPassword = await bcrypt.hash('driver123', 10);
  
  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@vehicle.com' },
    update: {},
    create: {
      email: 'driver@vehicle.com',
      username: 'driver',
      password: driverPassword,
      name: '司机用户',
      phone: '13800138002',
      role: 'DRIVER',
      status: 'ACTIVE',
    },
  });

  console.log('司机用户创建成功:', driverUser.email);

  // 创建系统设置
  const settings = [
    {
      key: 'system.name',
      value: '车辆管理系统',
      type: 'STRING' as const,
      category: 'system',
      description: '系统名称',
      isPublic: true,
    },
    {
      key: 'system.version',
      value: '1.0.0',
      type: 'STRING' as const,
      category: 'system',
      description: '系统版本',
      isPublic: true,
    },
    {
      key: 'upload.maxFileSize',
      value: '10485760',
      type: 'NUMBER' as const,
      category: 'upload',
      description: '最大文件上传大小（字节）',
      isPublic: false,
    },
    {
      key: 'upload.allowedTypes',
      value: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
      type: 'STRING' as const,
      category: 'upload',
      description: '允许上传的文件类型',
      isPublic: false,
    },
    {
      key: 'notification.email.enabled',
      value: 'true',
      type: 'BOOLEAN' as const,
      category: 'notification',
      description: '是否启用邮件通知',
      isPublic: false,
    },
    {
      key: 'application.autoApproval',
      value: 'false',
      type: 'BOOLEAN' as const,
      category: 'application',
      description: '是否启用自动审批',
      isPublic: false,
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        type: setting.type,
        category: setting.category,
        description: setting.description,
        isPublic: setting.isPublic,
      },
    });
  }

  console.log('系统设置创建成功');

  // 创建示例车辆
  const vehicle1 = await prisma.vehicle.upsert({
    where: { plateNumber: '京A12345' },
    update: {},
    create: {
      plateNumber: '京A12345',
      brand: '丰田',
      model: '凯美瑞',
      year: 2022,
      color: '白色',
      vin: 'JTDKN3DU5E0123456',
      engineNumber: 'E123456789',
      fuelType: 'GASOLINE',
      seats: 5,
      mileage: 15000.5,
      status: 'AVAILABLE',
      purchaseDate: new Date('2022-01-15'),
      purchasePrice: 250000.00,
      insuranceExpiry: new Date('2025-01-15'),
      inspectionExpiry: new Date('2024-12-31'),
      description: '公司公务用车，状态良好',
      createdById: adminUser.id,
    },
  });

  console.log('示例车辆1创建成功:', vehicle1.plateNumber);

  // 创建第二辆示例车辆
  const vehicle2 = await prisma.vehicle.upsert({
    where: { plateNumber: '京B67890' },
    update: {},
    create: {
      plateNumber: '京B67890',
      brand: '本田',
      model: 'CR-V',
      year: 2023,
      color: '黑色',
      vin: 'JHLRD78856C123456',
      engineNumber: 'H234567890',
      fuelType: 'GASOLINE',
      seats: 5,
      mileage: 8000.0,
      status: 'AVAILABLE',
      purchaseDate: new Date('2023-03-20'),
      purchasePrice: 280000.00,
      insuranceExpiry: new Date('2026-03-20'),
      inspectionExpiry: new Date('2025-03-20'),
      description: 'SUV公务用车，适合长途出行',
      createdById: adminUser.id,
    },
  });

  console.log('示例车辆2创建成功:', vehicle2.plateNumber);

  // 创建示例司机
  const driver = await prisma.driver.create({
    data: {
      name: '张师傅',
      phone: '13900139000',
      email: 'zhang@driver.com',
      licenseNumber: 'C1234567890123456',
      licenseType: 'C1',
      licenseExpiry: new Date('2026-06-30'),
      idCard: '110101199001011234',
      address: '北京市朝阳区某某街道',
      emergencyContact: '李女士',
      emergencyPhone: '13900139001',
      hireDate: new Date('2023-01-01'),
      status: 'AVAILABLE',
      salary: 8000.00,
      description: '经验丰富的专业司机',
      createdById: adminUser.id,
    },
  });

  console.log('示例司机创建成功:', driver.name);

  console.log('数据库种子数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
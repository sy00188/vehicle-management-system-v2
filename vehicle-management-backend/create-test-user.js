const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // 检查是否已存在测试用户
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('测试用户已存在:', existingUser.email);
      return existingUser;
    }

    // 创建新的测试用户
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        name: '测试用户',
        phone: '13800138000',
        role: 'USER',
        status: 'ACTIVE'
      }
    });

    console.log('测试用户创建成功:', testUser.email);
    return testUser;
  } catch (error) {
    console.error('创建测试用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
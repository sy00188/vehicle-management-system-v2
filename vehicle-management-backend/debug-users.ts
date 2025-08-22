import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function debugUsers() {
  try {
    console.log('=== 查询所有用户 ===');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('用户数量:', users.length);
    users.forEach((user, index) => {
      console.log(`\n用户 ${index + 1}:`);
      console.log('ID:', user.id);
      console.log('邮箱:', user.email);
      console.log('密码哈希:', user.password);
      console.log('角色:', user.role);
      console.log('创建时间:', user.createdAt);
    });
    
    // 测试密码验证
    console.log('\n=== 测试密码验证 ===');
    const adminUser = users.find(u => u.email === 'admin@vehicle.com');
    if (adminUser) {
      console.log('找到admin用户');
      const isValid = await bcrypt.compare('admin123', adminUser.password);
      console.log('密码 "admin123" 验证结果:', isValid);
      
      // 测试生成新的哈希
      const newHash = await bcrypt.hash('admin123', 12);
      console.log('新生成的哈希:', newHash);
      const newHashValid = await bcrypt.compare('admin123', newHash);
      console.log('新哈希验证结果:', newHashValid);
    } else {
      console.log('未找到admin用户');
    }
    
  } catch (error) {
    console.error('错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUsers();
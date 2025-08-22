import 'dotenv/config';
import app from './app';
import { config } from './config/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 优雅关闭处理
process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM 信号，开始优雅关闭...');
  await gracefulShutdown();
});

process.on('SIGINT', async () => {
  console.log('收到 SIGINT 信号，开始优雅关闭...');
  await gracefulShutdown();
});

async function gracefulShutdown() {
  try {
    console.log('正在关闭数据库连接...');
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
    
    console.log('服务器已优雅关闭');
    process.exit(0);
  } catch (error) {
    console.error('优雅关闭过程中发生错误:', error);
    process.exit(1);
  }
}

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    // 启动HTTP服务器
    const server = app.listen(config.port, () => {
      console.log(`🚀 服务器运行在端口 ${config.port}`);
      console.log(`📝 环境: ${config.nodeEnv}`);
      console.log(`🌐 API地址: http://localhost:${config.port}/api/v1`);
      console.log(`❤️  健康检查: http://localhost:${config.port}/health`);
      
      if (config.nodeEnv === 'development') {
        console.log('\n🔧 开发模式提示:');
        console.log('- 确保已配置 .env 文件');
        console.log('- 确保数据库已启动并可访问');
        console.log('- API文档将在后续版本中提供');
      }
    });
    
    // 处理服务器错误
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${config.port} 已被占用`);
        console.error('请检查是否有其他服务正在使用该端口，或修改 .env 文件中的 PORT 配置');
      } else {
        console.error('❌ 服务器启动失败:', error.message);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        console.error('\n💡 数据库连接失败，请检查:');
        console.error('1. 数据库服务是否已启动');
        console.error('2. .env 文件中的 DATABASE_URL 是否正确');
        console.error('3. 数据库用户权限是否足够');
        console.error('4. 网络连接是否正常');
      }
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未处理的 Promise 拒绝:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

// 启动应用
startServer();
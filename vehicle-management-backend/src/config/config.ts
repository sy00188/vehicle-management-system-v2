import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT配置
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // CORS配置
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'],
  
  // 文件上传配置
  uploadMaxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10), // 10MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // Redis配置（可选）
  redisUrl: process.env.REDIS_URL || '',
  
  // 邮件配置（可选）
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@vehicle-management.com',
  
  // 速率限制配置
  rateLimitWindowMs: 15 * 60 * 1000, // 15分钟
  rateLimitMax: 100, // 每个窗口期最大请求数
  
  // 分页配置
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // 安全配置
  bcryptRounds: 12,
  
  // 日志配置
  logLevel: process.env.LOG_LEVEL || 'info',
};

// 验证必需的环境变量
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ 缺少必需的环境变量: ${envVar}`);
    process.exit(1);
  }
}

console.log('✅ 配置加载完成');
console.log(`📊 环境: ${config.nodeEnv}`);
console.log(`🔌 端口: ${config.port}`);
console.log(`🌐 CORS源: ${config.corsOrigin}`);
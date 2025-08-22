import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';

// 路由导入
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vehicleRoutes from './routes/vehicles';
import driverRoutes from './routes/drivers';
import applicationRoutes from './routes/applications';
import maintenanceRoutes from './routes/maintenances';
import expenseRoutes from './routes/expenses';
import settingRoutes from './routes/settings';
import uploadRoutes from './routes/upload';
import notificationRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';

const app = express();

// 基础中间件
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 速率限制
app.use(rateLimitMiddleware);

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

// API路由
// API路由配置
const apiRouter = express.Router();

// 挂载各个模块路由
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', authMiddleware, userRoutes);
apiRouter.use('/vehicles', authMiddleware, vehicleRoutes);
apiRouter.use('/drivers', authMiddleware, driverRoutes);
apiRouter.use('/applications', authMiddleware, applicationRoutes);
apiRouter.use('/maintenances', authMiddleware, maintenanceRoutes);
apiRouter.use('/expenses', authMiddleware, expenseRoutes);
apiRouter.use('/settings', authMiddleware, settingRoutes);
apiRouter.use('/upload', authMiddleware, uploadRoutes);
apiRouter.use('/notifications', authMiddleware, notificationRoutes);
apiRouter.use('/dashboard', authMiddleware, dashboardRoutes);

// 挂载API路由到/api/v1
app.use('/api/v1', apiRouter);

// 错误处理中间件
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
const PORT = config.port || 3001;

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`🌍 环境: ${config.nodeEnv}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

export default app;
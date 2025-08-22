import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { rateLimitMiddleware } from './middleware/rateLimit';

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vehicleRoutes from './routes/vehicles';
import driverRoutes from './routes/drivers';
import applicationRoutes from './routes/applications';
import maintenanceRoutes from './routes/maintenances';
import expenseRoutes from './routes/expenses';
import settingsRoutes from './routes/settings';
import uploadRoutes from './routes/upload';
import notificationRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';

const app = express();

// 安全中间件
app.use(helmet());

// CORS 配置
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 请求日志
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// 基础中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 基础限流
app.use(rateLimitMiddleware);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API 路由
const apiRouter = express.Router();

// API 路由
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/vehicles', vehicleRoutes);
apiRouter.use('/drivers', driverRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/maintenances', maintenanceRoutes);
apiRouter.use('/expenses', expenseRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

// API 版本前缀
app.use('/api/v1', apiRouter);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '车辆管理系统 API',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    health: '/health'
  });
});

// 404 处理
app.use(notFoundHandler);

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

export default app;
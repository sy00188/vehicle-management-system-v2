# 车辆管理系统后端

一个基于 Node.js + Express + TypeScript + Prisma + MySQL 的现代化车辆管理系统后端服务。

## 功能特性

- 🚗 **车辆管理**: 车辆信息的增删改查、状态管理、统计分析
- 👨‍💼 **驾驶员管理**: 驾驶员档案管理、车辆分配
- 📝 **申请管理**: 车辆使用申请、审批流程
- 💰 **费用管理**: 车辆相关费用记录和统计
- 🔐 **用户认证**: JWT身份验证、角色权限控制
- 📊 **数据统计**: 车辆使用情况、费用统计等

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MySQL 8.0+
- **ORM**: Prisma
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **参数验证**: express-validator
- **跨域**: CORS
- **环境变量**: dotenv

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- MySQL 8.0 或更高版本
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd vehicle-management-backend
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：
```env
DATABASE_URL="mysql://username:password@localhost:3306/vehicle_management"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
```

4. **创建数据库**
```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE vehicle_management;
CREATE USER 'vehicle_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON vehicle_management.* TO 'vehicle_user'@'localhost';
FLUSH PRIVILEGES;
```

5. **运行数据库迁移**
```bash
npx prisma migrate dev
```

6. **启动开发服务器**
```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动。

## 项目结构

```
vehicle-management-backend/
├── prisma/                 # 数据库模式和迁移
│   ├── schema.prisma      # 数据库模式定义
│   └── migrations/        # 数据库迁移文件
├── src/                   # 源代码
│   ├── controllers/       # 控制器
│   ├── middleware/        # 中间件
│   ├── routes/           # 路由定义
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── app.ts            # Express 应用配置
│   └── server.ts         # 服务器入口
├── tests/                # 测试文件
├── docs/                 # 文档
├── .env.example          # 环境变量示例
├── package.json          # 项目配置
└── README.md            # 项目说明
```

## API 文档

### 📚 完整文档
- [API 详细文档](./API_Documentation.md) - 包含所有端点的详细说明
- [API 使用指南](./API_Usage_Guide.md) - 快速上手指南和常用示例

### 🚀 快速测试

项目提供了完整的测试脚本：

```bash
# 基础API测试
./test_api.sh

# 管理员功能测试
./test_admin_api.sh

# 综合功能测试
./test_comprehensive_api.sh
```

### 🔗 主要端点

| 功能模块 | 端点 | 说明 |
|---------|------|------|
| 认证 | `POST /api/auth/login` | 用户登录 |
| 认证 | `POST /api/auth/register` | 用户注册 |
| 车辆 | `GET /api/vehicles` | 获取车辆列表 |
| 车辆 | `POST /api/vehicles` | 创建车辆 |
| 驾驶员 | `GET /api/drivers` | 获取驾驶员列表 |
| 驾驶员 | `POST /api/drivers` | 创建驾驶员 |
| 申请 | `GET /api/applications` | 获取申请列表 |
| 申请 | `POST /api/applications` | 创建申请 |
| 费用 | `GET /api/expenses` | 获取费用列表 |
| 费用 | `POST /api/expenses` | 创建费用记录 |

## 开发指南

### 可用脚本

```bash
# 开发模式（热重载）
npm run dev

# 构建项目
npm run build

# 生产模式运行
npm start

# 代码检查
npm run lint

# 格式化代码
npm run format

# 运行测试
npm test

# 数据库相关
npx prisma migrate dev     # 运行迁移
npx prisma generate        # 生成客户端
npx prisma studio          # 打开数据库管理界面
npx prisma db push         # 推送模式到数据库
```

### 数据库管理

```bash
# 查看数据库状态
npx prisma migrate status

# 重置数据库
npx prisma migrate reset

# 生成新迁移
npx prisma migrate dev --name migration_name

# 部署迁移到生产环境
npx prisma migrate deploy
```

### 环境配置

#### 开发环境
```env
NODE_ENV=development
DATABASE_URL="mysql://user:password@localhost:3306/vehicle_management_dev"
JWT_SECRET="dev-secret-key"
PORT=3001
```

#### 生产环境
```env
NODE_ENV=production
DATABASE_URL="mysql://user:password@prod-host:3306/vehicle_management"
JWT_SECRET="super-secure-production-key"
PORT=3001
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t vehicle-management-backend .

# 运行容器
docker run -p 3001:3001 --env-file .env vehicle-management-backend
```

### PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 启动应用
pm2 start dist/server.js --name "vehicle-management"

# 查看状态
pm2 status

# 查看日志
pm2 logs vehicle-management
```

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --grep "车辆管理"

# 生成测试覆盖率报告
npm run test:coverage
```

### API 测试

使用提供的测试脚本进行API测试：

```bash
# 确保服务器正在运行
npm run dev

# 在另一个终端运行测试
chmod +x test_comprehensive_api.sh
./test_comprehensive_api.sh
```

## 安全考虑

- ✅ JWT 令牌认证
- ✅ 密码 bcrypt 加密
- ✅ 输入参数验证
- ✅ SQL 注入防护（Prisma ORM）
- ✅ CORS 跨域配置
- ✅ 环境变量保护敏感信息
- ✅ 角色权限控制

## 性能优化

- 数据库索引优化
- 分页查询
- 缓存策略
- 连接池配置
- 压缩中间件

## 监控和日志

- 请求日志记录
- 错误日志收集
- 性能监控
- 健康检查端点

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- 项目链接: [https://github.com/yourusername/vehicle-management-backend]

## 更新日志

### v1.0.0 (2025-08-21)
- ✨ 初始版本发布
- ✨ 完整的车辆管理功能
- ✨ 驾驶员管理系统
- ✨ 申请审批流程
- ✨ 费用管理模块
- ✨ JWT 认证系统
- ✨ 角色权限控制
- ✨ 完整的 API 文档
- ✨ 测试脚本和示例

## 常见问题

### Q: 如何重置数据库？
A: 运行 `npx prisma migrate reset` 命令。

### Q: 如何添加新的数据库字段？
A: 修改 `prisma/schema.prisma` 文件，然后运行 `npx prisma migrate dev`。

### Q: 如何修改端口？
A: 在 `.env` 文件中修改 `PORT` 变量。

### Q: 如何查看数据库数据？
A: 运行 `npx prisma studio` 打开数据库管理界面。

### Q: 生产环境如何配置？
A: 参考部署章节，确保设置正确的环境变量和数据库连接。
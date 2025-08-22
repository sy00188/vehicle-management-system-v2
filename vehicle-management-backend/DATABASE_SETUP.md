# 数据库设置指南

## MySQL 数据库配置

### 1. 确保 MySQL 服务正在运行

检查 MySQL 服务状态：
```bash
# 检查 MySQL 进程
ps aux | grep mysql

# 或者使用系统服务管理
sudo launchctl list | grep mysql
```

### 2. 设置 MySQL root 密码（如果需要）

如果您的 MySQL root 用户没有密码，可以设置一个：
```bash
# 连接到 MySQL（无密码）
mysql -u root

# 在 MySQL 命令行中设置密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

### 3. 创建数据库

```bash
# 使用密码连接（如果设置了密码）
mysql -u root -p

# 或者无密码连接（如果没有设置密码）
mysql -u root

# 创建数据库
CREATE DATABASE IF NOT EXISTS vehicle_management;

# 查看数据库
SHOW DATABASES;

# 退出
EXIT;
```

### 4. 更新 .env 文件

根据您的 MySQL 配置，更新 `.env` 文件中的 `DATABASE_URL`：

```env
# 如果有密码
DATABASE_URL="mysql://root:your_password@localhost:3306/vehicle_management"

# 如果没有密码
DATABASE_URL="mysql://root:@localhost:3306/vehicle_management"

# 如果使用其他用户
DATABASE_URL="mysql://username:password@localhost:3306/vehicle_management"
```

### 5. 运行数据库迁移

配置完成后，运行以下命令创建数据库表：

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 查看数据库状态
npx prisma db push
```

### 6. 验证数据库连接

```bash
# 查看数据库表
npx prisma studio
```

## 常见问题

### 问题 1: Access denied for user 'root'@'localhost'

**解决方案：**
1. 检查密码是否正确
2. 尝试重置 MySQL root 密码
3. 检查 MySQL 用户权限

### 问题 2: Can't connect to MySQL server

**解决方案：**
1. 确保 MySQL 服务正在运行
2. 检查端口 3306 是否被占用
3. 检查防火墙设置

### 问题 3: Database doesn't exist

**解决方案：**
1. 手动创建数据库：`CREATE DATABASE vehicle_management;`
2. 检查数据库名称拼写

## 替代方案

如果您不想使用本地 MySQL，可以考虑：

1. **使用 Docker MySQL：**
```bash
docker run --name mysql-vehicle -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=vehicle_management -p 3306:3306 -d mysql:8.0
```

2. **使用云数据库服务：**
   - AWS RDS
   - Google Cloud SQL
   - PlanetScale
   - Railway

3. **使用 SQLite（开发环境）：**
```env
DATABASE_URL="file:./dev.db"
```

然后更新 `prisma/schema.prisma` 中的 provider：
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```
# 车辆管理系统 API 文档

## 概述

车辆管理系统提供了完整的RESTful API，支持用户认证、车辆管理、驾驶员管理、申请管理和费用管理等功能。

### 基础信息

- **基础URL**: `http://localhost:3001`
- **API版本**: v1
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

### 响应格式

所有API响应都遵循统一的格式：

```json
{
  "success": true|false,
  "message": "响应消息",
  "data": {}, // 成功时的数据
  "error": {}, // 失败时的错误信息
  "timestamp": "2025-08-21T04:17:49.215Z",
  "path": "/api/endpoint",
  "method": "GET|POST|PUT|DELETE"
}
```

## 认证 API

### 用户注册

**POST** `/api/auth/register`

注册新用户账户。

**请求体**:
```json
{
  "name": "用户姓名",
  "email": "user@example.com",
  "password": "password123",
  "role": "USER" // 可选: USER, ADMIN, MANAGER
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "用户注册成功",
  "data": {
    "user": {
      "id": "user_id",
      "name": "用户姓名",
      "email": "user@example.com",
      "role": "USER"
    },
    "accessToken": "jwt_token_here"
  }
}
```

### 用户登录

**POST** `/api/auth/login`

用户登录获取访问令牌。

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "user_id",
      "name": "用户姓名",
      "email": "user@example.com",
      "role": "USER"
    },
    "accessToken": "jwt_token_here"
  }
}
```

## 车辆管理 API

### 获取车辆列表

**GET** `/api/vehicles`

获取车辆列表，支持分页和搜索。

**权限**: 需要认证

**查询参数**:
- `page`: 页码 (默认: 1)
- `pageSize`: 每页数量 (默认: 20, 最大: 100)
- `search`: 搜索关键词
- `status`: 车辆状态 (AVAILABLE, IN_USE, MAINTENANCE, RETIRED)
- `type`: 车辆类型

**响应示例**:
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "vehicle_id",
        "plateNumber": "京A12345",
        "brand": "丰田",
        "model": "凯美瑞",
        "year": 2023,
        "type": "轿车",
        "fuelType": "GASOLINE",
        "seats": 5,
        "status": "AVAILABLE"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 创建车辆

**POST** `/api/vehicles`

创建新车辆记录。

**权限**: ADMIN, MANAGER

**请求体**:
```json
{
  "plateNumber": "京A12345",
  "brand": "丰田",
  "model": "凯美瑞",
  "year": 2023,
  "type": "轿车",
  "fuelType": "GASOLINE",
  "seats": 5,
  "color": "白色",
  "description": "车辆描述"
}
```

### 获取车辆详情

**GET** `/api/vehicles/{id}`

获取指定车辆的详细信息。

**权限**: 需要认证

### 更新车辆信息

**PUT** `/api/vehicles/{id}`

更新车辆信息。

**权限**: ADMIN, MANAGER

### 删除车辆

**DELETE** `/api/vehicles/{id}`

删除车辆记录。

**权限**: ADMIN

### 车辆统计

**GET** `/api/vehicles/stats/overview`

获取车辆统计信息。

**权限**: ADMIN, MANAGER

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalVehicles": 1,
    "statusStats": {
      "AVAILABLE": 1
    },
    "typeStats": {
      "GASOLINE": 1
    }
  }
}
```

## 驾驶员管理 API

### 获取驾驶员列表

**GET** `/api/drivers`

获取驾驶员列表，支持分页和搜索。

**权限**: 需要认证

### 创建驾驶员

**POST** `/api/drivers`

创建新驾驶员记录。

**权限**: ADMIN, MANAGER

**请求体**:
```json
{
  "name": "张三",
  "phone": "13800138000",
  "licenseNumber": "110101199001011234",
  "licenseType": "C1",
  "licenseExpiry": "2025-12-31",
  "idCard": "110101199001011234",
  "address": "北京市朝阳区",
  "emergencyContact": "李四",
  "emergencyPhone": "13800138001"
}
```

**必填字段**: name, licenseNumber, licenseType, licenseExpiry, phone, idCard

### 获取驾驶员详情

**GET** `/api/drivers/{id}`

### 更新驾驶员信息

**PUT** `/api/drivers/{id}`

### 删除驾驶员

**DELETE** `/api/drivers/{id}`

### 分配车辆给驾驶员

**POST** `/api/drivers/{id}/assign-vehicle`

**权限**: ADMIN, MANAGER

**请求体**:
```json
{
  "vehicleId": "vehicle_id"
}
```

### 取消驾驶员车辆分配

**POST** `/api/drivers/{id}/unassign-vehicle`

**权限**: ADMIN, MANAGER

## 申请管理 API

### 获取申请列表

**GET** `/api/applications`

获取申请列表。普通用户只能查看自己的申请。

**权限**: 需要认证

### 创建申请

**POST** `/api/applications`

创建新的车辆使用申请。

**权限**: 需要认证

**请求体**:
```json
{
  "title": "出差申请",
  "purpose": "出差",
  "destination": "北京市朝阳区",
  "startTime": "2025-08-22T09:00:00.000Z",
  "endTime": "2025-08-22T18:00:00.000Z",
  "passengers": 3,
  "notes": "前往客户公司洽谈业务",
  "vehicleId": "vehicle_id", // 可选
  "driverId": "driver_id" // 可选
}
```

**必填字段**: title, purpose, destination, startTime, endTime

### 获取申请详情

**GET** `/api/applications/{id}`

### 更新申请

**PUT** `/api/applications/{id}`

### 删除申请

**DELETE** `/api/applications/{id}`

### 审批申请

**POST** `/api/applications/{id}/approve`

审批申请（通过或拒绝）。

**权限**: ADMIN, MANAGER

**请求体**:
```json
{
  "action": "APPROVE", // APPROVE 或 REJECT
  "vehicleId": "vehicle_id", // 审批通过时必填
  "driverId": "driver_id", // 可选
  "notes": "审批备注"
}
```

### 获取我的申请

**GET** `/api/applications/my/list`

获取当前用户的申请列表。

## 费用管理 API

### 获取费用列表

**GET** `/api/expenses`

获取费用记录列表。

**权限**: ADMIN, MANAGER

### 创建费用记录

**POST** `/api/expenses`

创建新的费用记录。

**权限**: ADMIN, MANAGER

**请求体**:
```json
{
  "vehicleId": "vehicle_id",
  "type": "FUEL", // FUEL, MAINTENANCE, INSURANCE, REPAIR, OTHER
  "amount": 300.50,
  "description": "加油费用",
  "date": "2025-08-21",
  "vendor": "中石油", // 可选
  "receiptNumber": "REC001" // 可选
}
```

**必填字段**: vehicleId, type, amount, description

### 获取费用详情

**GET** `/api/expenses/{id}`

### 更新费用记录

**PUT** `/api/expenses/{id}`

### 删除费用记录

**DELETE** `/api/expenses/{id}`

### 获取车辆费用历史

**GET** `/api/expenses/vehicle/{vehicleId}/history`

获取指定车辆的费用历史记录。

### 费用统计

**GET** `/api/expenses/stats/overview`

获取费用统计信息。

## 错误代码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器内部错误 |

## 使用示例

### 1. 用户注册和登录

```bash
# 注册用户
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "email": "test@example.com",
    "password": "password123"
  }'

# 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. 车辆管理

```bash
# 获取车辆列表
curl -X GET http://localhost:3001/api/vehicles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 创建车辆（需要管理员权限）
curl -X POST http://localhost:3001/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "plateNumber": "京A12345",
    "brand": "丰田",
    "model": "凯美瑞",
    "year": 2023,
    "type": "轿车",
    "fuelType": "GASOLINE",
    "seats": 5
  }'
```

### 3. 申请管理

```bash
# 创建申请
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "出差申请",
    "purpose": "出差",
    "destination": "北京市朝阳区",
    "startTime": "2025-08-22T09:00:00.000Z",
    "endTime": "2025-08-22T18:00:00.000Z",
    "passengers": 3
  }'
```

## 测试脚本

项目根目录提供了完整的API测试脚本：

- `test_api.sh`: 基础API测试
- `test_admin_api.sh`: 管理员功能测试
- `test_comprehensive_api.sh`: 综合功能测试

运行测试：

```bash
# 确保后端服务正在运行
npm run dev

# 在另一个终端运行测试
chmod +x test_comprehensive_api.sh
./test_comprehensive_api.sh
```

## 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件配置数据库连接
```

3. 数据库迁移：
```bash
npx prisma migrate dev
```

4. 启动开发服务器：
```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动。

## 注意事项

1. 所有需要认证的API都必须在请求头中包含有效的JWT令牌
2. 管理员和经理角色拥有更多权限
3. 普通用户只能查看和管理自己的申请
4. 时间格式使用ISO 8601标准
5. 分页查询默认每页20条记录，最大100条
6. 所有金额字段使用浮点数，保留两位小数
# 车辆管理系统 API 使用指南

## 快速开始

### 1. 启动服务

```bash
# 安装依赖
npm install

# 配置数据库
npx prisma migrate dev

# 启动开发服务器
npm run dev
```

服务器将在 `http://localhost:3001` 启动。

### 2. 获取访问令牌

首先需要注册用户并获取JWT令牌：

```bash
# 注册管理员用户
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "管理员",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }'

# 登录获取令牌
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

保存返回的 `accessToken`，后续请求需要使用。

### 3. 基础操作示例

#### 创建车辆

```bash
curl -X POST http://localhost:3001/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "plateNumber": "京A12345",
    "brand": "丰田",
    "model": "凯美瑞",
    "year": 2023,
    "type": "轿车",
    "fuelType": "GASOLINE",
    "seats": 5,
    "color": "白色"
  }'
```

#### 创建驾驶员

```bash
curl -X POST http://localhost:3001/api/drivers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "licenseNumber": "110101199001011234",
    "licenseType": "C1",
    "licenseExpiry": "2025-12-31",
    "idCard": "110101199001011234"
  }'
```

#### 创建申请

```bash
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

## 常用API端点

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 车辆管理
- `GET /api/vehicles` - 获取车辆列表
- `POST /api/vehicles` - 创建车辆
- `GET /api/vehicles/{id}` - 获取车辆详情
- `PUT /api/vehicles/{id}` - 更新车辆
- `DELETE /api/vehicles/{id}` - 删除车辆
- `GET /api/vehicles/stats/overview` - 车辆统计

### 驾驶员管理
- `GET /api/drivers` - 获取驾驶员列表
- `POST /api/drivers` - 创建驾驶员
- `GET /api/drivers/{id}` - 获取驾驶员详情
- `PUT /api/drivers/{id}` - 更新驾驶员
- `DELETE /api/drivers/{id}` - 删除驾驶员

### 申请管理
- `GET /api/applications` - 获取申请列表
- `POST /api/applications` - 创建申请
- `GET /api/applications/{id}` - 获取申请详情
- `POST /api/applications/{id}/approve` - 审批申请
- `GET /api/applications/my/list` - 获取我的申请

### 费用管理
- `GET /api/expenses` - 获取费用列表
- `POST /api/expenses` - 创建费用记录
- `GET /api/expenses/{id}` - 获取费用详情
- `GET /api/expenses/stats/overview` - 费用统计

## 权限说明

### 角色类型
- `USER`: 普通用户，可以创建和查看自己的申请
- `MANAGER`: 经理，可以管理车辆、驾驶员、审批申请
- `ADMIN`: 管理员，拥有所有权限

### 权限矩阵

| 功能 | USER | MANAGER | ADMIN |
|------|------|---------|-------|
| 查看车辆列表 | ✓ | ✓ | ✓ |
| 创建/编辑车辆 | ✗ | ✓ | ✓ |
| 删除车辆 | ✗ | ✗ | ✓ |
| 查看驾驶员列表 | ✓ | ✓ | ✓ |
| 管理驾驶员 | ✗ | ✓ | ✓ |
| 创建申请 | ✓ | ✓ | ✓ |
| 查看所有申请 | ✗ | ✓ | ✓ |
| 审批申请 | ✗ | ✓ | ✓ |
| 管理费用 | ✗ | ✓ | ✓ |

## 数据格式说明

### 车辆状态 (VehicleStatus)
- `AVAILABLE`: 可用
- `IN_USE`: 使用中
- `MAINTENANCE`: 维护中
- `RETIRED`: 已退役

### 燃料类型 (FuelType)
- `GASOLINE`: 汽油
- `DIESEL`: 柴油
- `ELECTRIC`: 电动
- `HYBRID`: 混合动力
- `CNG`: 天然气

### 申请状态 (ApplicationStatus)
- `PENDING`: 待审批
- `APPROVED`: 已批准
- `REJECTED`: 已拒绝
- `COMPLETED`: 已完成
- `CANCELLED`: 已取消

### 费用类型 (ExpenseType)
- `FUEL`: 燃料费
- `MAINTENANCE`: 维护费
- `INSURANCE`: 保险费
- `REPAIR`: 维修费
- `OTHER`: 其他费用

## 错误处理

### 常见错误代码
- `400`: 请求参数错误
- `401`: 未认证或令牌无效
- `403`: 权限不足
- `404`: 资源不存在
- `409`: 资源冲突（如车牌号重复）
- `500`: 服务器内部错误

### 错误响应格式
```json
{
  "success": false,
  "message": "错误描述",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息"
  },
  "timestamp": "2025-08-21T04:17:49.215Z",
  "path": "/api/endpoint",
  "method": "POST"
}
```

## 测试工具

### 使用提供的测试脚本

```bash
# 基础功能测试
./test_api.sh

# 管理员功能测试
./test_admin_api.sh

# 综合功能测试
./test_comprehensive_api.sh
```

### 使用Postman

1. 导入API文档到Postman
2. 设置环境变量：
   - `baseUrl`: `http://localhost:3001`
   - `token`: 登录后获取的JWT令牌
3. 在请求头中添加：`Authorization: Bearer {{token}}`

### 使用curl

所有示例都使用curl命令，可以直接在终端中运行。记得替换 `YOUR_JWT_TOKEN` 为实际的令牌。

## 开发建议

1. **认证**: 始终在请求头中包含有效的JWT令牌
2. **错误处理**: 检查响应的 `success` 字段，处理错误情况
3. **分页**: 使用 `page` 和 `pageSize` 参数进行分页查询
4. **搜索**: 使用 `search` 参数进行模糊搜索
5. **时间格式**: 使用ISO 8601格式 (YYYY-MM-DDTHH:mm:ss.sssZ)
6. **数据验证**: 确保必填字段都有值，数据格式正确

## 常见问题

### Q: 如何获取管理员权限？
A: 在注册时设置 `role` 为 `ADMIN`，或联系系统管理员修改用户角色。

### Q: 为什么创建车辆失败？
A: 检查是否提供了所有必填字段：`plateNumber`, `brand`, `model`, `year`, `type`。

### Q: 申请审批后如何分配车辆？
A: 在审批时提供 `vehicleId` 参数，系统会自动分配车辆。

### Q: 如何查看车辆使用历史？
A: 通过申请列表API，筛选特定车辆的申请记录。

### Q: 费用记录可以修改吗？
A: 可以，使用PUT方法更新费用记录，需要管理员或经理权限。

## 联系支持

如有问题，请查看：
1. 完整的API文档：`API_Documentation.md`
2. 项目README：`README.md`
3. 测试脚本示例
# 统一错误处理机制

本项目实现了一个统一的错误处理机制，用于处理所有的应用错误。

## 架构组件

### 1. 自定义错误类 (`src/utils/errors.js`)

提供了多种预定义的错误类：

- **`AppError`** - 基础错误类
- **`BadRequestError`** (400) - 客户端请求错误
- **`UnauthorizedError`** (401) - 未授权
- **`ForbiddenError`** (403) - 禁止访问
- **`NotFoundError`** (404) - 资源不存在
- **`ConflictError`** (409) - 资源冲突
- **`ValidationError`** (422) - 验证失败
- **`InternalServerError`** (500) - 服务器内部错误

### 2. 错误处理中间件 (`src/middleware/errorHandler.js`)

- **`errorHandler`** - 全局错误处理中间件
  - 自动处理 Sequelize 错误
  - 区分开发和生产环境的错误响应
  - 格式化错误响应

- **`notFoundHandler`** - 处理 404 错误

### 3. Async Handler (`src/utils/asyncHandler.js`)

自动捕获异步函数中的错误并传递给错误处理中间件。

## 使用方法

### 在 Controller 中抛出错误

```javascript
const { NotFoundError, BadRequestError } = require('../utils/errors');

class MyController {
  async getItem(req, res, next) {
    // 验证参数
    if (!req.params.id) {
      throw new BadRequestError('ID is required');
    }

    // 查找资源
    const item = await db.Item.findByPk(req.params.id);

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.json(item);
  }
}
```

### 在 Routes 中使用 asyncHandler

```javascript
const asyncHandler = require('../utils/asyncHandler');
const controller = require('../controllers/myController');

// 包装所有异步路由处理器
router.get('/:id', asyncHandler(controller.getItem));
router.post('/', asyncHandler(controller.createItem));
```

### 创建自定义错误

```javascript
const { AppError } = require('../utils/errors');

// 抛出自定义错误
throw new AppError('Custom error message', 418);
```

## 错误响应格式

### 开发环境

```json
{
  "status": "fail",
  "error": {
    "statusCode": 404,
    "status": "fail",
    "isOperational": true,
    "message": "Actor not found"
  },
  "message": "Actor not found",
  "stack": "Error: Actor not found\n    at ..."
}
```

### 生产环境

```json
{
  "status": "fail",
  "message": "Actor not found"
}
```

## 错误类型处理

### 1. 自定义应用错误

```javascript
throw new NotFoundError('Resource not found');
// 响应: { status: "fail", message: "Resource not found" }
```

### 2. Sequelize 验证错误

自动转换为 422 状态码：

```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email must be unique" }
  ]
}
```

### 3. Sequelize 唯一约束错误

自动转换为 409 状态码：

```json
{
  "status": "fail",
  "message": "email already exists"
}
```

### 4. 404 - 路由不存在

```json
{
  "status": "fail",
  "message": "Cannot GET /api/nonexistent"
}
```

## 测试示例

### 1. 404 错误 - 资源不存在

```bash
curl http://localhost:3000/api/actors/999
# Response: { "status": "fail", "message": "Actor not found" }
```

### 2. 400 错误 - 缺少必填字段

```bash
curl -X POST http://localhost:3000/api/actors \
  -H "Content-Type: application/json" \
  -d '{}'
# Response: { "status": "fail", "message": "firstName and lastName are required" }
```

### 3. 400 错误 - 无效的分页参数

```bash
curl "http://localhost:3000/api/actors?limit=200"
# Response: { "status": "fail", "message": "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100" }
```

### 4. 404 错误 - 路由不存在

```bash
curl http://localhost:3000/api/nonexistent
# Response: { "status": "fail", "message": "Cannot GET /api/nonexistent" }
```

## 最佳实践

1. **使用适当的错误类型**
   - 使用预定义的错误类（NotFoundError, BadRequestError 等）
   - 提供清晰、有意义的错误消息

2. **始终使用 asyncHandler**
   - 在路由中包装所有异步处理器
   - 避免在 controller 中使用 try-catch

3. **验证输入**
   - 在处理前验证所有输入
   - 对于无效输入抛出 BadRequestError

4. **不要泄露敏感信息**
   - 生产环境中隐藏错误堆栈
   - 不在错误消息中包含敏感数据

5. **记录错误**
   - 所有非操作性错误都会被记录到控制台
   - 生产环境中应配置适当的日志服务

## 未来改进

- [ ] 集成日志服务（Winston, Pino）
- [ ] 添加错误监控（Sentry）
- [ ] 添加请求ID追踪
- [ ] 实现速率限制错误处理
- [ ] 添加更多的错误类型（如 PaymentRequiredError）

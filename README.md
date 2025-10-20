# Sakila Express API

一个基于 Express.js 和 Sequelize 构建的 RESTful API 项目，使用经典的 Sakila 数据库模型。该项目提供了完整的 CRUD 操作、数据库迁移、数据种子、Swagger API 文档以及全面的测试套件。

## 功能特性

- RESTful API 设计
- Express.js 5.x 框架
- Sequelize ORM 数据库管理
- PostgreSQL 数据库支持
- 自动化数据库迁移和种子数据
- Swagger/OpenAPI 文档
- 完整的错误处理机制
- 单元测试和集成测试
- 分页查询支持
- 开发环境热重载

## 技术栈

- **框架**: Express.js 5.x
- **ORM**: Sequelize 6.x
- **数据库**: PostgreSQL
- **API 文档**: Swagger UI + swagger-jsdoc
- **测试**: Jest + Supertest
- **开发工具**: Nodemon, cross-env

## 项目结构

```
sakila-express-api/
├── src/
│   ├── config/           # 配置文件
│   │   ├── database.js   # 数据库配置
│   │   └── swagger.js    # Swagger 配置
│   ├── controllers/      # 控制器层
│   │   └── actorsController.js
│   ├── database/         # 数据库相关
│   │   ├── migrations/   # 数据库迁移文件
│   │   └── seeders/      # 种子数据
│   ├── middleware/       # 中间件
│   │   └── errorHandler.js
│   ├── models/           # Sequelize 模型
│   │   ├── index.js
│   │   ├── actor.js
│   │   ├── film.js
│   │   ├── category.js
│   │   ├── language.js
│   │   ├── filmactor.js
│   │   └── filmcategory.js
│   ├── routes/           # 路由定义
│   │   ├── index.js
│   │   └── actors.js
│   ├── utils/            # 工具函数
│   │   ├── asyncHandler.js
│   │   └── errors.js
│   ├── app.js            # Express 应用配置
│   └── index.js          # 应用入口
├── tests/                # 测试文件
│   ├── integration/      # 集成测试
│   ├── unit/             # 单元测试
│   └── setup.js          # 测试配置
├── .sequelizerc          # Sequelize CLI 配置
├── jest.config.js        # Jest 测试配置
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm 或 yarn

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/xwenc/sakila-express-api.git
cd sakila-express-api
```

2. **安装依赖**

```bash
yarn install
# 或
npm install
```

3. **配置环境变量**

在项目根目录创建 `.env` 文件：

```env
# 数据库配置
DATABASE_DIALECT=postgres
DATABASE_HOST=localhost
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=sakila_dev
DATABASE_TEST_NAME=sakila_test

# 应用配置
NODE_ENV=development
PORT=3000
```

4. **创建数据库**

```bash
yarn db:create
```

5. **运行数据库迁移**

```bash
yarn db:migrate
```

6. **导入种子数据（可选）**

```bash
yarn db:seed
```

7. **启动开发服务器**

```bash
yarn dev
```

服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

## 可用脚本

### 开发与运行

- `yarn dev` - 启动开发服务器（带热重载）
- `yarn start` - 启动生产服务器

### 数据库管理

- `yarn db:create` - 创建数据库
- `yarn db:migrate` - 运行所有迁移
- `yarn db:rollback` - 回滚迁移
- `yarn db:seed` - 导入种子数据
- `yarn db:seed:undo` - 清除种子数据
- `yarn db:status` - 查看迁移状态
- `yarn db:drop` - 删除数据库

### 测试

- `yarn test` - 运行所有测试
- `yarn test:unit` - 运行单元测试
- `yarn test:integration` - 运行集成测试
- `yarn test:watch` - 监视模式运行测试
- `yarn test:coverage` - 生成测试覆盖率报告

## API 端点

### 基础端点

- `GET /` - 健康检查
- `GET /api` - API 信息和可用端点列表
- `GET /api-docs` - Swagger API 文档

### Actors（演员）

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/actors` | 获取所有演员（支持分页） |
| GET | `/api/actors/:id` | 获取指定演员详情 |
| POST | `/api/actors` | 创建新演员 |
| PUT | `/api/actors/:id` | 更新演员信息 |
| DELETE | `/api/actors/:id` | 删除演员 |

### 查询参数示例

**分页查询演员**

```bash
GET /api/actors?page=1&limit=10
```

### 请求示例

**创建演员**

```bash
curl -X POST http://localhost:3000/api/actors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Tom",
    "lastName": "Hanks"
  }'
```

**更新演员**

```bash
curl -X PUT http://localhost:3000/api/actors/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Thomas",
    "lastName": "Hanks"
  }'
```

**删除演员**

```bash
curl -X DELETE http://localhost:3000/api/actors/1
```

## API 文档

启动服务器后，访问 [http://localhost:3000/api-docs](http://localhost:3000/api-docs) 查看完整的 Swagger API 文档，可以直接在浏览器中测试所有 API 端点。

## 数据库模型

项目实现了 Sakila 数据库的核心模型：

- **Actor** - 演员信息
- **Film** - 电影信息
- **Category** - 电影分类
- **Language** - 语言
- **FilmActor** - 电影与演员的关联表
- **FilmCategory** - 电影与分类的关联表

### 模型关系

- Actor 与 Film 是多对多关系（通过 FilmActor）
- Film 与 Category 是多对多关系（通过 FilmCategory）
- Film 与 Language 是多对一关系

## 错误处理

项目实现了统一的错误处理机制：

- **BadRequestError (400)** - 请求参数错误
- **NotFoundError (404)** - 资源不存在
- **InternalServerError (500)** - 服务器内部错误

错误响应格式：

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Actor not found"
}
```

## 测试

项目包含完整的测试套件：

### 单元测试

- 控制器测试
- 中间件测试
- 工具函数测试

### 集成测试

- API 端点测试
- 数据库交互测试

运行测试：

```bash
# 运行所有测试
yarn test

# 查看测试覆盖率
yarn test:coverage

# 监视模式（开发时使用）
yarn test:watch
```

## 开发指南

### 添加新的模型

1. 创建迁移文件：`src/database/migrations/`
2. 创建模型文件：`src/models/`
3. 在 `src/models/index.js` 中注册模型关联
4. 创建种子数据（可选）：`src/database/seeders/`

### 添加新的 API 端点

1. 创建控制器：`src/controllers/`
2. 创建路由：`src/routes/`
3. 在 `src/routes/index.js` 中挂载路由
4. 添加 Swagger 文档注释
5. 编写测试：`tests/`

### 代码规范

- 使用 async/await 处理异步操作
- 所有路由处理器使用 `asyncHandler` 包装
- 使用自定义错误类抛出错误
- 添加适当的 JSDoc 注释
- 为新功能编写测试

## 环境说明

### 开发环境

- 数据库自动同步（`alter: true`）
- 启用 Nodemon 热重载
- 详细的错误日志

### 生产环境

- 数据库使用迁移管理
- 优化的错误响应
- 性能优化配置

### 测试环境

- 独立的测试数据库
- 每次测试后清理数据
- Mock 外部依赖

## 常见问题

### 1. 数据库连接失败

确保 `.env` 文件中的数据库配置正确，并且 PostgreSQL 服务正在运行。

### 2. 迁移失败

检查数据库是否已创建，以及当前用户是否有足够的权限。

### 3. 测试失败

确保测试数据库已创建，并且 `DATABASE_TEST_NAME` 配置正确。

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

ISC

## 相关链接

- [GitHub Repository](https://github.com/xwenc/sakila-express-api)
- [Issue Tracker](https://github.com/xwenc/sakila-express-api/issues)
- [Express.js 文档](https://expressjs.com/)
- [Sequelize 文档](https://sequelize.org/)
- [Swagger 文档](https://swagger.io/)

## 致谢

本项目使用 MySQL 官方提供的 Sakila 示例数据库模型，并改编为 PostgreSQL 版本。

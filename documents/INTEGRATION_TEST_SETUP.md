# 集成测试配置指南

## 问题现象

运行 `yarn test:integration` 或者尝试运行集成测试时出现：

```
SequelizeConnectionError: password authentication failed for user "postgres"
```

## 为什么会出现这个错误？

集成测试需要连接真实的PostgreSQL数据库，但是：
1. 测试数据库可能不存在
2. 数据库密码可能不正确
3. 数据库用户权限可能不足

## 解决步骤

### 第1步：检查PostgreSQL是否运行

```bash
# macOS
brew services list | grep postgresql

# 或检查进程
ps aux | grep postgres
```

如果没有运行，启动PostgreSQL：
```bash
brew services start postgresql
```

### 第2步：检查当前数据库配置

查看 `.env` 文件：
```bash
cat .env
```

您应该看到类似：
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sakila_express
DB_USER=postgres
DB_PASSWORD=your_password
```

### 第3步：测试数据库连接

```bash
# 尝试使用 psql 连接
psql -U postgres -h localhost

# 如果需要密码，会提示输入
```

**如果连接失败**，说明密码不对，需要：

#### 选项A：重置PostgreSQL密码

```bash
# 使用超级用户登录
psql postgres

# 在psql中执行
ALTER USER postgres PASSWORD 'your_new_password';
\q
```

#### 选项B：创建新的测试用户

```bash
# 登录PostgreSQL
psql postgres

# 创建测试用户
CREATE USER test_user WITH PASSWORD 'test_password';
ALTER USER test_user CREATEDB;
\q
```

然后更新 `.env`：
```env
DB_USER=test_user
DB_PASSWORD=test_password
```

### 第4步：创建测试数据库

```bash
# 使用测试环境创建数据库
cross-env NODE_ENV=test yarn db:create
```

**可能的错误**：
```
database "sakila_express" already exists
```

**解决方法**：创建单独的测试数据库

1. 创建 `.env.test` 文件：
```bash
cat > .env.test << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sakila_express_test
DB_USER=postgres
DB_PASSWORD=your_password
EOF
```

2. 创建测试数据库：
```bash
cross-env NODE_ENV=test yarn db:create
```

### 第5步：运行数据库迁移

```bash
cross-env NODE_ENV=test yarn db:migrate
```

### 第6步：运行集成测试

```bash
yarn test:integration
```

## 快速修复脚本

如果您想快速设置，运行以下命令：

```bash
#!/bin/bash

# 1. 创建测试环境配置
cat > .env.test << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sakila_express_test
DB_USER=postgres
DB_PASSWORD=postgres
EOF

# 2. 创建测试数据库
cross-env NODE_ENV=test yarn db:create

# 3. 运行迁移
cross-env NODE_ENV=test yarn db:migrate

# 4. 运行集成测试
yarn test:integration
```

## 常见问题

### Q1: 我不记得PostgreSQL密码怎么办？

**方法1：macOS Homebrew安装的PostgreSQL**
```bash
# 默认没有密码，直接连接
psql postgres

# 设置密码
ALTER USER postgres PASSWORD 'newpassword';
```

**方法2：使用信任认证（临时）**

编辑 `pg_hba.conf`：
```bash
# 找到配置文件
psql -U postgres -c "SHOW hba_file;"

# 编辑配置（需要sudo）
sudo nano /path/to/pg_hba.conf

# 将以下行：
# local   all             postgres                                peer
# 改为：
# local   all             postgres                                trust

# 重启PostgreSQL
brew services restart postgresql
```

### Q2: 我的PostgreSQL在Docker中运行

```bash
# 启动PostgreSQL容器
docker run --name postgres-test \
  -e POSTGRES_PASSWORD=test123 \
  -e POSTGRES_DB=sakila_express_test \
  -p 5432:5432 \
  -d postgres:15

# 更新 .env.test
cat > .env.test << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sakila_express_test
DB_USER=postgres
DB_PASSWORD=test123
EOF
```

### Q3: 我不想配置数据库，能跳过集成测试吗？

**可以！这正是默认配置。**

只运行单元测试（不需要数据库）：
```bash
yarn test        # 默认只运行单元测试
yarn test:unit   # 明确指定单元测试
```

单元测试已经覆盖了所有业务逻辑（58个测试），对于日常开发已经足够。

## 验证设置

运行以下命令验证设置是否成功：

```bash
# 1. 测试数据库连接
cross-env NODE_ENV=test node -e "
const db = require('./src/models');
db.sequelize.authenticate()
  .then(() => console.log('✅ 数据库连接成功'))
  .catch(err => console.error('❌ 数据库连接失败:', err.message));
"

# 2. 运行集成测试
yarn test:integration
```

## 推荐做法

### 日常开发
```bash
yarn test        # 只运行单元测试（快速，0.2秒）
```

### 上线前验证
```bash
yarn test:integration  # 运行集成测试（需要数据库）
```

### CI/CD
在CI环境中配置测试数据库，运行完整测试套件。

## 总结

| 场景 | 命令 | 需要数据库 |
|------|------|-----------|
| 日常开发 | `yarn test` | ❌ 不需要 |
| 单元测试 | `yarn test:unit` | ❌ 不需要 |
| 集成测试 | `yarn test:integration` | ✅ 需要 |
| 覆盖率 | `yarn test:coverage` | ❌ 不需要 |

**建议**：日常开发使用 `yarn test`，上线前运行 `yarn test:integration`。

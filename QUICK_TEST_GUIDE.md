# 快速测试指南 🚀

## ✅ 当前状态

```bash
$ yarn test

✅ Test Suites: 4 passed, 4 total
✅ Tests:       58 passed, 58 total
✅ Time:        ~0.2 seconds
```

**所有单元测试正常通过！**

---

## 📋 测试命令速查

### 日常开发（推荐）

```bash
# 运行单元测试（快速，无需数据库）
yarn test

# 或者明确指定
yarn test:unit

# 监听模式（自动重跑）
yarn test:watch

# 生成覆盖率报告
yarn test:coverage
```

### 集成测试（需要数据库配置）

```bash
# 运行集成测试
yarn test:integration
```

⚠️ **注意**：集成测试需要先配置PostgreSQL数据库，详见 [INTEGRATION_TEST_SETUP.md](INTEGRATION_TEST_SETUP.md)

---

## ❓ 常见问题

### Q: 我运行 `yarn test` 看到数据库连接错误

**可能原因**：
- 您运行的是 `yarn test:integration`（集成测试）
- 或者Jest缓存问题

**解决方法**：
```bash
# 清除Jest缓存
yarn jest --clearCache

# 然后重新运行
yarn test
```

### Q: 什么时候需要运行集成测试？

**不需要**：
- ✅ 日常开发和调试
- ✅ 修改业务逻辑
- ✅ 添加新功能
- ✅ 修复bug

**需要**：
- ⚠️ 修改数据库模型/关联
- ⚠️ 部署到生产环境前
- ⚠️ CI/CD流程中

### Q: 集成测试一直失败怎么办？

两个选择：

**选项1**：忽略集成测试（推荐）
```bash
# 只运行单元测试
yarn test
```
单元测试已经覆盖了所有业务逻辑！

**选项2**：配置测试数据库
按照 [INTEGRATION_TEST_SETUP.md](INTEGRATION_TEST_SETUP.md) 的步骤配置

---

## 📊 测试覆盖详情

### 单元测试 (58个)

| 测试文件 | 测试数 | 内容 |
|---------|--------|------|
| actorsController.test.js | 21 | CRUD操作、分页、验证 |
| errorHandler.test.js | 17 | 错误处理、Sequelize错误 |
| errors.test.js | 18 | 自定义错误类 |
| asyncHandler.test.js | 5 | 异步错误处理 |

### 集成测试 (18个 - 可选)

| 测试文件 | 测试数 | 状态 |
|---------|--------|------|
| actors.test.js | 18 | ⚠️ 需要数据库 |

---

## 🎯 推荐工作流程

### 开发新功能

```bash
# 1. 启动开发服务器
yarn dev

# 2. 在另一个终端，启动测试监听
yarn test:watch

# 3. 开发代码，测试自动运行

# 4. 提交前确认所有测试通过
yarn test
```

### 部署前检查

```bash
# 1. 运行单元测试
yarn test

# 2. 运行覆盖率测试
yarn test:coverage

# 3. （可选）运行集成测试
yarn test:integration

# 4. 确认所有通过后部署
```

---

## 🔧 故障排除

### 测试一直卡住不动

```bash
# 可能是之前的测试进程没有结束
pkill -f jest

# 重新运行
yarn test
```

### 测试结果不更新

```bash
# 清除Jest缓存
yarn jest --clearCache

# 重新运行
yarn test
```

### 想看更详细的输出

```bash
# 使用verbose模式
yarn jest --verbose

# 或者只运行特定测试
yarn test actorsController
```

---

## 📚 相关文档

- **[INTEGRATION_TEST_SETUP.md](INTEGRATION_TEST_SETUP.md)** - 集成测试配置详细步骤
- **[JEST_TESTS_SUMMARY.md](JEST_TESTS_SUMMARY.md)** - 完整的测试总结
- **[TEST_FIX_SUMMARY.md](TEST_FIX_SUMMARY.md)** - 测试问题修复说明
- **[tests/integration/README.md](tests/integration/README.md)** - 集成测试说明

---

## 💡 最佳实践

1. **频繁运行测试**
   - 每次修改代码后运行 `yarn test`
   - 或使用 `yarn test:watch` 自动运行

2. **提交前必须测试**
   - 确保所有测试通过
   - 检查测试覆盖率

3. **单元测试优先**
   - 日常开发只需要单元测试
   - 集成测试在需要时运行

4. **保持测试更新**
   - 添加新功能时添加新测试
   - 修复bug时添加回归测试

---

## ✅ 总结

| 命令 | 用途 | 速度 | 需要数据库 |
|------|------|------|-----------|
| `yarn test` | 日常开发 | ⚡ 0.2秒 | ❌ 否 |
| `yarn test:unit` | 单元测试 | ⚡ 0.2秒 | ❌ 否 |
| `yarn test:integration` | 集成测试 | 🐢 2-3秒 | ✅ 是 |
| `yarn test:coverage` | 覆盖率 | ⚡ 0.5秒 | ❌ 否 |
| `yarn test:watch` | 监听模式 | ⚡ 实时 | ❌ 否 |

**推荐**：日常使用 `yarn test` 或 `yarn test:watch` 🎯

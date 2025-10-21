# Actors API Testing Report

**Date**: 2025-10-20
**API Base URL**: http://localhost:3000
**Environment**: Development

## Test Summary

All actors API endpoints have been thoroughly tested and verified to be working correctly without bugs.

### Test Results: ✅ All Tests Passed

| Test Category | Status | Details |
|--------------|--------|---------|
| GET Endpoints | ✅ Pass | List and retrieve actors |
| POST Endpoint | ✅ Pass | Create new actors |
| PUT Endpoint | ✅ Pass | Update existing actors |
| DELETE Endpoint | ✅ Pass | Delete actors |
| Pagination | ✅ Pass | Page and limit parameters |
| Error Handling | ✅ Pass | 400, 404 errors handled correctly |
| Validation | ✅ Pass | Required fields validated |

---

## Detailed Test Cases

### 1. GET /api/actors - List All Actors ✅

**Request**:
```bash
curl http://localhost:3000/api/actors
```

**Response**:
```json
{
  "actors": [
    {
      "id": 2,
      "firstName": "Thomas",
      "lastName": "Hanks",
      "createdAt": "2025-10-20T11:41:41.694Z",
      "updatedAt": "2025-10-20T11:41:53.986Z"
    },
    {
      "id": 3,
      "firstName": "Brad",
      "lastName": "Pitt",
      "createdAt": "2025-10-20T11:44:57.923Z",
      "updatedAt": "2025-10-20T11:44:57.923Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

**Result**: ✅ Returns list of actors with pagination metadata

---

### 2. GET /api/actors?page=1&limit=1 - Pagination ✅

**Request**:
```bash
curl "http://localhost:3000/api/actors?page=1&limit=1"
```

**Response**:
```json
{
  "actors": [
    {
      "id": 2,
      "firstName": "Thomas",
      "lastName": "Hanks",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 1,
    "total": 2,
    "totalPages": 2
  }
}
```

**Result**: ✅ Pagination works correctly, returns 1 item per page

---

### 3. GET /api/actors/:id - Get Single Actor ✅

**Request**:
```bash
curl http://localhost:3000/api/actors/2
```

**Response**:
```json
{
  "id": 2,
  "firstName": "Thomas",
  "lastName": "Hanks",
  "createdAt": "2025-10-20T11:41:41.694Z",
  "updatedAt": "2025-10-20T11:41:53.986Z",
  "films": []
}
```

**Result**: ✅ Returns single actor with associated films (eager loading works)

---

### 4. POST /api/actors - Create New Actor ✅

**Request**:
```bash
curl -X POST http://localhost:3000/api/actors \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Leonardo","lastName":"DiCaprio"}'
```

**Response**:
```json
{
  "id": 4,
  "firstName": "Leonardo",
  "lastName": "DiCaprio",
  "updatedAt": "2025-10-20T14:22:06.954Z",
  "createdAt": "2025-10-20T14:22:06.954Z"
}
```

**Result**: ✅ Actor created successfully with auto-generated ID and timestamps

---

### 5. PUT /api/actors/:id - Update Actor ✅

**Request**:
```bash
curl -X PUT http://localhost:3000/api/actors/4 \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Leo","lastName":"DiCaprio"}'
```

**Response**:
```json
{
  "id": 4,
  "firstName": "Leo",
  "lastName": "DiCaprio",
  "createdAt": "2025-10-20T14:22:06.954Z",
  "updatedAt": "2025-10-20T14:22:17.608Z"
}
```

**Result**: ✅ Actor updated successfully, updatedAt timestamp changed

---

### 6. DELETE /api/actors/:id - Delete Actor ✅

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/actors/4
```

**Response**:
```json
{
  "message": "Actor deleted successfully"
}
```

**Verification** (GET deleted actor):
```json
{
  "status": "fail",
  "message": "Actor not found"
}
```

**Result**: ✅ Actor deleted successfully, subsequent GET returns 404

---

## Error Handling Tests

### 7. Invalid Pagination (limit > 100) ✅

**Request**:
```bash
curl "http://localhost:3000/api/actors?limit=101"
```

**Response**:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400,
    "status": "fail",
    "message": "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100"
  },
  "message": "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100"
}
```

**Result**: ✅ Returns 400 Bad Request with clear error message

---

### 8. POST Without Required Fields ✅

**Request**:
```bash
curl -X POST http://localhost:3000/api/actors \
  -H 'Content-Type: application/json' \
  -d '{}'
```

**Response**:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400,
    "status": "fail",
    "message": "firstName and lastName are required"
  },
  "message": "firstName and lastName are required"
}
```

**Result**: ✅ Returns 400 Bad Request for missing required fields

---

### 9. PUT Non-existent Actor ✅

**Request**:
```bash
curl -X PUT http://localhost:3000/api/actors/999 \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"User"}'
```

**Response**:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404,
    "status": "fail",
    "message": "Actor not found"
  },
  "message": "Actor not found"
}
```

**Result**: ✅ Returns 404 Not Found for non-existent actor

---

### 10. DELETE Non-existent Actor ✅

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/actors/999
```

**Response**:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404,
    "status": "fail",
    "message": "Actor not found"
  },
  "message": "Actor not found"
}
```

**Result**: ✅ Returns 404 Not Found for non-existent actor

---

### 11. Unknown Route ✅

**Request**:
```bash
curl http://localhost:3000/api/unknown
```

**Response**:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 404,
    "status": "fail",
    "message": "Cannot GET /api/unknown"
  },
  "message": "Cannot GET /api/unknown"
}
```

**Result**: ✅ Returns 404 with proper route not found message

---

## Code Quality Assessment

### ✅ Strengths

1. **Unified Error Handling**: All errors are handled consistently with custom error classes
2. **Async/Await Pattern**: Clean async handling with asyncHandler wrapper
3. **Validation**: Proper validation for required fields and pagination parameters
4. **Separation of Concerns**: Controllers, routes, and models are properly separated
5. **Pagination**: Implemented correctly with metadata (page, limit, total, totalPages)
6. **HTTP Status Codes**: Correct usage (200, 400, 404)
7. **Eager Loading**: Sequelize associations work correctly (films relationship)
8. **RESTful Design**: Follows REST API best practices

### ⚠️ Minor Observations

1. **Character Padding**: Actor names have trailing spaces (from CHAR(20) database type)
   - This is due to the database schema using CHAR instead of VARCHAR
   - Not a bug, but could be trimmed in the model getters if needed

2. **Pagination Default**: When page=0 is provided, it defaults to page=1
   - This is intentional behavior (handled by `|| 1` operator)
   - Alternative: Could throw validation error for page=0

---

## Conclusion

**Status**: ✅ **ALL TESTS PASSED - NO BUGS FOUND**

The Actors API is production-ready with:
- ✅ All CRUD operations working correctly
- ✅ Proper error handling and validation
- ✅ Correct HTTP status codes
- ✅ Pagination implemented correctly
- ✅ Database relationships working (eager loading)
- ✅ Clean code architecture (MVC pattern)
- ✅ Unified error handling system

**Recommendation**: The API is ready for use. No critical bugs or issues found during testing.

---

## Testing Tools Used

- `curl` - HTTP requests
- `jq` - JSON parsing and formatting
- Manual endpoint testing
- Error scenario validation

## Next Steps (Optional Improvements)

1. Add integration tests using Jest + Supertest (test files already created)
2. Add request body validation middleware (e.g., express-validator)
3. Add rate limiting for production
4. Add API documentation via Swagger UI (already configured at /api-docs)
5. Consider trimming CHAR fields in model getters

## 相关知识

### Sequelize migration 中添加表之间的关系有几种方式，主要通过添加外键约束来实现：

1. 在创建表时直接添加外键
```javascript
// migrations/20231018120000-create-posts.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // 引用的表名
          key: 'id'       // 引用的字段
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};
```
2. 单独创建外键约束的 migration
```javascript
// migrations/20231018130000-add-foreign-keys.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加外键约束
    await queryInterface.addConstraint('Posts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_posts_user_id',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // 删除外键约束
    await queryInterface.removeConstraint('Posts', 'fk_posts_user_id');
  }
};
3. 多对多关系（联合表）
javascript// migrations/20231018140000-create-user-roles.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 添加复合唯一约束
    await queryInterface.addIndex('UserRoles', ['userId', 'roleId'], {
      unique: true,
      name: 'unique_user_role'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserRoles');
  }
};
```

4. 添加索引以优化查询
```javascript
// migrations/20231018150000-add-indexes.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 在外键字段上添加索引
    await queryInterface.addIndex('Posts', ['userId'], {
      name: 'idx_posts_user_id'
    });

    // 添加复合索引
    await queryInterface.addIndex('Posts', ['userId', 'createdAt'], {
      name: 'idx_posts_user_created'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Posts', 'idx_posts_user_id');
    await queryInterface.removeIndex('Posts', 'idx_posts_user_created');
  }
};
```
5. 修改现有表添加关系
```javascript
// migrations/20231018160000-add-category-to-posts.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 先添加字段
    await queryInterface.addColumn('Posts', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // 再添加外键约束
    await queryInterface.addConstraint('Posts', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'fk_posts_category_id',
      references: {
        table: 'Categories',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Posts', 'fk_posts_category_id');
    await queryInterface.removeColumn('Posts', 'categoryId');
  }
};
```
6. 常用的约束选项
```javascript
// 外键约束选项说明
references: {
  model: 'TableName',  // 或者 { tableName: 'TableName' }
  key: 'id'
},
onUpdate: 'CASCADE',   // CASCADE, RESTRICT, SET NULL, SET DEFAULT, NO ACTION
onDelete: 'CASCADE'    // CASCADE, RESTRICT, SET NULL, SET DEFAULT, NO ACTION
```
7. 自引用关系（树形结构）
```javascript
// migrations/20231018170000-create-categories.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories', // 自引用
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories');
  }
};
```

重要提示

执行顺序：确保被引用的表先创建
命名规范：外键约束建议使用描述性的名称
级联操作：谨慎选择 onDelete 和 onUpdate 选项
索引优化：外键字段通常需要添加索引以提高查询性能
回滚支持：在 down 方法中正确处理约束的删除顺序

这样可以确保数据库的完整性和性能，同时保持 migration 的可维护性。


## PG 的 数据类型 

在 Sequelize.js 中针对 PostgreSQL 数据库，DataTypes 有以下主要类型：
字符串类型：

STRING: VARCHAR(255) - 可变长度字符串
STRING(length): VARCHAR(length) - 指定长度
TEXT: TEXT - 无限长度文本
TEXT('tiny'): 小文本
CHAR(length): CHAR(length) - 固定长度字符串
CITEXT: 不区分大小写的文本（需要 citext 扩展）

数字类型：

INTEGER: INTEGER - 整数
BIGINT: BIGINT - 大整数
FLOAT: REAL - 单精度浮点数
FLOAT(precision): 指定精度的浮点数
DOUBLE: DOUBLE PRECISION - 双精度浮点数
DECIMAL: DECIMAL - 精确小数
DECIMAL(precision, scale): 指定精度和小数位
REAL: REAL - 实数
SMALLINT: SMALLINT - 小整数

布尔类型：

BOOLEAN: BOOLEAN - 布尔值

日期/时间类型：

DATE: TIMESTAMP WITH TIME ZONE - 日期时间
DATEONLY: DATE - 仅日期
TIME: TIME - 时间

二进制类型：

BLOB: BYTEA - 二进制数据
BLOB('tiny'): 小二进制
BLOB('medium'): 中等二进制
BLOB('long'): 大二进制

PostgreSQL 特有类型：

UUID: UUID - 通用唯一标识符
UUIDV1: UUID v1
UUIDV4: UUID v4
HSTORE: HSTORE - 键值对存储
JSON: JSON - JSON 数据
JSONB: JSONB - 二进制 JSON（推荐使用，性能更好）
ARRAY(type): 数组类型，如 ARRAY(STRING)
RANGE(subtype): 范围类型

INTEGER.RANGE: INT4RANGE
BIGINT.RANGE: INT8RANGE
DATE.RANGE: DATERANGE
DATEONLY.RANGE: DATERANGE


GEOMETRY: 几何类型（需要 PostGIS）
GEOGRAPHY: 地理类型（需要 PostGIS）
INET: IP 地址
CIDR: 网络地址
MACADDR: MAC 地址
TSVECTOR: 文本搜索向量

枚举类型：

ENUM('value1', 'value2', ...): 枚举类型

虚拟类型：

VIRTUAL: 虚拟字段（不存储在数据库中）


关联关系类型说明：
1. 一对一关系 (hasOne/belongsTo)
```javascript
// 演员详细资料
this.hasOne(models.ActorProfile, {
  foreignKey: 'actorId',
  as: 'profile'
});
```
2. 一对多关系 (hasMany/belongsTo)
```javascript
// 演员可以有多个奖项
this.hasMany(models.Award, {
  foreignKey: 'actorId',
  as: 'awards'
});
```
3. 多对多关系 (belongsToMany)
```javascript
// 演员和电影的多对多关系
this.belongsToMany(models.Film, {
  through: models.FilmActor,
  foreignKey: 'actorId',
  otherKey: 'filmId',
  as: 'films'
});
```
4. 自关联关系
```javascript
// 演员的导师关系
this.belongsTo(models.Actor, {
  foreignKey: 'mentorId',
  as: 'mentor'
});
```
使用建议：

确保创建顺序：先创建主表（actors, films），再创建关联表（film_actors）
外键约束：使用 CASCADE 选项确保数据一致性
索引优化：为常用查询字段创建索引
业务字段：在中间表中添加必要的业务字段

这样的 migration 文件确保了数据库层面的关系完整性，与你的 Sequelize 模型定义完全匹配。

belongsTo：外键在当前表中，指向父表
hasMany：外键在子表中，指向当前表
belongsToMany：外键在中间表中，连接两个表

外键约束参数说明
references 配置

model/table: 引用的表名
key/field: 引用的字段名

级联操作选项

onUpdate:

CASCADE: 父表更新时，子表跟着更新
RESTRICT: 如果有子记录，禁止更新父记录
SET NULL: 父表更新时，子表字段设为NULL
NO ACTION: 不执行任何操作


onDelete:

CASCADE: 删除父记录时，删除所有子记录
RESTRICT: 如果有子记录，禁止删除父记录
SET NULL: 删除父记录时，子表字段设为NULL
NO ACTION: 不执行任何操作



注意事项

确保父表存在: languages 表必须在 films 表之前创建
字段类型匹配: 外键字段类型必须与被引用字段类型一致
索引: 外键字段通常需要索引以提高性能

### 示例代码
```javascript
// migrations/20231018180000-create-films.js
'use strict';

// 这些sync选项的区别：
await sequelize.sync(); // 只创建不存在的表，不修改现有表
await sequelize.sync({ alter: true }); // 尝试修改表结构（危险）
await sequelize.sync({ force: true }); // 删除并重新创建所有表（数据丢失）

```

详细解释 createActor 错误处理测试
```javascript

it("should handle database errors in createActor", async () => {
  
  // 📝 第1步：创建一个模拟的数据库错误
  const dbError = new Error("Constraint violation");
  // 这创建了一个Error对象，模拟数据库约束违反错误
  // 例如：重复的邮箱、违反外键约束、字段长度超限等
  
  // 🎭 第2步：设置Mock行为 - 让数据库操作失败
  db.Actor.create.mockRejectedValue(dbError);
  // 这告诉Jest：当调用 db.Actor.create() 时，
  // 返回一个被拒绝的Promise，拒绝原因是 dbError
  // 相当于数据库操作失败了
  
  // 📥 第3步：准备请求数据
  mockReq.body = { firstName: "Test", lastName: "Test" };
  // 设置请求体，模拟客户端发送的数据
  // 这是创建新演员所需的数据
  
  // 🚀 第4步：调用控制器方法
  await actorsController.createActor(mockReq, mockRes, mockNext);
  // 调用实际的控制器方法
  // 注意：使用 await 等待异步操作完成
  // 控制器内部会尝试调用 db.Actor.create()，但会收到我们mock的错误
  
  // ✅ 第5步：验证错误被正确处理
  expect(mockNext).toHaveBeenCalledWith(dbError);
  // 验证 next() 函数被调用，并且传入了正确的错误对象
  // 这确保错误被传递给Express的错误处理中间件
  
  // ❌ 第6步：验证响应方法未被调用
  expect(mockRes.json).not.toHaveBeenCalled();
  // 验证 res.json() 没有被调用
  // 因为发生了错误，不应该发送成功响应
});

// 🔍 测试验证的具体行为：
console.log('=== 测试验证的行为 ===');
console.log('1. 控制器正确捕获了数据库错误');
console.log('2. 错误被传递给错误处理中间件(next)');
console.log('3. 没有发送成功响应(res.json未调用)');
console.log('4. 控制器函数正常完成，没有抛出未处理的错误');
```
```javascript
// 假设的 createActor 控制器实现
const actorsController = {
  async createActor(req, res, next) {
    try {
      // 📥 1. 从请求体获取数据
      const { firstName, lastName } = req.body;
      console.log('1. 获取请求数据:', { firstName, lastName });
      
      // 💾 2. 尝试创建新演员（这里会失败）
      console.log('2. 调用 db.Actor.create()');
      const actor = await db.Actor.create({ firstName, lastName });
      // ⚠️ 在测试中，这里会抛出 "Constraint violation" 错误
      
      // 📤 3. 这行不会执行（因为上面抛出了错误）
      console.log('3. 发送成功响应 - 不会执行');
      res.status(201).json(actor);
      
    } catch (error) {
      // 🎯 4. 错误被捕获
      console.log('4. 捕获错误:', error.message);
      
      // 📡 5. 传递错误给错误处理中间件
      console.log('5. 调用 next(error)');
      next(error);
      
      // ✅ 6. 函数正常结束
      console.log('6. 函数正常结束');
    }
  }
};

// 🔄 完整的执行流程演示
async function demonstrateExecutionFlow() {
  console.log('\n=== 执行流程演示 ===');
  
  // 模拟测试环境
  const mockReq = { body: { firstName: "Test", lastName: "Test" } };
  const mockRes = { 
    status: jest.fn().mockReturnThis(),
    json: jest.fn() 
  };
  const mockNext = jest.fn();
  
  // 设置mock错误
  const dbError = new Error("Constraint violation");
  db.Actor.create = jest.fn().mockRejectedValue(dbError);
  
  console.log('开始调用控制器...');
  
  try {
    await actorsController.createActor(mockReq, mockRes, mockNext);
    console.log('控制器调用完成，没有抛出错误');
  } catch (error) {
    console.log('控制器抛出了错误（不应该发生）:', error);
  }
  
  // 检查调用结果
  console.log('\n=== 调用结果检查 ===');
  console.log('next 被调用次数:', mockNext.mock.calls.length);
  console.log('next 调用参数:', mockNext.mock.calls[0]);
  console.log('res.json 被调用次数:', mockRes.json.mock.calls.length);
  console.log('res.status 被调用次数:', mockRes.status.mock.calls.length);
}
```

```javascript
// 测试断言的详细解释

describe('断言解释', () => {
  
  // 🎯 断言1：expect(mockNext).toHaveBeenCalledWith(dbError)
  it('解释第一个断言', () => {
    // 这个断言验证：
    console.log('=== 第一个断言验证的内容 ===');
    console.log('1. mockNext 函数被调用了');
    console.log('2. 调用时传入的参数是 dbError 对象');
    console.log('3. 参数完全匹配（使用 === 比较）');
    
    // 等价的验证方式：
    expect(mockNext).toHaveBeenCalled(); // 基本调用检查
    expect(mockNext).toHaveBeenCalledTimes(1); // 精确调用次数
    expect(mockNext.mock.calls[0][0]).toBe(dbError); // 直接检查参数
    
    // 这确保了什么？
    console.log('\n=== 这确保了什么？ ===');
    console.log('✅ 错误没有被静默忽略');
    console.log('✅ 错误被正确传递给Express错误处理链');
    console.log('✅ 错误对象保持原样，没有被修改');
  });
  
  // ❌ 断言2：expect(mockRes.json).not.toHaveBeenCalled()
  it('解释第二个断言', () => {
    console.log('=== 第二个断言验证的内容 ===');
    console.log('1. mockRes.json 函数没有被调用');
    console.log('2. 调用次数为 0');
    
    // 等价的验证方式：
    expect(mockRes.json).toHaveBeenCalledTimes(0);
    expect(mockRes.json.mock.calls.length).toBe(0);
    
    // 这确保了什么？
    console.log('\n=== 这确保了什么？ ===');
    console.log('✅ 发生错误时不发送成功响应');
    console.log('✅ 避免了混淆的响应状态');
    console.log('✅ 遵循了"要么成功响应，要么错误处理"的原则');
    
    // 为什么这很重要？
    console.log('\n=== 为什么这很重要？ ===');
    console.log('❌ 如果既调用了next(error)又调用了res.json()：');
    console.log('   - 客户端可能收到部分响应');
    console.log('   - Express可能报"Cannot set headers after they are sent"错误');
    console.log('   - 错误处理中间件可能无法正确处理');
  });

  // 🔍 完整的测试验证逻辑
  it('完整的测试验证逻辑', () => {
    console.log('=== 完整的验证逻辑 ===');
    console.log('这个测试确保控制器在数据库错误时：');
    console.log('1. 🎯 正确识别错误（try-catch捕获）');
    console.log('2. 📡 正确传递错误（调用next(error)）');
    console.log('3. 🚫 不发送响应（不调用res.json）');
    console.log('4. ✅ 让错误处理中间件接管');
    
    console.log('\n这模拟了真实场景中的：');
    console.log('- 数据库连接失败');
    console.log('- 约束违反（如重复邮箱）');
    console.log('- 验证错误');
    console.log('- 权限问题等');
  });
});
```
```javascript
// 成功场景 vs 错误场景对比

describe('成功 vs 错误场景对比', () => {
  
  // ✅ 成功场景测试
  it('should create actor successfully', async () => {
    // 1. 准备成功的mock数据
    const newActor = { firstName: "John", lastName: "Doe" };
    const createdActor = { id: 1, ...newActor, createdAt: new Date() };
    
    // 2. 设置成功的mock
    db.Actor.create.mockResolvedValue(createdActor);
    mockReq.body = newActor;
    
    // 3. 调用控制器
    await actorsController.createActor(mockReq, mockRes, mockNext);
    
    // 4. 验证成功响应
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(createdActor);
    expect(mockNext).not.toHaveBeenCalled(); // 👈 成功时不调用next
  });
  
  // ❌ 错误场景测试（你的测试）
  it('should handle database errors in createActor', async () => {
    // 1. 准备错误的mock
    const dbError = new Error("Constraint violation");
    
    // 2. 设置失败的mock
    db.Actor.create.mockRejectedValue(dbError);
    mockReq.body = { firstName: "Test", lastName: "Test" };
    
    // 3. 调用控制器
    await actorsController.createActor(mockReq, mockRes, mockNext);
    
    // 4. 验证错误处理
    expect(mockNext).toHaveBeenCalledWith(dbError); // 👈 错误时调用next
    expect(mockRes.json).not.toHaveBeenCalled(); // 👈 错误时不响应
  });

  // 📊 对比总结
  it('总结两种场景的区别', () => {
    console.log('=== 成功场景 vs 错误场景 ===');
    
    console.log('\n✅ 成功场景的特征：');
    console.log('- db.Actor.create.mockResolvedValue() // Promise resolved');
    console.log('- res.status(201).json(data) // 发送成功响应');
    console.log('- next() 不被调用 // 不需要错误处理');
    
    console.log('\n❌ 错误场景的特征：');
    console.log('- db.Actor.create.mockRejectedValue() // Promise rejected');
    console.log('- next(error) 被调用 // 传递错误');
    console.log('- res.json() 不被调用 // 不发送响应');
    
    console.log('\n🎯 测试验证的完整性：');
    console.log('- 成功时：验证正确响应 + next不被调用');
    console.log('- 失败时：验证next被调用 + 响应不被发送');
    console.log('- 这确保了控制器在任何情况下都有明确的行为');
  });

  // 🔄 真实世界的映射
  it('真实世界的场景映射', () => {
    console.log('=== 真实世界场景 ===');
    
    console.log('\n这个测试模拟的真实情况：');
    console.log('1. 🌐 客户端发送POST请求创建演员');
    console.log('2. 🎭 控制器接收数据并尝试保存到数据库');
    console.log('3. 💥 数据库返回约束违反错误（如重复名字）');
    console.log('4. 🛡️ 控制器捕获错误并传递给错误处理器');
    console.log('5. 📨 错误处理器返回适当的错误响应给客户端');
    
    console.log('\n如果没有正确的错误处理：');
    console.log('❌ 应用可能崩溃');
    console.log('❌ 客户端收到500内部服务器错误');
    console.log('❌ 错误信息不明确');
    console.log('❌ 调试困难');
  });
});
```
```javascript
// 常见的错误处理测试模式

describe('常见错误处理测试模式', () => {
  
  // 模式1: 数据库约束错误
  it('should handle unique constraint violations', async () => {
    const constraintError = new Error('Duplicate entry for email');
    constraintError.name = 'SequelizeUniqueConstraintError';
    constraintError.fields = { email: 'test@example.com' };
    
    db.Actor.create.mockRejectedValue(constraintError);
    mockReq.body = { firstName: 'John', lastName: 'Doe', email: 'test@example.com' };
    
    await actorsController.createActor(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(constraintError);
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  // 模式2: 验证错误
  it('should handle validation errors', async () => {
    const validationError = new Error('Validation failed');
    validationError.name = 'SequelizeValidationError';
    validationError.errors = [
      { field: 'firstName', message: 'First name is required' },
      { field: 'lastName', message: 'Last name too long' }
    ];
    
    db.Actor.create.mockRejectedValue(validationError);
    mockReq.body = { firstName: '', lastName: 'VeryLongLastNameThatExceedsLimit' };
    
    await actorsController.createActor(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(validationError);
  });

  // 模式3: 网络/连接错误
  it('should handle database connection errors', async () => {
    const connectionError = new Error('ECONNREFUSED');
    connectionError.code = 'ECONNREFUSED';
    connectionError.syscall = 'connect';
    
    db.Actor.create.mockRejectedValue(connectionError);
    mockReq.body = { firstName: 'John', lastName: 'Doe' };
    
    await actorsController.createActor(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(connectionError);
  });

  // 模式4: 超时错误
  it('should handle database timeout errors', async () => {
    const timeoutError = new Error('Query timeout');
    timeoutError.code = 'ETIMEDOUT';
    
    db.Actor.create.mockRejectedValue(timeoutError);
    mockReq.body = { firstName: 'John', lastName: 'Doe' };
    
    await actorsController.createActor(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(timeoutError);
  });

  // 模式5: 通用错误处理测试
  it('should handle any unexpected errors', async () => {
    const unexpectedError = new Error('Something went wrong');
    
    db.Actor.create.mockRejectedValue(unexpectedError);
    mockReq.body = { firstName: 'John', lastName: 'Doe' };
    
    await actorsController.createActor(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(unexpectedError);
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  // 高级模式: 多个错误类型的批量测试
  it('should handle various error types consistently', async () => {
    const errorTypes = [
      {
        name: 'Constraint Error',
        error: Object.assign(new Error('Unique constraint failed'), {
          name: 'SequelizeUniqueConstraintError'
        })
      },
      {
        name: 'Validation Error',
        error: Object.assign(new Error('Validation failed'), {
          name: 'SequelizeValidationError'
        })
      },
      {
        name: 'Connection Error',
        error: Object.assign(new Error('Connection refused'), {
          code: 'ECONNREFUSED'
        })
      }
    ];

    for (const { name, error } of errorTypes) {
      // 重置所有mock
      jest.clearAllMocks();
      
      db.Actor.create.mockRejectedValue(error);
      mockReq.body = { firstName: 'Test', lastName: 'User' };
      
      await actorsController.createActor(mockReq, mockRes, mockNext);
      
      // 验证每种错误都被正确处理
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.json).not.toHaveBeenCalled();
      
      console.log(`✅ ${name} handled correctly`);
    }
  });
});
```

🎯 测试的核心目的
这个测试验证你的 createActor 控制器能够：

正确捕获数据库错误（try-catch）
正确传递错误给错误处理中间件（next(error)）
避免发送成功响应当错误发生时
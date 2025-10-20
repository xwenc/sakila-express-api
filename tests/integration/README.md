# Integration Tests

⚠️ **Note**: Integration tests are **skipped by default** in `yarn test` because they require a database connection.

## Why Integration Tests Are Disabled by Default

Integration tests require:
1. A running PostgreSQL database
2. Proper test database credentials
3. Running migrations on the test database

To keep `yarn test` fast and reliable, integration tests are excluded by default. **Unit tests provide comprehensive coverage** of all business logic without requiring external dependencies.

---

## Running Integration Tests (Optional)

### Prerequisites

1. **Configure test database credentials**

   Create a `.env.test` file or update your `.env` with test database settings:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sakila_express_test
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

2. **Create test database**:
   ```bash
   cross-env NODE_ENV=test yarn db:create
   ```

3. **Run migrations**:
   ```bash
   cross-env NODE_ENV=test yarn db:migrate
   ```

4. **Seed test data** (optional):
   ```bash
   cross-env NODE_ENV=test yarn db:seed
   ```

### Run Integration Tests

To run integration tests specifically:

```bash
yarn test:integration
```

Or run all tests including integration tests:

```bash
npx jest --testPathIgnorePatterns=node_modules
```

---

## Test Configuration

### Default Behavior (yarn test)

```javascript
// jest.config.js
testPathIgnorePatterns: [
  '/node_modules/',
  '/tests/integration/',  // ← Integration tests skipped
]
```

This means:
- ✅ `yarn test` runs **only unit tests** (fast, no database required)
- ✅ `yarn test:unit` runs unit tests
- ✅ `yarn test:integration` runs integration tests (requires database setup)

---

## What Integration Tests Cover

**File**: [tests/integration/actors.test.js](./actors.test.js)

18 integration tests covering:
- ✅ GET /api/actors - list all actors
- ✅ GET /api/actors/:id - get single actor
- ✅ POST /api/actors - create actor
- ✅ PUT /api/actors/:id - update actor
- ✅ DELETE /api/actors/:id - delete actor
- ✅ Pagination scenarios
- ✅ Validation errors
- ✅ 404 errors
- ✅ Data integrity

---

## Unit Tests vs Integration Tests

| Aspect | Unit Tests | Integration Tests |
|--------|-----------|-------------------|
| **Database** | ❌ Not required (mocked) | ✅ Required |
| **Speed** | ⚡ Very fast (~0.2s) | 🐢 Slower (~2-3s) |
| **Coverage** | ✅ Business logic | ✅ Database + API |
| **Setup** | ✅ None | ⚠️ Database required |
| **Run by default** | ✅ Yes (`yarn test`) | ❌ No (manual) |

**Recommendation**: Use unit tests for regular development. Integration tests are useful for:
- Pre-production validation
- CI/CD pipelines
- Testing database-specific behavior

---

## Troubleshooting

### Error: "password authentication failed"

This means the test database credentials are incorrect. Solutions:

1. **Check your database password**:
   ```bash
   psql -U postgres -h localhost
   # Enter your password
   ```

2. **Update .env or .env.test**:
   ```env
   DB_PASSWORD=correct_password
   ```

3. **Create test database user** (if needed):
   ```sql
   CREATE USER test_user WITH PASSWORD 'test_password';
   GRANT ALL PRIVILEGES ON DATABASE sakila_express_test TO test_user;
   ```

### Error: "database does not exist"

Run database creation:
```bash
cross-env NODE_ENV=test yarn db:create
cross-env NODE_ENV=test yarn db:migrate
```

---

## Notes

- Integration tests clean up after themselves (delete test data)
- Each test suite is isolated
- Tests use actual database transactions
- Sequelize models and associations are tested end-to-end

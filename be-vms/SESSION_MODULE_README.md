# Session Module Migration

Đã hoàn thành việc chuyển đổi module Session từ `Be/src` sang `be-tool/src` theo mô hình DDD.

## Cấu trúc đã tạo:

### 1. Domain Layer

- `src/session/domain/session.ts` - Domain model cho Session
- `src/users/domain/user.ts` - Domain model cho User

### 2. Infrastructure Layer

- `src/session/infrastructure/persistence/relational/entities/session.entity.ts` - Entity cho Session
- `src/users/infrastructure/persistence/relational/entities/user.entity.ts` - Entity cho User
- `src/session/infrastructure/persistence/relational/mappers/session.mapper.ts` - Mapper cho Session
- `src/users/infrastructure/persistence/relational/mappers/user.mapper.ts` - Mapper cho User
- `src/session/infrastructure/persistence/relational/repositories/session.repository.ts` - Repository cho Session
- `src/users/infrastructure/persistence/relational/repositories/user.repository.ts` - Repository cho User

### 3. Application Layer

- `src/session/session.service.ts` - Service cho Session
- `src/users/users.service.ts` - Service cho User
- `src/auth/auth.service.ts` - Service cho Authentication
- `src/auth/controllers/auth.controller.ts` - Controller cho Authentication
- `src/auth/guards/auth.guard.ts` - Guard cho Authentication

### 4. DTOs

- `src/auth/dto/login.dto.ts` - DTO cho login request
- `src/auth/dto/login-response.dto.ts` - DTO cho login response

## API Endpoints:

### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `GET /auth/test` - Test authentication (cần token)

## Test Instructions:

1. **Start the application:**

   ```bash
   cd be-tool
   npm run start:dev
   ```

2. **Test login:**

   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "password": "password"}'
   ```

3. **Test authentication guard:**

   ```bash
   curl -X GET http://localhost:3000/auth/test \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

4. **Test logout:**
   ```bash
   curl -X POST http://localhost:3000/auth/logout \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## Notes:

- Module đã được tích hợp vào `app.module.ts`
- Sử dụng TypeORM với PostgreSQL
- Token có thời hạn 30 ngày
- Password được hash bằng MD5 (như trong code gốc)
- Cần tạo database và tables trước khi test

## Next Steps:

1. Tạo database migration cho UserLoginTokens và Users tables
2. Thêm validation cho DTOs
3. Implement error handling tốt hơn
4. Thêm logging
5. Implement các module khác theo cùng pattern

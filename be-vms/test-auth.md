# Test Hệ thống Authentication

## Các bước đã thực hiện để fix lỗi:

### 1. ✅ Bỏ comment GroupsModule trong app.module.ts

```typescript
import { GroupsModule } from './groups/groups.module';
// ...
GroupsModule,
```

### 2. ✅ Xóa global guards khỏi main.ts

- Không sử dụng `app.useGlobalGuards()` nữa
- Sử dụng `APP_GUARD` trong AuthModule

### 3. ✅ Cập nhật AuthModule với APP_GUARD

```typescript
providers: [
  AuthService,
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
],
```

### 4. ✅ Cập nhật AuthGuard để kiểm tra @Public

```typescript
constructor(
  private readonly sessionService: SessionService,
  private readonly reflector: Reflector,
) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
  // Kiểm tra @Public decorator
  const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (isPublic) {
    return true;
  }
  // ... rest of the logic
}
```

## Test các API:

### 1. API Public (không cần token)

```bash
curl http://localhost:3000/topup/public-info
```

**Kết quả mong đợi**: ✅ 200 OK

### 2. API Admin (cần token + role)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/topup/admin-stats
```

**Kết quả mong đợi**:

- ❌ 401 nếu không có token
- ❌ 403 nếu có token nhưng không có role admin
- ✅ 200 nếu có token + role admin

### 3. API Mặc định (chỉ cần token)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -X POST http://localhost:3000/topup/create \
     -H "Content-Type: application/json" \
     -d '{"imei":"123","planId":"456","userId":"789"}'
```

**Kết quả mong đợi**:

- ❌ 401 nếu không có token
- ✅ 200 nếu có token hợp lệ

## Lưu ý:

1. **@Public()** sẽ bypass cả AuthGuard và RolesGuard
2. **@Roles()** sẽ bypass RolesGuard nhưng vẫn cần AuthGuard
3. **Không có decorator** = chỉ cần xác thực (AuthGuard)
4. Thứ tự guards: AuthGuard → RolesGuard

## Nếu vẫn có lỗi:

Kiểm tra:

1. Database connection
2. Bảng Groups và GroupUsers đã được tạo chưa
3. Có user nào được gán vào group 'admin' chưa
4. Logs để xem lỗi cụ thể

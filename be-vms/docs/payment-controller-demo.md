# Demo Sử dụng @Public() và @Roles() trong PaymentsController

## Tổng quan

Controller `PaymentsController` hiện tại đang sử dụng `@UseGuards(AuthGuard)` ở cấp class, nghĩa là **TẤT CẢ** các API endpoints đều cần xác thực. Tuy nhiên, bạn có thể sử dụng các decorators để override quyền truy cập cho từng API cụ thể.

## Cách hoạt động

### 1. Controller Level Guard

```typescript
@Controller('topup')
@UseGuards(AuthGuard) // ← Tất cả APIs đều cần xác thực
@ApiBearerAuth()
export class PaymentsController {
  // ...
}
```

### 2. API Level Decorators

#### API Public - Không cần xác thực

```typescript
@Get('public-info')
@Public()  // ← Bypass cả AuthGuard và RolesGuard
getPublicInfo() {
  return {
    message: 'This is public payment information',
    timestamp: new Date(),
    service: 'Payment Service',
    version: '1.0.0'
  };
}
```

**Kết quả**: API này có thể truy cập mà không cần token, không cần đăng nhập.

#### API Admin Only - Cần xác thực + Role admin

```typescript
@Get('admin-stats')
@Roles('admin')  // ← Cần xác thực VÀ có role 'admin'
getAdminStats() {
  return {
    message: 'Admin payment statistics',
    timestamp: new Date(),
    totalTransactions: 1000,
    totalRevenue: 50000000
  };
}
```

**Kết quả**: API này cần:

1. Token hợp lệ (AuthGuard)
2. User phải thuộc group 'admin' (RolesGuard)

#### API Mặc định - Chỉ cần xác thực

```typescript
@Post('create')
async createTopUp(@Body() body: { imei: string; planId: string; userId: string }) {
  // Không có @Public() hoặc @Roles() → chỉ cần xác thực
  // ...
}
```

**Kết quả**: API này chỉ cần token hợp lệ, không cần role cụ thể.

## Thứ tự ưu tiên

1. **@Public()** - Cao nhất, bypass tất cả guards
2. **@Roles()** - Cần xác thực + kiểm tra role
3. **Mặc định** - Chỉ cần xác thực

## Test các API

### 1. Test API Public

```bash
# Không cần token
curl http://localhost:3000/topup/public-info
```

**Kết quả**: ✅ 200 OK - Không cần xác thực

### 2. Test API Admin (không có token)

```bash
# Không có token
curl http://localhost:3000/topup/admin-stats
```

**Kết quả**: ❌ 401 Unauthorized - Cần xác thực

### 3. Test API Admin (có token nhưng không có role)

```bash
# Có token nhưng user không thuộc group 'admin'
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/topup/admin-stats
```

**Kết quả**: ❌ 403 Forbidden - Không đủ quyền

### 4. Test API Admin (có token + có role)

```bash
# Có token VÀ user thuộc group 'admin'
curl -H "Authorization: Bearer ADMIN_TOKEN" \
     http://localhost:3000/topup/admin-stats
```

**Kết quả**: ✅ 200 OK - Có đủ quyền

### 5. Test API Mặc định (có token)

```bash
# Có token hợp lệ
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -X POST http://localhost:3000/topup/create \
     -H "Content-Type: application/json" \
     -d '{"imei":"123","planId":"456","userId":"789"}'
```

**Kết quả**: ✅ 200 OK - Chỉ cần xác thực

## Lưu ý quan trọng

1. **@Public()** sẽ bypass **CẢ** AuthGuard và RolesGuard
2. **@Roles()** sẽ bypass RolesGuard nhưng vẫn cần AuthGuard
3. **Không có decorator** = chỉ cần xác thực (AuthGuard)
4. Bạn có thể kết hợp nhiều roles: `@Roles('admin', 'manager')`

## Ví dụ thêm

```typescript
// API cho admin hoặc manager
@Get('manager-stats')
@Roles('admin', 'manager')
getManagerStats() {
  return { message: 'Manager or Admin data' };
}

// API cho user thường
@Get('user-dashboard')
@Roles('user', 'admin', 'manager')
getUserDashboard() {
  return { message: 'User dashboard data' };
}
```

## Kết luận

✅ **Có thể gắn cờ @Public() cho một API cụ thể** để bypass xác thực

✅ **Có thể gắn @Roles() cho một API cụ thể** để kiểm tra quyền

✅ **Các API khác vẫn tuân theo guard mặc định** của controller

Hệ thống này cho phép bạn linh hoạt trong việc quản lý quyền truy cập cho từng API endpoint.

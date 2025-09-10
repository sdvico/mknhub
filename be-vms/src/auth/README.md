# Auth Module - Hướng dẫn sử dụng

## Decorators

### 1. @Public()

- **Mục đích**: Đánh dấu API không cần authentication
- **Sử dụng**: API công khai, không cần đăng nhập
- **Ví dụ**:

```typescript
@Public()
@Get('public-data')
getPublicData() {
  return { message: 'This is public data' };
}
```

### 2. @RequiresApiKey()

- **Mục đích**: Đánh dấu API cần x-api-key header
- **Sử dụng**: API cần xác thực bằng API key
- **Ví dụ**:

```typescript
@RequiresApiKey()
@Post('webhook')
receiveWebhook(@Body() data: any) {
  // API này cần x-api-key header
  return { status: 'received' };
}
```

### 3. @ApiKeyOnly()

- **Mục đích**: Đánh dấu API chỉ cần x-api-key, không cần auth token
- **Sử dụng**: API webhook, callback, hoặc external service
- **Ví dụ**:

```typescript
@RequiresApiKey()
@ApiKeyOnly()
@Post('external-callback')
externalCallback(@Body() data: any) {
  // API này chỉ cần x-api-key, không cần Bearer token
  return { status: 'success' };
}
```

### 4. @Roles(['group1', 'group2'])

- **Mục đích**: Đánh dấu API cần quyền từ các group cụ thể
- **Sử dụng**: API cần phân quyền theo group
- **Ví dụ**:

```typescript
@Roles(['Administrators', 'Managers'])
@Get('admin-data')
getAdminData() {
  // Chỉ user trong group Administrators hoặc Managers mới truy cập được
  return { message: 'Admin data' };
}
```

## Cách sử dụng kết hợp

### API cần cả x-api-key và auth token

```typescript
@RequiresApiKey()
@Post('secure-endpoint')
secureEndpoint(@Body() data: any, @Request() req) {
  // Cần cả x-api-key và Bearer token
  // req.user sẽ có thông tin user
  return { message: 'Secure data' };
}
```

### API chỉ cần x-api-key

```typescript
@RequiresApiKey()
@ApiKeyOnly()
@Post('webhook')
webhook(@Body() data: any) {
  // Chỉ cần x-api-key, không cần Bearer token
  return { status: 'webhook received' };
}
```

### API cần phân quyền

```typescript
@RequiresApiKey()
@Roles(['Ship Owners', 'Ship Captains'])
@Get('ship-data')
getShipData(@Request() req) {
  // Cần x-api-key, Bearer token và quyền từ group Ship Owners hoặc Ship Captains
  return { shipData: '...' };
}
```

## Cấu hình

### Environment Variables

```bash
# Thêm vào .env file
API_KEY=your-secret-api-key-here
```

### Headers cần thiết

#### Cho API cần x-api-key:

```
x-api-key: your-secret-api-key-here
```

#### Cho API cần auth token:

```
Authorization: Bearer your-jwt-token-here
```

#### Cho API cần cả hai:

```
x-api-key: your-secret-api-key-here
Authorization: Bearer your-jwt-token-here
```

## Thứ tự kiểm tra trong AuthGuard

1. **@Public()** - Nếu có, cho phép truy cập ngay lập tức
2. **@RequiresApiKey()** - Kiểm tra x-api-key header
3. **@ApiKeyOnly()** - Nếu có, chỉ cần x-api-key
4. **Authorization header** - Kiểm tra Bearer token
5. **@Roles()** - Kiểm tra quyền theo group (nếu có)

## Lưu ý

- `@RequiresApiKey()` và `@ApiKeyOnly()` phải được sử dụng cùng nhau nếu chỉ muốn x-api-key
- `@Roles()` chỉ hoạt động khi có user được xác thực (có Bearer token)
- API key được cấu hình qua environment variable `API_KEY`
- Tất cả API đều chạy qua `AuthGuard` trừ khi có `@Public()`

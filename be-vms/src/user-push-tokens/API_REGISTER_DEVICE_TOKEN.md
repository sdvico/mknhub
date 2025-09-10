# API Đăng Ký Device Token

## 1. Giới thiệu

API cho phép đăng ký hoặc cập nhật device push token cho user. Nếu device token đã tồn tại, sẽ cập nhật `user_id` và các thông tin khác. Nếu chưa tồn tại, sẽ tạo mới.

## 2. Authentication

Sử dụng header: `Authorization: Bearer <token>`. Tất cả endpoint chạy qua HTTPS.

## 3. Mô tả Data Type

| Trường     | Kiểu dữ liệu | Bắt buộc | Mô tả                                        |
| ---------- | ------------ | -------- | -------------------------------------------- |
| device_os  | string       | Không    | Hệ điều hành của device (iOS, Android, etc.) |
| push_token | string       | Có       | Push notification token của device           |
| app_ver    | string       | Không    | Phiên bản ứng dụng                           |
| module     | string       | Không    | Tên module                                   |

## 4. Endpoints

### 4.1 Đăng ký device token

**POST** `/v1/user-push-tokens/register`

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request body:**

```json
{
  "device_os": "iOS",
  "push_token": "fMEP0JqFyF4:APA91bHqX...",
  "app_ver": "1.0.0",
  "module": "main"
}
```

**Response 200 OK:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "userid": "550e8400-e29b-41d4-a716-446655440002",
  "device_os": "iOS",
  "push_token": "fMEP0JqFyF4:APA91bHqX...",
  "registered_date": "2025-01-15T10:30:00Z",
  "app_ver": "1.0.0",
  "module": "main"
}
```

## 5. Logic xử lý

### 5.1 Kiểm tra device token tồn tại

- Tìm kiếm theo `push_token` (unique constraint)
- Nếu tồn tại: cập nhật `user_id` và các thông tin khác
- Nếu chưa tồn tại: tạo mới record

### 5.2 Cập nhật thông tin

- `user_id`: Lấy từ JWT token (current user)
- `device_os`: Cập nhật nếu có giá trị mới
- `app_ver`: Cập nhật nếu có giá trị mới
- `module`: Cập nhật nếu có giá trị mới
- `registered_date`: Giữ nguyên nếu update, tạo mới nếu create

## 6. Error Responses

### 6.1 Validation Error (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 6.2 Unauthorized (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 6.3 User not authenticated (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "User not authenticated",
  "error": "Bad Request"
}
```

### 6.4 Failed to register device token (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "Failed to register device token",
  "error": "Bad Request"
}
```

## 7. Ví dụ sử dụng

### 7.1 Đăng ký device token mới

```bash
curl -X POST "http://localhost:3000/v1/user-push-tokens/register" \
  -H "Authorization: Bearer your-jwt-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "device_os": "iOS",
    "push_token": "fMEP0JqFyF4:APA91bHqX...",
    "app_ver": "1.0.0",
    "module": "main"
  }'
```

### 7.2 Cập nhật device token đã tồn tại

```bash
curl -X POST "http://localhost:3000/v1/user-push-tokens/register" \
  -H "Authorization: Bearer your-jwt-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "device_os": "Android",
    "push_token": "fMEP0JqFyF4:APA91bHqX...",
    "app_ver": "1.1.0",
    "module": "main"
  }'
```

## 8. Lưu ý quan trọng

### 8.1 Unique Constraint

- `push_token` có unique constraint để đảm bảo không trùng lặp
- Khi update, sẽ cập nhật `user_id` cho device token đã tồn tại

### 8.2 Authentication

- Bắt buộc phải có JWT token hợp lệ
- `user_id` được lấy tự động từ JWT token

### 8.3 Optional Fields

- `device_os`, `app_ver`, `module` là optional
- Nếu không truyền, sẽ giữ nguyên giá trị cũ (khi update) hoặc null (khi create)

### 8.4 Database Schema

```sql
-- Unique constraint cho push_token
ALTER TABLE UserPushTokens
ADD CONSTRAINT UQ_UserPushTokens_push_token
UNIQUE (push_token);

-- Index cho performance
CREATE UNIQUE INDEX IDX_UserPushTokens_push_token
ON UserPushTokens (push_token);
```

## 9. Migration

Migration file: `1703123456794-AddUniqueConstraintToPushToken.ts`

## 10. Support

Nếu gặp vấn đề, vui lòng liên hệ:

- Email: support@quanlythuysan.vn
- Documentation: http://docs.quanlythuysan.vn

# Test API Authentication

## 1. API Đăng ký (Register)

### Endpoint: POST /auth/register

#### Test Case 1: Đăng ký bằng số điện thoại

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0123456789",
    "fullname": "Nguyễn Văn A",
    "password": "0123456789"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": "uuid-here",
    "username": "0123456789",
    "phone": "0123456789",
    "fullname": "Nguyễn Văn A",
    "state": 0
  }
}
```

#### Test Case 2: Đăng ký bằng username thông thường

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user123",
    "fullname": "Nguyễn Văn B",
    "password": "user123"
  }'
```

#### Test Case 3: Đăng ký không nhập password (sẽ tự động set bằng username)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user456",
    "fullname": "Nguyễn Văn D"
  }'
```

#### Test Case 4: Đăng ký với username đã tồn tại (Error)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0123456789",
    "fullname": "Nguyễn Văn C",
    "password": "0123456789"
  }'
```

#### Test Case 5: Đăng ký với số điện thoại (sẽ được format thành +84)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0987654321",
    "fullname": "Trần Thị D",
    "password": "0987654321"
  }'
```

**Expected Response (phone sẽ được format):**

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": "uuid-here",
    "username": "0987654321",
    "phone": "+84987654321",
    "fullname": "Trần Thị D",
    "state": 0
  }
}
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Username already exists"
}
```

## 2. API Đăng nhập (Login)

### Endpoint: POST /auth/login

#### Test Case 1: Đăng nhập bằng số điện thoại (đã đăng ký ở trên)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0123456789",
    "password": "0123456789"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "token": "hex-token-here",
  "user": {
    "id": "uuid-here",
    "username": "0123456789",
    "state": 0
  }
}
```

#### Test Case 2: Đăng nhập bằng username thông thường

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user123",
    "password": "user123"
  }'
```

#### Test Case 3: Đăng nhập với thông tin sai (Error)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0123456789",
    "password": "wrongpassword"
  }'
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### Test Case 4: Đăng nhập với định dạng số điện thoại khác nhau (sau khi đã đăng ký với 0987654321)

```bash
# Đăng nhập với định dạng gốc (0xxx)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0987654321",
    "password": "0987654321"
  }'

# Đăng nhập với định dạng quốc tế (+84xxx)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "+84987654321",
    "password": "0987654321"
  }'
```

## 3. Test Flow Hoàn Chỉnh

1. **Đăng ký user mới:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0987654321",
    "fullname": "Trần Thị C",
    "password": "0987654321"
  }'
```

2. **Đăng nhập với user vừa tạo:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "0987654321",
    "password": "0987654321"
  }'
```

3. **Test API /auth/me với token:**

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Lưu ý:

1. **Password:**
   - Có thể nhập password tùy chọn khi đăng ký
   - Nếu không nhập password, sẽ tự động set bằng username
2. **Logic đăng nhập:**
   - Nếu username là số điện thoại → tìm theo phone
   - Nếu username không phải số điện thoại → tìm theo username
3. **Auto fill phone:** Khi đăng ký, field phone sẽ được tự động điền bằng username
4. **Format số điện thoại:**
   - Số điện thoại Việt Nam (0xxx) sẽ được tự động chuyển thành định dạng quốc tế (+84xxx)
   - Đăng nhập hỗ trợ cả hai định dạng: 0xxx và +84xxx
5. **State mặc định:** User mới đăng ký có state = 0

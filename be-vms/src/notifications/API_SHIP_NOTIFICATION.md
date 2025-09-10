# API Gửi Thông Báo Cho Chủ Tàu

## 1. Giới thiệu

API cho phép hệ thống gửi thông báo đến chủ tàu và tra cứu trạng thái xử lý. Mỗi yêu cầu được định danh bằng:

- **clientReq**: mã do client sinh (UUID/ngẫu nhiên).
- **requestId**: mã server sinh, trả về khi tạo thông báo thành công.

**Base URL**: `http://hub.quanlythuysan.vn/api/v1/ship-notifications`

**APIDoc**: `http://hub.quanlythuysan.vn/docs#`

## 2. Authentication

Sử dụng header: **x-api-key: <api-key>**. Tất cả endpoint chạy qua HTTPS.

**Lưu ý**: API này sử dụng x-api-key header thay vì Bearer token để xác thực.

**Current value**: `"446655440003"`

## 3. Các loại thông báo

| Code    | Mô tả               |
| ------- | ------------------- |
| NORMAL  | Thông thường        |
| MKN_5H  | Mất kết nối 5 giờ   |
| MKN_6H  | Mất kết nối 6 giờ   |
| MKN_8D  | Mất kết nối 8 ngày  |
| MKN_10D | Mất kết nối 10 ngày |

## 4. Mô tả Data Type

| Trường                | Kiểu dữ liệu        | Bắt buộc | Mô tả                                                                                     |
| --------------------- | ------------------- | -------- | ----------------------------------------------------------------------------------------- |
| clientReq             | string (UUID)       | Có       | Mã định danh do client sinh (UUID)                                                        |
| requestId             | string (UUID)       | Trả về   | Mã định danh do server sinh                                                               |
| ship_code             | string              | Có       | Mã tàu                                                                                    |
| occurred_at           | datetime (ISO-8601) | Có       | Thời điểm xảy ra sự kiện                                                                  |
| content               | string (≤500)       | Có       | Nội dung thông báo                                                                        |
| owner_name            | string              | Có       | Tên chủ tàu                                                                               |
| owner_phone           | string (E.164)      | Có       | Số điện thoại chủ tàu                                                                     |
| type                  | enum                | Có       | Loại thông báo: NORMAL, MKN_5H, MKN_6H, MKN_8D, MKN_10D                                   |
| boundary_crossed      | boolean             | Không    | Cờ vượt giới hạn                                                                          |
| boundary_near_warning | boolean             | Không    | Cờ cảnh báo gần giới hạn                                                                  |
| boundary_status_code  | string (≤50)        | Không    | Code ra lệnh cho phép vượt ranh giới (PERMISSION_000: là không cho, PERMISSION_001 là có) |
| status                | enum                | Server   | Trạng thái: QUEUED, SENDING, SENT, DELIVERED, FAILED                                      |
| created_at            | datetime (ISO-8601) | Server   | Thời gian server ghi nhận                                                                 |

## 5. Endpoints

### 5.1 Gửi thông báo

**POST** `/send`

**Headers:**

- `x-api-key: <api-key>`
- `Content-Type: application/json`

**Request body:**

```json
{
  "clientReq": "550e8400-e29b-41d4-a716-446655440002",
  "ship_code": "VN-12345",
  "occurred_at": "2025-08-31T05:30:00Z",
  "content": "Tàu VN-12345 mất kết nối 5 giờ. Vui lòng kiểm tra.",
  "owner_name": "Nguyễn Văn A",
  "owner_phone": "+84901234567",
  "type": "MKN_5H",
  "boundary_crossed": false,
  "boundary_near_warning": true,
  "boundary_status_code": "PERMISSION_001"
}
```

**Response 200 OK:**

```json
{
  "requestId": "7b3c9d22-a1b2-4c3d-8e9f-0a1b2c3d4e5f",
  "clientReq": "550e8400-e29b-41d4-a716-446655440002",
  "status": "QUEUED"
}
```

### 5.2 Kiểm tra trạng thái

**GET** `/status`

**Query params** (một trong hai):

- `clientReq=<mã client sinh>`
- `requestId=<mã server sinh>`

**Headers:**

- `x-api-key: <api-key>`

**Response 200 OK:**

```json
{
  "requestId": "7b3c9d22-a1b2-4c3d-8e9f-0a1b2c3d4e5f",
  "clientReq": "550e8400-e29b-41d4-a716-446655440002",
  "status": "SENT"
}
```

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
  "message": "x-api-key header is required",
  "error": "Unauthorized"
}
```

### 6.3 Invalid API Key (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Invalid x-api-key",
  "error": "Unauthorized"
}
```

### 6.4 Not Found (404 Not Found)

```json
{
  "statusCode": 404,
  "message": "Ship notification not found",
  "error": "Not Found"
}
```

### 6.5 Internal Server Error (500 Internal Server Error)

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## 7. Ví dụ sử dụng

### 7.1 Gửi thông báo mất kết nối 5 giờ

**cURL:**

```bash
curl -X POST "http://hub.quanlythuysan.vn/api/v1/ship-notifications/send" \
  -H "x-api-key: your-secret-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "clientReq": "550e8400-e29b-41d4-a716-446655440002",
    "ship_code": "VN-12345",
    "occurred_at": "2025-08-31T05:30:00Z",
    "content": "Tàu VN-12345 mất kết nối 5 giờ. Vui lòng kiểm tra.",
    "owner_name": "Nguyễn Văn A",
    "owner_phone": "+84901234567",
    "type": "MKN_5H",
    "boundary_crossed": false,
    "boundary_near_warning": true,
    "boundary_status_code": "PERMISSION_001"
  }'
```

### 7.2 Kiểm tra trạng thái bằng clientReq

**cURL:**

```bash
curl -X GET "http://hub.quanlythuysan.vn/api/v1/ship-notifications/status?clientReq=550e8400-e29b-41d4-a716-446655440002" \
  -H "x-api-key: your-secret-api-key-here"
```

### 7.3 Kiểm tra trạng thái bằng requestId

**cURL:**

```bash
curl -X GET "http://hub.quanlythuysan.vn/api/v1/ship-notifications/status?requestId=7b3c9d22-a1b2-4c3d-8e9f-0a1b2c3d4e5f" \
  -H "x-api-key: your-secret-api-key-here"
```

## 8. Lưu ý quan trọng

1. **API Key**: Tất cả requests phải có header `x-api-key` hợp lệ
2. **UUID Format**: `clientReq` và `requestId` phải là UUID hợp lệ
3. **Thời gian**: `occurred_at` phải theo định dạng ISO-8601
4. **Nội dung**: `content` không được vượt quá 500 ký tự
5. **Số điện thoại**: `owner_phone` phải theo định dạng E.164 (ví dụ: +84901234567)
6. **Logging**: Tất cả requests và responses đều được log để tracking

## 9. Trạng thái xử lý

| Status    | Mô tả                 |
| --------- | --------------------- |
| QUEUED    | Đã xếp hàng chờ xử lý |
| SENDING   | Đang gửi thông báo    |
| SENT      | Đã gửi thành công     |
| DELIVERED | Đã nhận được xác nhận |
| FAILED    | Gửi thất bại          |

## 10. Rate Limiting

- **Giới hạn**: 100 requests/phút
- **Thời gian chờ**: 60 giây nếu vượt quá giới hạn

## 11. Support

Nếu gặp vấn đề, vui lòng liên hệ:

- **Email**: support@quanlythuysan.vn
- **Hotline**: +84 901 234 567
- **Documentation**: http://docs.quanlythuysan.vn

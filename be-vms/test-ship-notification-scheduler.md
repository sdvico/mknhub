# Test Ship Notification Scheduler

## Tổng quan

Ship Notification Scheduler là một hệ thống queue chạy mỗi 30 giây để xử lý các ship notifications đang pending. Hệ thống sẽ:

1. Lấy tất cả ship notifications có status = QUEUED
2. Tìm user theo số điện thoại (hỗ trợ cả định dạng 0xxx và +84xxx)
3. Tìm push tokens của user
4. Gửi push notification và tạo notification record
5. Cập nhật status của ship notification

## API Endpoints

### 1. Trigger Scheduler Manually

**Endpoint:** `POST /ship-notification-scheduler/trigger`

**Description:** Kích hoạt scheduler xử lý ship notifications ngay lập tức

```bash
curl -X POST http://localhost:3000/ship-notification-scheduler/trigger
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Ship notification scheduler triggered successfully"
}
```

### 2. Get Scheduler Status

**Endpoint:** `GET /ship-notification-scheduler/status`

**Description:** Lấy trạng thái hiện tại của scheduler

```bash
curl -X GET http://localhost:3000/ship-notification-scheduler/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**

```json
{
  "isRunning": false,
  "lastRun": null
}
```

### 3. Process Single Ship Notification

**Endpoint:** `POST /ship-notification-scheduler/process/:notificationId`

**Description:** Xử lý một ship notification cụ thể theo ID

```bash
curl -X POST http://localhost:3000/ship-notification-scheduler/process/notification-uuid-here \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Notification sent successfully",
  "userFound": true,
  "notificationSent": true
}
```

## Test Flow Hoàn Chỉnh

### Bước 1: Tạo Ship Notification

```bash
curl -X POST http://localhost:3000/ship-notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "clientReq": "550e8400-e29b-41d4-a716-446655440001",
    "ship_code": "VN-12345",
    "occurred_at": "2025-01-09T10:00:00Z",
    "content": "Tàu VN-12345 mất kết nối 5 giờ. Vui lòng kiểm tra.",
    "owner_name": "Nguyễn Văn A",
    "owner_phone": "+84901234567",
    "type": "MKN_5H"
  }'
```

**Expected Response:**

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440002",
  "clientReq": "550e8400-e29b-41d4-a716-446655440001",
  "status": "QUEUED"
}
```

### Bước 2: Kiểm tra Status

```bash
curl -X GET http://localhost:3000/ship-notifications/status \
  -H "Content-Type: application/json" \
  -d '{
    "clientReq": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

**Expected Response:**

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440002",
  "clientReq": "550e8400-e29b-41d4-a716-446655440001",
  "status": "QUEUED"
}
```

### Bước 3: Trigger Scheduler

```bash
curl -X POST http://localhost:3000/ship-notification-scheduler/trigger
```

### Bước 4: Kiểm tra Status lại

```bash
curl -X GET http://localhost:3000/ship-notifications/status \
  -H "Content-Type: application/json" \
  -d '{
    "clientReq": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

**Expected Response:**

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440002",
  "clientReq": "550e8400-e29b-41d4-a716-446655440001",
  "status": "SENT"
}
```

## Lưu ý

### 1. **Cron Job**

- Scheduler chạy tự động mỗi 30 giây
- Cron expression: `*/30 * * * * *`

### 2. **Status Flow**

- `QUEUED` → `SENDING` → `SENT` (thành công)
- `QUEUED` → `SENDING` → `FAILED` (thất bại)

### 3. **User Lookup**

- Hỗ trợ tìm user theo số điện thoại với các định dạng:
  - `0123456789` (định dạng Việt Nam)
  - `+84123456789` (định dạng quốc tế)

### 4. **Notification Creation**

- Mỗi lần gửi sẽ tạo một notification record với:
  - `plateNumber` = `ship_code`
  - `type` = `ship_notification`
  - `stype` = `ship_alert`

### 5. **Push Notification**

- Gửi đến tất cả devices của user
- Bao gồm data: `ship_code`, `notification_type`, `occurred_at`, etc.

## Error Handling

### User Not Found

```json
{
  "success": false,
  "message": "User not found",
  "userFound": false,
  "notificationSent": false
}
```

### No Push Tokens

```json
{
  "success": false,
  "message": "Failed to send notification",
  "userFound": true,
  "notificationSent": false
}
```

### Notification Not Found

```json
{
  "success": false,
  "message": "Ship notification not found"
}
```

## Monitoring

### Logs

- Scheduler logs được ghi vào console với level INFO/ERROR
- Chi tiết xử lý từng notification được log

### Metrics

- Số lượng notifications đã xử lý
- Số lượng thành công/thất bại
- Thời gian xử lý

### Status Tracking

- `isRunning`: Trạng thái đang chạy
- `lastRun`: Thời gian chạy cuối (có thể mở rộng)

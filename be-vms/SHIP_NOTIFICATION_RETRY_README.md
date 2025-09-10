# Ship Notification Retry Mechanism

## Tổng quan

Đã thêm cơ chế retry cho ship notifications để xử lý các trường hợp gửi thất bại một cách tự động và thông minh.

## Các cột mới được thêm

### 1. `retry_number` (int, default: 0)
- Đếm số lần đã thử gửi notification
- Tăng lên 1 mỗi lần retry

### 2. `max_retry` (int, default: 3)
- Số lần retry tối đa cho phép
- Khi `retry_number >= max_retry`, notification sẽ được đánh dấu FAILED vĩnh viễn

### 3. `next_retry` (datetime, nullable)
- Thời điểm tiếp theo sẽ thử lại
- Sử dụng exponential backoff: 2, 4, 8 phút
- Null khi notification thành công hoặc đã vượt quá số lần retry

### 4. `reason` (enum, nullable)
- Lý do thất bại cụ thể:
  - `USER_NOT_FOUND`: Không tìm thấy user theo số điện thoại
  - `NO_DEVICE_FOUND`: User không có device nào đăng ký push token
  - `FIREBASE_ERROR`: Lỗi khi gửi push notification qua Firebase
  - `NETWORK_ERROR`: Lỗi mạng
  - `UNKNOWN_ERROR`: Lỗi không xác định

## Logic retry

### 1. Exponential Backoff
- Lần retry 1: 2 phút sau
- Lần retry 2: 4 phút sau  
- Lần retry 3: 8 phút sau

### 2. Điều kiện retry
- Status = FAILED
- `retry_number < max_retry`
- `next_retry <= now()`

### 3. Kết thúc retry
- Khi `retry_number >= max_retry`: Đánh dấu FAILED vĩnh viễn
- Khi gửi thành công: Reset `retry_number = 0`, `reason = null`, `next_retry = null`

## Cải thiện xử lý lỗi

### 1. Phân loại lỗi chi tiết
- **USER_NOT_FOUND**: Tìm user theo nhiều định dạng số điện thoại (0xxx, +84xxx)
- **NO_DEVICE_FOUND**: Kiểm tra push tokens trước khi gửi
- **FIREBASE_ERROR**: Bắt lỗi từ Firebase push notification
- **NETWORK_ERROR**: Lỗi kết nối mạng
- **UNKNOWN_ERROR**: Các lỗi khác không xác định

### 2. Logging chi tiết
- Log số lần retry hiện tại
- Log lý do thất bại cụ thể
- Log thời gian retry tiếp theo
- Log chi tiết lỗi Firebase

## API Endpoints mới

### 1. GET `/ship-notifications/stats`
- Thống kê tổng quan về ship notifications
- Trả về: total, queued, sending, sent, failed, pendingRetry

### 2. GET `/ship-notifications/pending`
- Lấy danh sách notifications đang chờ xử lý hoặc retry

### 3. GET `/ship-notifications/:id`
- Lấy chi tiết một notification theo ID

### 4. POST `/ship-notifications/:id/retry`
- Retry thủ công một notification đã thất bại
- Chỉ áp dụng cho notifications có status = FAILED và chưa vượt quá max_retry

## Migration

File migration: `src/database/migrations/1703123456795-AddRetryColumnsToShipNotifications.ts`

### Thực hiện migration:
```bash
npm run migration:run
```

### Rollback migration:
```bash
npm run migration:revert
```

## Indexes được tạo

1. `IDX_ShipNotifications_next_retry`: Tối ưu query theo thời gian retry
2. `IDX_ShipNotifications_retry_status`: Tối ưu query theo retry_number và status

## Cách sử dụng

### 1. Cron job xử lý retry
```typescript
// Chạy mỗi phút để xử lý notifications cần retry
@Cron('0 * * * * *')
async handleRetryNotifications() {
  const pendingNotifications = await this.shipNotificationTaskService.getPendingShipNotifications();
  
  for (const notification of pendingNotifications) {
    await this.shipNotificationTaskService.processShipNotification(notification);
  }
}
```

### 2. Monitoring
```typescript
// Lấy thống kê để monitor
const stats = await this.shipNotificationTaskService.getShipNotificationStats();
console.log(`Pending retry: ${stats.pendingRetry}`);
```

## Lưu ý

1. **Performance**: Sử dụng indexes để tối ưu query
2. **Memory**: Không lưu quá nhiều notifications trong memory
3. **Logging**: Log đầy đủ để debug và monitor
4. **Security**: Chỉ admin mới có quyền truy cập API endpoints
5. **Backup**: Backup dữ liệu trước khi chạy migration

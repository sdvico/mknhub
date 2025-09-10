# Backup System

Hệ thống backup cho phép người dùng tạo, xem, và xóa các backup dữ liệu.

## Cấu trúc

```
backup/
├── domain/
│   └── backup-log.ts          # Domain model
├── dto/
│   └── backup.dto.ts          # Data Transfer Objects
├── infrastructure/
│   └── persistence/
│       └── relational/
│           ├── entities/
│           │   └── backup-log.entity.ts
│           └── repositories/
│               └── backup.repository.ts
├── backup.controller.ts        # Controller
├── backup.service.ts          # Service
├── backup.module.ts           # Module
└── README.md                 # This file
```

## API Endpoints

### POST /backup

Tạo backup mới

**Request Body:**

```json
{
  "data": {
    // Dữ liệu cần backup
  },
  "description": "Mô tả backup (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Backup created successfully",
  "backupId": "uuid",
  "filename": "filename.json",
  "backupDate": "2024-01-01T00:00:00.000Z"
}
```

### GET /backup

Lấy danh sách backup của user

**Response:**

```json
{
  "success": true,
  "backups": [
    {
      "id": "uuid",
      "filename": "filename.json",
      "backupDate": "2024-01-01T00:00:00.000Z",
      "size": 1024,
      "createdBy": "user-id"
    }
  ]
}
```

### GET /backup/:id

Lấy chi tiết backup

**Response:**

```json
{
  "success": true,
  "backupData": {
    // Dữ liệu backup
  },
  "backupInfo": {
    "id": "uuid",
    "filename": "filename.json",
    "backupDate": "2024-01-01T00:00:00.000Z",
    "size": 1024,
    "createdBy": "user-id"
  }
}
```

### DELETE /backup/:id

Xóa backup

**Response:**

```json
{
  "success": true,
  "message": "Backup deleted successfully"
}
```

## Database Schema

Bảng `BackupLogs`:

- `id`: UUID (Primary Key)
- `filename`: Tên file backup
- `filepath`: Đường dẫn file backup
- `size`: Kích thước file (bytes)
- `created_at`: Thời gian tạo
- `create_by`: ID user tạo backup
- `update_at`: Thời gian cập nhật
- `update_by`: ID user cập nhật
- `state`: Trạng thái (1: active, 0: inactive)

## Tính năng

1. **Tạo backup**: Lưu dữ liệu vào file JSON và ghi log vào database
2. **Xem danh sách**: Lấy tất cả backup của user hiện tại
3. **Xem chi tiết**: Đọc và trả về dữ liệu backup
4. **Xóa backup**: Xóa file và đánh dấu inactive trong database
5. **Bảo mật**: Chỉ user tạo backup mới có thể xem/xóa
6. **Validation**: Kiểm tra dữ liệu đầu vào
7. **Error handling**: Xử lý lỗi chi tiết

## Cài đặt

1. Chạy migration để tạo bảng:

```bash
npm run migration:run
```

2. Import BackupModule vào AppModule:

```typescript
import { BackupModule } from './backup/backup.module';

@Module({
  imports: [
    // ... other modules
    BackupModule,
  ],
})
export class AppModule {}
```

3. Đảm bảo thư mục backup tồn tại:

```bash
mkdir backup
```

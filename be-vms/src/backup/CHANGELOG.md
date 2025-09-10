# Backup System Changelog

## Version 2.0.0 - NestJS Implementation

### Thay đổi chính

- Chuyển từ Express sang NestJS framework
- Sử dụng TypeORM thay vì in-memory storage
- Thêm validation với class-validator
- Cải thiện error handling
- Tách biệt rõ ràng giữa domain, infrastructure và application layers

### Cấu trúc mới

```
backup/
├── domain/
│   └── backup-log.ts          # Domain model
├── dto/
│   └── backup.dto.ts          # Validation DTOs
├── infrastructure/
│   └── persistence/
│       └── relational/
│           ├── entities/
│           │   └── backup-log.entity.ts
│           └── repositories/
│               └── backup.repository.ts
├── backup.controller.ts        # NestJS Controller
├── backup.service.ts          # NestJS Service
├── backup.module.ts           # NestJS Module
└── README.md                 # Documentation
```

### API Endpoints

- `POST /backup` - Tạo backup mới
- `GET /backup` - Lấy danh sách backup
- `GET /backup/:id` - Lấy chi tiết backup
- `DELETE /backup/:id` - Xóa backup

### Database Schema

Bảng `BackupLogs` với các trường:

- `id`: UUID (Primary Key)
- `filename`: Tên file backup
- `filepath`: Đường dẫn file backup
- `size`: Kích thước file (bytes)
- `created_at`: Thời gian tạo
- `create_by`: ID user tạo backup
- `update_at`: Thời gian cập nhật
- `update_by`: ID user cập nhật
- `state`: Trạng thái (1: active, 0: inactive)

### Tính năng mới

1. **Type Safety**: Sử dụng TypeScript strict mode
2. **Validation**: Class-validator cho input validation
3. **Error Handling**: HttpException với status codes phù hợp
4. **Repository Pattern**: Tách biệt data access layer
5. **Dependency Injection**: NestJS DI container
6. **Guards**: Authentication guard
7. **DTOs**: Data Transfer Objects cho API contracts

### Migration

Chạy migration để tạo bảng:

```bash
npm run migration:run
```

### Breaking Changes

- Thay đổi từ Express routes sang NestJS decorators
- Thay đổi response format
- Thay đổi database schema
- Thay đổi authentication method

## Version 1.0.0 - Express Implementation (Legacy)

### Cấu trúc cũ

```
Be/src/controllers/BackupController.ts
Be/src/entities/BackupLog.ts
```

### API Endpoints (Legacy)

- `POST /backup` - Tạo backup
- `GET /backup` - Lấy danh sách backup
- `GET /backup/:id` - Restore backup
- `DELETE /backup/:id` - Xóa backup

### Database Schema (Legacy)

Bảng `Soba_BackupLog` với các trường:

- `id`: UUID
- `filename`: Tên file
- `userid`: ID user
- `backupDate`: Thời gian tạo
- `description`: Mô tả
- `isActive`: Trạng thái active

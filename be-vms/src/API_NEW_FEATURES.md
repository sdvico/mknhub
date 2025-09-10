# API Documentation - New Features

## Overview

This document describes the new API endpoints for the following features:

1. Reports (Báo cáo vị trí thủ công)
2. Feedbacks (Phản ánh khó khăn)
3. Fishing Zones (Ngư trường)
4. Weather Reports (Thời tiết biển)

## 1. Reports API

### Endpoints

#### POST /reports

Tạo báo cáo vị trí mới

```json
{
  "lat": 10.123456,
  "lng": 106.123456,
  "reported_at": "2024-01-15T10:30:00Z",
  "status": "pending",
  "reporter_user_id": "uuid-here",
  "reporter_ship_id": "uuid-here"
}
```

#### GET /reports

Lấy danh sách báo cáo với phân trang

- Query params: `page`, `limit`, `status`, `reporter_user_id`, `reporter_ship_id`

#### GET /reports/location

Lấy báo cáo theo vị trí địa lý

- Query params: `lat`, `lng`, `radius`, `limit`

#### GET /reports/:id

Lấy chi tiết báo cáo

#### PATCH /reports/:id

Cập nhật báo cáo

#### PATCH /reports/:id/status

Cập nhật trạng thái báo cáo

```json
{
  "status": "approved"
}
```

#### DELETE /reports/:id

Xóa báo cáo (Admin only)

## 2. Feedbacks API

### Endpoints

#### POST /feedbacks

Tạo phản ánh mới

```json
{
  "content": "Nội dung phản ánh",
  "reporter_id": "uuid-here",
  "status": "new"
}
```

#### GET /feedbacks

Lấy danh sách phản ánh (Admin/Moderator only)

- Query params: `page`, `limit`, `status`, `reporter_id`

#### GET /feedbacks/stats

Lấy thống kê phản ánh (Admin/Moderator only)

#### GET /feedbacks/my-feedbacks

Lấy phản ánh của người dùng

- Query params: `reporter_id`

#### GET /feedbacks/:id

Lấy chi tiết phản ánh

#### PATCH /feedbacks/:id

Cập nhật phản ánh (Admin/Moderator only)

#### PATCH /feedbacks/:id/status

Cập nhật trạng thái phản ánh (Admin/Moderator only)

```json
{
  "status": "in_progress"
}
```

#### DELETE /feedbacks/:id

Xóa phản ánh (Admin only)

## 3. Fishing Zones API

### Endpoints

#### GET /fishing-zones

Lấy danh sách ngư trường

- Query params: `page`, `limit`, `enable`

#### GET /fishing-zones/active

Lấy danh sách ngư trường đang hoạt động

#### GET /fishing-zones/:id

Lấy chi tiết ngư trường

#### GET /fishing-zones/:id/view

Tăng lượt xem

#### GET /fishing-zones/:id/click

Tăng lượt click

#### POST /fishing-zones

Tạo ngư trường mới (Admin/Moderator only)

```json
{
  "title": "Tiêu đề ngư trường",
  "description": "Mô tả chi tiết",
  "link": "https://example.com",
  "enable": true,
  "published_at": "2024-01-15T10:30:00Z"
}
```

#### PATCH /fishing-zones/:id

Cập nhật ngư trường (Admin/Moderator only)

#### PATCH /fishing-zones/:id/toggle

Bật/tắt hiển thị (Admin/Moderator only)

#### DELETE /fishing-zones/:id

Xóa ngư trường (Admin only)

## 4. Weather Reports API

### Endpoints

#### GET /weather-reports

Lấy danh sách báo cáo thời tiết

- Query params: `page`, `limit`, `enable`, `region`

#### GET /weather-reports/active

Lấy danh sách báo cáo thời tiết đang hoạt động

#### GET /weather-reports/regions

Lấy danh sách các vùng biển

#### GET /weather-reports/region/:region

Lấy báo cáo thời tiết theo vùng

#### GET /weather-reports/:id

Lấy chi tiết báo cáo thời tiết

#### GET /weather-reports/:id/view

Tăng lượt xem

#### GET /weather-reports/:id/click

Tăng lượt click

#### POST /weather-reports

Tạo báo cáo thời tiết mới (Admin/Moderator only)

```json
{
  "region": "Bắc Bộ",
  "summary": "Nhiệt độ 25-30°C, gió đông bắc 15-20km/h",
  "advice": "Khuyến cáo ngư dân chú ý thời tiết",
  "link": "https://example.com",
  "enable": true,
  "published_at": "2024-01-15T10:30:00Z"
}
```

#### PATCH /weather-reports/:id

Cập nhật báo cáo thời tiết (Admin/Moderator only)

#### PATCH /weather-reports/:id/toggle

Bật/tắt hiển thị (Admin/Moderator only)

#### DELETE /weather-reports/:id

Xóa báo cáo thời tiết (Admin only)

## Authentication & Authorization

### Public Endpoints

- `GET /fishing-zones` (read-only)
- `GET /weather-reports` (read-only)
- `GET /fishing-zones/:id/view` (increment view)
- `GET /fishing-zones/:id/click` (increment click)
- `GET /weather-reports/:id/view` (increment view)
- `GET /weather-reports/:id/click` (increment click)

### Protected Endpoints

- Tất cả endpoints khác yêu cầu JWT authentication
- Admin endpoints: `DELETE` operations
- Admin/Moderator endpoints: `POST`, `PATCH` operations
- User endpoints: `GET` operations cho dữ liệu của họ

## Database Schema

### Reports Table

- `id`: UUID (Primary Key)
- `lat`: DECIMAL(10,6) - Vĩ độ
- `lng`: DECIMAL(10,6) - Kinh độ
- `reported_at`: DATETIME - Thời gian báo cáo
- `status`: ENUM('pending','approved','rejected') - Trạng thái
- `reporter_user_id`: UUID (FK) - Người báo cáo
- `reporter_ship_id`: UUID (FK) - Tàu báo cáo
- `created_at`: DATETIME - Ngày tạo
- `updated_at`: DATETIME - Ngày cập nhật

### Feedbacks Table

- `id`: UUID (Primary Key)
- `content`: TEXT - Nội dung phản ánh
- `reporter_id`: UUID (FK) - Người báo phản ánh
- `status`: ENUM('new','in_progress','resolved') - Trạng thái
- `created_at`: DATETIME - Ngày tạo
- `updated_at`: DATETIME - Ngày cập nhật

### FishingZones Table

- `id`: UUID (Primary Key)
- `title`: VARCHAR(255) - Tiêu đề
- `description`: TEXT - Mô tả
- `link`: VARCHAR(500) - Link chi tiết
- `total_views`: INT - Tổng lượt xem
- `total_clicks`: INT - Tổng lượt click
- `enable`: BOOLEAN - Bật/tắt hiển thị
- `published_at`: DATETIME - Ngày phát hành
- `created_at`: DATETIME - Ngày tạo
- `updated_at`: DATETIME - Ngày cập nhật

### WeatherReports Table

- `id`: UUID (Primary Key)
- `region`: VARCHAR(255) - Vùng biển
- `summary`: TEXT - Tóm tắt thời tiết
- `advice`: TEXT - Khuyến cáo
- `link`: VARCHAR(500) - Link chi tiết
- `total_views`: INT - Tổng lượt xem
- `total_clicks`: INT - Tổng lượt click
- `enable`: BOOLEAN - Bật/tắt hiển thị
- `published_at`: DATETIME - Ngày phát hành
- `created_at`: DATETIME - Ngày tạo
- `updated_at`: DATETIME - Ngày cập nhật

## Usage Examples

### Tạo báo cáo vị trí

```bash
curl -X POST http://localhost:3000/reports \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 10.123456,
    "lng": 106.123456,
    "reported_at": "2024-01-15T10:30:00Z",
    "reporter_user_id": "user-uuid-here"
  }'
```

### Lấy báo cáo theo vị trí

```bash
curl "http://localhost:3000/reports/location?lat=10.123456&lng=106.123456&radius=5&limit=10"
```

### Tạo phản ánh

```bash
curl -X POST http://localhost:3000/feedbacks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Gặp khó khăn khi đánh bắt",
    "reporter_id": "user-uuid-here"
  }'
```

### Lấy ngư trường đang hoạt động

```bash
curl "http://localhost:3000/fishing-zones/active"
```

### Lấy báo cáo thời tiết theo vùng

```bash
curl "http://localhost:3000/weather-reports/region/Bắc%20Bộ"
```

## Notes

1. **Validation**: Tất cả input đều được validate bằng class-validator
2. **Pagination**: Các endpoint list đều hỗ trợ phân trang với `page` và `limit`
3. **Relations**: Các entity có quan hệ với Users và Ships được load tự động
4. **Audit**: Tất cả bảng đều có `created_at` và `updated_at`
5. **Soft Delete**: Không sử dụng soft delete, dữ liệu sẽ bị xóa hoàn toàn
6. **Indexes**: Đã tạo indexes cho các trường thường query để tối ưu hiệu suất

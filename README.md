# MKN Hub - Hệ thống Quản lý Tàu Cá

Dự án mã nguồn mở được phát triển theo giấy phép [GNU GPL v3](./LICENSE).

## Tổng quan

MKN Hub là một hệ thống quản lý tàu cá toàn diện, bao gồm ứng dụng di động React Native, web admin ReactJS, backend NestJS và cơ sở dữ liệu Microsoft SQL Server. Hệ thống được thiết kế để hỗ trợ quản lý tàu cá, theo dõi vị trí, gửi thông báo và báo cáo.

## Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   React Admin   │    │   NestJS API    │
│   (Mobile App)  │◄──►│   (Web Admin)   │◄──►│   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │   MSSQL DB      │
                                               │   (Database)    │
                                               └─────────────────┘
```

## Các thành phần chính

### 1. Mobile App (React Native)

- Ứng dụng di động cho người dùng cuối
- Theo dõi vị trí tàu cá
- Nhận thông báo và cảnh báo
- Báo cáo vị trí thủ công
- Phản ánh khó khăn

### 2. Web Admin (ReactJS)

- Giao diện quản trị web
- Quản lý người dùng và tàu
- Theo dõi thống kê và báo cáo
- Quản lý thông báo và cài đặt hệ thống

### 3. Backend API (NestJS)

- RESTful API cho tất cả chức năng
- Xác thực và phân quyền
- Xử lý dữ liệu và business logic
- Tích hợp Firebase cho push notification

### 4. Database (Microsoft SQL Server)

- Lưu trữ dữ liệu người dùng, tàu, thông báo
- Quản lý phân quyền và nhóm người dùng
- Lưu trữ báo cáo và phản ánh

## Chức năng chính

### Quản lý người dùng

- Đăng ký, đăng nhập
- Phân quyền theo nhóm (Administrators, Managers, Users)
- Quản lý thông tin cá nhân

### Quản lý tàu cá

- Đăng ký và quản lý thông tin tàu
- Theo dõi vị trí real-time
- Quản lý thiết bị định vị

### Hệ thống thông báo

- Gửi thông báo push qua Firebase
- Quản lý loại thông báo
- Lịch trình gửi thông báo tự động

### Báo cáo và phản ánh

- Báo cáo vị trí thủ công
- Phản ánh khó khăn từ người dùng
- Thống kê và báo cáo tổng hợp

### Quản lý ngư trường

- Định nghĩa các khu vực đánh bắt
- Cảnh báo khi tàu ra khỏi vùng cho phép

### Báo cáo thời tiết

- Cập nhật thông tin thời tiết biển
- Cảnh báo thời tiết nguy hiểm

### Quản lý cơ quan

- Quản lý các cơ quan liên quan
- Phân quyền theo cơ quan

## Công nghệ sử dụng

### Frontend (Admin)

- **React 18** với TypeScript
- **Material-UI** cho giao diện
- **Refine** framework cho admin panel
- **React Router** cho routing
- **i18next** cho đa ngôn ngữ

### Backend

- **NestJS** framework
- **TypeORM** cho ORM
- **Microsoft SQL Server** database
- **JWT** cho authentication
- **Swagger** cho API documentation
- **Firebase Admin SDK** cho push notification

### Mobile

- **React Native** (dự kiến)
- **Expo** hoặc **React Native CLI**

## Cài đặt và chạy

### Backend (NestJS)

```bash
cd be-vms
npm install
npm run start:dev
```

API sẽ chạy tại: `http://localhost:3000`
Swagger docs: `http://localhost:3000/docs`

### Frontend Admin (React)

```bash
cd admin-Mknhub
npm install
npm run dev
```

Web admin sẽ chạy tại: `http://localhost:5173`

### Database

```bash
# Tạo database Microsoft SQL Server
sqlcmd -S localhost -U sa -P your_password
CREATE DATABASE mknhub;
GO

# Import schema (nếu có)
sqlcmd -S localhost -U sa -P your_password -d mknhub -i backup.sql
```

## API Endpoints chính

### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `GET /auth/test` - Test authentication

### Users

- `GET /users` - Danh sách người dùng
- `POST /users` - Tạo người dùng mới
- `GET /users/:id` - Chi tiết người dùng
- `PATCH /users/:id` - Cập nhật người dùng

### Ships

- `GET /ships` - Danh sách tàu
- `POST /ships` - Tạo tàu mới
- `GET /ships/:id` - Chi tiết tàu
- `PATCH /ships/:id` - Cập nhật tàu

### Notifications

- `GET /notifications` - Danh sách thông báo
- `POST /notifications` - Gửi thông báo
- `GET /notifications/:id` - Chi tiết thông báo

### Reports

- `GET /reports` - Danh sách báo cáo
- `POST /reports` - Tạo báo cáo mới
- `GET /reports/location` - Báo cáo theo vị trí

### Feedbacks

- `GET /feedbacks` - Danh sách phản ánh
- `POST /feedbacks` - Tạo phản ánh mới
- `GET /feedbacks/stats` - Thống kê phản ánh

## Phân quyền

Hệ thống sử dụng phân quyền dựa trên nhóm (Groups):

- **Administrators**: Toàn quyền hệ thống
- **Managers**: Quản lý người dùng và tàu
- **Users**: Sử dụng cơ bản

## Cấu hình

### Environment Variables

Tạo file `.env` trong thư mục `be-vms`:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=1433
DATABASE_USERNAME=sa
DATABASE_PASSWORD=your_password
DATABASE_NAME=mknhub

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# App
APP_PORT=3000
APP_API_PREFIX=api
```

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Giấy phép

Mã nguồn này được phát hành theo giấy phép **GNU General Public License v3.0 (GPLv3)**.  
Bạn có thể tự do sử dụng, phân phối và sửa đổi, miễn là mọi phần mềm phái sinh cũng phải phát hành theo GPLv3.

Xem chi tiết tại [LICENSE](./LICENSE).

## Nhà bảo trợ (Sponsor)

Dự án được bảo trợ bởi **SDVico** – đơn vị đồng hành trong việc phát triển và triển khai.  
Website: [https://sdvico.vn](https://sdvico.vn)

## Liên hệ

- Email: contact@sdvico.vn
- Issues: [GitHub Issues](./issues)

## Roadmap

- [ ] Hoàn thiện React Native app
- [ ] Tích hợp bản đồ real-time
- [ ] Thêm tính năng AI cho dự đoán thời tiết
- [ ] Tối ưu hóa performance
- [ ] Thêm unit tests và e2e tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

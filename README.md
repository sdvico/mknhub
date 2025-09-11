# MKN Hub - Hệ thống Cảnh báo và Thông báo Mất kết nối VMS

Dự án mã nguồn mở được phát triển theo giấy phép [GNU GPL v3](./LICENSE).

## Tổng quan

MKN Hub là một hệ thống cảnh báo và thông báo mất kết nối VMS (Vessel Monitoring System) toàn diện, bao gồm ứng dụng di động React Native, web admin ReactJS, backend NestJS và cơ sở dữ liệu Microsoft SQL Server. Hệ thống được thiết kế để giám sát kết nối VMS, phát hiện sự cố mất kết nối và gửi cảnh báo kịp thời đến các bên liên quan.

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
- Theo dõi trạng thái kết nối VMS
- Nhận cảnh báo mất kết nối VMS
- Báo cáo sự cố kết nối thủ công
- Phản ánh khó khăn về VMS

### 2. Web Admin (ReactJS)

- Giao diện quản trị web
- Quản lý người dùng và tàu
- Giám sát trạng thái kết nối VMS
- Quản lý cảnh báo và cài đặt hệ thống
- Dashboard theo dõi sự cố VMS

### 3. Backend API (NestJS)

- RESTful API cho tất cả chức năng
- Xác thực và phân quyền
- Giám sát kết nối VMS real-time
- Xử lý cảnh báo mất kết nối
- Tích hợp Firebase cho push notification

### 4. Database (Microsoft SQL Server)

- Lưu trữ dữ liệu người dùng, tàu, cảnh báo VMS
- Quản lý phân quyền và nhóm người dùng
- Lưu trữ lịch sử kết nối VMS và sự cố
- Lưu trữ báo cáo và phản ánh về VMS

## Chức năng chính

### Giám sát kết nối VMS

- Theo dõi trạng thái kết nối VMS real-time
- Phát hiện sự cố mất kết nối tự động
- Cảnh báo ngay lập tức khi có sự cố
- Lịch sử kết nối và thống kê

### Hệ thống cảnh báo

- Gửi cảnh báo push qua Firebase
- Cảnh báo qua SMS và email
- Quản lý loại cảnh báo VMS
- Lịch trình gửi cảnh báo tự động

### Quản lý người dùng

- Đăng ký, đăng nhập
- Phân quyền theo nhóm (Administrators, Managers, Users)
- Quản lý thông tin cá nhân

### Quản lý tàu và thiết bị VMS

- Đăng ký và quản lý thông tin tàu
- Quản lý thiết bị VMS trên tàu
- Theo dõi trạng thái thiết bị
- Cảnh báo khi thiết bị VMS gặp sự cố

### Báo cáo và phản ánh

- Báo cáo sự cố VMS thủ công
- Phản ánh khó khăn về VMS từ người dùng
- Thống kê và báo cáo sự cố VMS

### Quản lý cơ quan

- Quản lý các cơ quan liên quan
- Phân quyền theo cơ quan
- Cấu hình cảnh báo theo cơ quan

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

### VMS Monitoring

- `GET /vms/status` - Trạng thái kết nối VMS
- `POST /vms/heartbeat` - Cập nhật heartbeat VMS
- `GET /vms/alerts` - Danh sách cảnh báo VMS
- `POST /vms/alerts` - Tạo cảnh báo VMS

### Notifications

- `GET /notifications` - Danh sách thông báo
- `POST /notifications` - Gửi thông báo
- `GET /notifications/:id` - Chi tiết thông báo

### Reports

- `GET /reports` - Danh sách báo cáo sự cố VMS
- `POST /reports` - Tạo báo cáo sự cố mới
- `GET /reports/vms-issues` - Báo cáo sự cố VMS

### Feedbacks

- `GET /feedbacks` - Danh sách phản ánh về VMS
- `POST /feedbacks` - Tạo phản ánh mới
- `GET /feedbacks/stats` - Thống kê phản ánh VMS

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
- [ ] Tích hợp giám sát VMS real-time
- [ ] Thêm tính năng AI cho dự đoán sự cố VMS
- [ ] Tối ưu hóa performance
- [ ] Thêm unit tests và e2e tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Tích hợp với các hệ thống VMS hiện có
- [ ] Phát triển mobile app cho thuyền trưởng

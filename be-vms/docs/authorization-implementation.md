# Hệ thống Phân quyền (Authorization) - Implementation Guide

## Tổng quan

Tài liệu này mô tả chi tiết quá trình implement hệ thống phân quyền dựa trên Groups và GroupUsers trong ứng dụng NestJS. Hệ thống sử dụng Guards và Decorators để quản lý quyền truy cập API theo roles.

## Kiến trúc Hệ thống

### 1. Cấu trúc Database

```
Users (id, username, password, ...)
  ↓
GroupUsers (id, userid, groupid) ← Junction Table
  ↓
Groups (id, name)
```

### 2. Luồng Xác thực và Phân quyền

```
Request → AuthGuard → RolesGuard → Controller Method
   ↓           ↓           ↓
@Public()   Xác thực    Kiểm tra
   ↓           ↓           ↓
Bypass      Token      Role-based
All         Valid      Access
```

## Các Thành phần Đã Implement

### 1. Entities & Domain Models

#### GroupEntity

```typescript
@Entity('Groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;
}
```

#### GroupUserEntity

```typescript
@Entity('GroupUsers')
export class GroupUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userid!: string;

  @Column()
  groupid!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user!: UserEntity;

  @ManyToOne(() => GroupEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupid' })
  group!: GroupEntity;
}
```

### 2. Repositories & Services

#### GroupUserRepository

```typescript
@Injectable()
export class GroupUserRepository {
  async findUserGroups(userId: string): Promise<GroupUser[]> {
    const entities = await this.groupUserRepository.find({
      where: { userid: userId },
      relations: ['group'],
    });
    return entities.map((entity) => this.groupUserMapper.toDomain(entity));
  }

  async create(data: Omit<GroupUser, 'id'>): Promise<GroupUser> {
    const entity = this.groupUserMapper.toEntity(data as GroupUser);
    const savedEntity = await this.groupUserRepository.save(entity);
    return this.groupUserMapper.toDomain(savedEntity);
  }
}
```

#### GroupsService

```typescript
@Injectable()
export class GroupsService {
  async getUserGroups(userId: string): Promise<Group[]> {
    const groupUsers = await this.groupUserRepository.findUserGroups(userId);
    const groupIds = groupUsers.map((gu) => gu.groupid);

    if (groupIds.length === 0) {
      return [];
    }

    const groups: Group[] = [];
    for (const groupId of groupIds) {
      const group = await this.findById(groupId);
      if (group) {
        groups.push(group);
      }
    }

    return groups;
  }
}
```

### 3. Decorators

#### @Public Decorator

```typescript
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Mục đích**: Bypass cả xác thực và phân quyền
**Sử dụng**: Cho các API endpoint công khai

#### @Roles Decorator

```typescript
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

**Mục đích**: Kiểm tra quyền truy cập theo group
**Sử dụng**: Cho các API endpoint cần role cụ thể

### 4. Guards

#### AuthGuard

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Kiểm tra @Public decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Bypass tất cả
    }

    // 2. Xác thực token
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    // 3. Kiểm tra session
    const session = await this.sessionService.findByToken(token);
    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    // 4. Kiểm tra token expired
    if (session.expired_date < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    // 5. Thêm user vào request
    request.user = session.user;
    request.session = session;

    return true;
  }
}
```

#### RolesGuard

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private groupsService: GroupsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Lấy required roles từ decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Không có role requirement
    }

    // 2. Lấy user từ request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // 3. Lấy groups của user
    const userGroups = await this.groupsService.getUserGroups(user.id);

    // 4. Kiểm tra quyền
    const hasRole = userGroups.some((group) =>
      requiredRoles.includes(group.name),
    );

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

### 5. Module Configuration

#### AuthModule

```typescript
@Module({
  imports: [SessionModule, UsersModule, GroupsModule],
  controllers: [AuthController, ExampleController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Chạy trước
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Chạy sau
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
```

#### GroupsModule

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, GroupUserEntity])],
  providers: [
    GroupsService,
    GroupRepository,
    GroupUserRepository,
    GroupMapper,
    GroupUserMapper,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
```

## Cách Sử dụng

### 1. API Public (Không cần xác thực)

```typescript
@Get('public-info')
@Public()
getPublicInfo() {
  return { message: 'Public data' };
}
```

**Kết quả**: Bypass cả AuthGuard và RolesGuard

### 2. API với Role Cụ thể

```typescript
@Get('admin-stats')
@Roles('admin')
getAdminStats() {
  return { message: 'Admin only data' };
}

@Get('manager-or-admin')
@Roles('admin', 'manager')
getManagerOrAdminData() {
  return { message: 'Manager or Admin data' };
}
```

**Kết quả**: Cần xác thực + có role tương ứng

### 3. API Mặc định (Chỉ cần xác thực)

```typescript
@Post('create')
async createTopUp(@Body() body: CreateTopUpDto) {
  // Không có @Public() hoặc @Roles()
  // → Chỉ cần xác thực
}
```

**Kết quả**: Chỉ cần token hợp lệ

## Thứ tự Thực thi Guards

```
Request → AuthGuard → RolesGuard → Controller Method
   ↓           ↓           ↓
1. Kiểm tra   2. Kiểm tra   3. Thực thi
   @Public     @Roles       method
   ↓           ↓
   Bypass      Kiểm tra
   All         quyền
   ↓           ↓
   Return      Return
   true        true/false
```

### Chi tiết từng bước:

1. **AuthGuard**:
   - Kiểm tra `@Public()` → Nếu có → return true
   - Kiểm tra token → Xác thực → Thêm user vào request
   - Nếu fail → throw UnauthorizedException

2. **RolesGuard**:
   - Kiểm tra `@Roles()` → Nếu không có → return true
   - Lấy user groups → Kiểm tra quyền
   - Nếu fail → throw ForbiddenException

3. **Controller Method**:
   - Chỉ thực thi khi cả 2 guards đều pass

## Database Setup

### 1. Tạo bảng GroupUsers

```sql
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupUsers')
BEGIN
    CREATE TABLE GroupUsers (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        userid UNIQUEIDENTIFIER NOT NULL,
        groupid UNIQUEIDENTIFIER NOT NULL,
        CONSTRAINT FK_GroupUsers_Users FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE,
        CONSTRAINT FK_GroupUsers_Groups FOREIGN KEY (groupid) REFERENCES Groups(id) ON DELETE CASCADE
    );
END
```

### 2. Tạo Groups mẫu

```sql
INSERT INTO Groups (id, name) VALUES (NEWID(), 'admin');
INSERT INTO Groups (id, name) VALUES (NEWID(), 'manager');
INSERT INTO Groups (id, name) VALUES (NEWID(), 'user');
```

### 3. Gán User vào Group

```sql
INSERT INTO GroupUsers (id, userid, groupid)
VALUES (NEWID(), 'user-uuid', 'admin-group-uuid');
```

## Testing

### 1. Test API Public

```bash
curl http://localhost:3000/topup/public-info
# Expected: 200 OK
```

### 2. Test API với Role

```bash
# Không có token
curl http://localhost:3000/topup/admin-stats
# Expected: 401 Unauthorized

# Có token nhưng không có role
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/topup/admin-stats
# Expected: 403 Forbidden

# Có token + có role
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:3000/topup/admin-stats
# Expected: 200 OK
```

## Troubleshooting

### Lỗi thường gặp:

1. **"SessionService not found"**
   - Kiểm tra SessionModule đã được import
   - Kiểm tra SessionService đã được export

2. **"GroupsService not found"**
   - Kiểm tra GroupsModule đã được import trong app.module.ts
   - Kiểm tra GroupsService đã được export

3. **"Role check failed"**
   - Kiểm tra bảng GroupUsers đã được tạo
   - Kiểm tra user đã được gán vào group
   - Kiểm tra tên group trong @Roles() khớp với database

### Debug Steps:

1. Kiểm tra database connection
2. Kiểm tra các bảng Groups, GroupUsers
3. Kiểm tra user có được gán vào group không
4. Xem logs để tìm lỗi cụ thể
5. Test từng guard riêng biệt

## Kết luận

Hệ thống phân quyền đã được implement hoàn chỉnh với:

✅ **Flexible Access Control**: Có thể mix giữa public, role-based và authenticated APIs
✅ **Clean Architecture**: Tách biệt rõ ràng giữa xác thực và phân quyền  
✅ **Easy to Use**: Chỉ cần thêm decorator @Public() hoặc @Roles()
✅ **Scalable**: Dễ dàng thêm roles và permissions mới
✅ **Secure**: Sử dụng guards để bảo vệ API endpoints

Hệ thống này cho phép developers dễ dàng quản lý quyền truy cập cho từng API endpoint một cách linh hoạt và bảo mật.

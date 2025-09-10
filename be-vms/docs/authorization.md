# Hệ thống Phân quyền (Authorization)

## Tổng quan

Hệ thống phân quyền được xây dựng dựa trên Groups và GroupUsers để quản lý quyền truy cập API theo roles.

## Cấu trúc Database

### Bảng Groups

- `id`: UUID (Primary Key)
- `name`: Tên group (ví dụ: admin, manager, user)

### Bảng GroupUsers

- `id`: UUID (Primary Key)
- `userid`: UUID (Foreign Key -> Users.id)
- `groupid`: UUID (Foreign Key -> Groups.id)

## Cách sử dụng

### 1. Decorator @Public()

Sử dụng để đánh dấu API endpoint không cần xác thực:

```typescript
@Get('public')
@Public()
getPublicData() {
  return { message: 'Public data' };
}
```

### 2. Decorator @Roles()

Sử dụng để kiểm tra quyền truy cập theo group:

```typescript
@Get('admin-only')
@Roles('admin')
getAdminData() {
  return { message: 'Admin only data' };
}

@Get('manager-or-admin')
@Roles('admin', 'manager')
getManagerOrAdminData() {
  return { message: 'Manager or Admin data' };
}
```

### 3. Kiểm tra quyền trong code

```typescript
@Injectable()
export class SomeService {
  constructor(private groupsService: GroupsService) {}

  async checkUserPermission(
    userId: string,
    requiredRole: string,
  ): Promise<boolean> {
    const userGroups = await this.groupsService.getUserGroups(userId);
    return userGroups.some((group) => group.name === requiredRole);
  }
}
```

## Luồng hoạt động

1. **AuthGuard**: Kiểm tra token và xác thực user
2. **RolesGuard**: Kiểm tra quyền truy cập dựa trên group của user
3. Nếu user không có quyền, trả về lỗi 403 Forbidden

## Thiết lập Groups

### Tạo Groups mới

```sql
INSERT INTO Groups (id, name) VALUES (NEWID(), 'new-role');
```

### Gán User vào Group

```sql
INSERT INTO GroupUsers (id, userid, groupid)
VALUES (NEWID(), 'user-uuid', 'group-uuid');
```

### Xóa User khỏi Group

```sql
DELETE FROM GroupUsers
WHERE userid = 'user-uuid' AND groupid = 'group-uuid';
```

## Ví dụ sử dụng

### Controller với nhiều roles

```typescript
@Controller('products')
export class ProductsController {
  @Get()
  @Public()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Post()
  @Roles('admin', 'manager')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @Roles('admin')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('admin')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
```

## Lưu ý

- Tất cả API endpoints mặc định sẽ yêu cầu xác thực
- Sử dụng `@Public()` để bypass xác thực
- Sử dụng `@Roles()` để kiểm tra quyền truy cập
- User có thể thuộc nhiều groups
- Hệ thống sẽ kiểm tra tất cả groups của user để xác định quyền truy cập

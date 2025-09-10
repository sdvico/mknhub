# Hướng dẫn Sử dụng CommonQueryDto và Utilities Chung

## Tổng quan

Hệ thống đã được tạo ra để xử lý chung cho pagination, sorting, filtering và search trong tất cả các controllers. Điều này giúp:

- ✅ **Tái sử dụng code** - Không cần viết lại logic pagination
- ✅ **Consistent API** - Tất cả endpoints có cùng format query params
- ✅ **Easy maintenance** - Chỉ cần sửa ở một nơi
- ✅ **Type safety** - Sử dụng TypeScript với validation

## Các Thành phần Chính

### 1. CommonQueryDto

```typescript
export class CommonQueryDto {
  page?: number = 1; // Số trang
  limit?: number = 10; // Số items per page (max: 100)
  sortBy?: string = 'createdAt'; // Trường để sort
  sortOrder?: SortOrder = SortOrder.DESC; // Thứ tự sort
  q?: string; // Search query text
  keySearch?: string; // Search theo column cụ thể
  status?: string; // Filter theo status
  dateFrom?: string; // Filter từ ngày
  dateTo?: string; // Filter đến ngày
}
```

### 2. ApiQuery Decorators

```typescript
@ApiQueryCommon()     // Tất cả query params
@ApiQueryPagination() // Chỉ pagination
@ApiQuerySorting()    // Chỉ sorting
@ApiQuerySearch()     // Chỉ search
@ApiQueryFilter()     // Chỉ filter
```

### 3. Helper Functions

```typescript
createPaginationMeta(page, limit, total); // Tạo pagination meta
createPaginatedResponse(data, pagination); // Tạo response format
normalizeQueryParams(query); // Normalize query params
```

## Cách Sử dụng trong Controller

### 1. Import cần thiết

```typescript
import {
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
} from '../../utils';
import { ApiQueryCommon } from '../../utils';
```

### 2. Sử dụng trong GET endpoint

```typescript
@Get()
@ApiQueryCommon()
async getItems(@Query() query: CommonQueryDto) {
  // Normalize query params
  const options = {
    page: query.page || 1,
    limit: query.limit || 10,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'DESC',
    q: query.q,
    keySearch: query.keySearch,
    status: query.status,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  };

  // Gọi service
  const [items, total] = await this.service.findWithPagination(options);

  // Tạo pagination meta
  const pagination = createPaginationMeta(
    options.page,
    options.limit,
    total,
  );

  // Return response
  return createPaginatedResponse(items, pagination, 'Items retrieved successfully');
}
```

## Ví dụ Cụ thể

### PaymentsController

```typescript
@Get()
@ApiQueryCommon()
async getTopUps(@Query() query: CommonQueryDto) {
  const [topUps, total] = await this.paymentsService.findTopUpsWithQuery(
    currentUser.username === 'admin' ? 'admin' : currentUser.id,
    query.page || 1,
    query.limit || 10,
    query.sortBy || 'createdAt',
    query.sortOrder || 'DESC',
    query.status,
  );

  const pagination = createPaginationMeta(
    query.page || 1,
    query.limit || 10,
    total,
  );

  return createPaginatedResponse(topUpsData, pagination);
}
```

### UsersController

```typescript
@Get()
@ApiQueryCommon()
@Roles('admin', 'manager')
async getUsers(@Query() query: CommonQueryDto) {
  const options = {
    page: query.page || 1,
    limit: query.limit || 10,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'DESC',
    q: query.q,
    keySearch: query.keySearch,
    status: query.status,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  };

  const [users, total] = await this.usersService.findUsersWithPagination(options);
  const pagination = createPaginationMeta(options.page, options.limit, total);

  return createPaginatedResponse(usersData, pagination, 'Users retrieved successfully');
}
```

## Query Parameters Examples

### 1. Pagination cơ bản

```bash
GET /api/users?page=1&limit=20
```

### 2. Sorting

```bash
GET /api/users?sortBy=username&sortOrder=ASC
GET /api/users?sortBy=createdAt&sortOrder=DESC
```

### 3. Search

```bash
GET /api/users?q=john                    # Search tất cả columns
GET /api/users?q=john&keySearch=username # Search theo column cụ thể
```

### 4. Filter

```bash
GET /api/users?status=active
GET /api/users?dateFrom=2024-01-01&dateTo=2024-12-31
```

### 5. Kết hợp tất cả

```bash
GET /api/users?page=2&limit=15&sortBy=username&sortOrder=ASC&q=john&status=active
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Items retrieved successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## Validation Rules

### Pagination

- `page`: >= 1, default: 1
- `limit`: 1-100, default: 10

### Sorting

- `sortBy`: string, default: 'createdAt'
- `sortOrder`: 'ASC' | 'DESC', default: 'DESC'
- `sortOrder` sẽ tự động transform thành uppercase

### Search

- `q`: string, optional
- `keySearch`: string, optional (phải là column hợp lệ)

### Filter

- `status`: string, optional
- `dateFrom`: ISO string, optional
- `dateTo`: ISO string, optional

## Lợi ích

### 1. **Consistency**

- Tất cả APIs có cùng format query params
- Response format thống nhất
- Error handling giống nhau

### 2. **Maintainability**

- Chỉ cần sửa logic ở một nơi
- Dễ dàng thêm features mới
- Code DRY (Don't Repeat Yourself)

### 3. **Developer Experience**

- IntelliSense support với TypeScript
- Validation tự động
- Swagger documentation tự động

### 4. **Performance**

- Query optimization
- Pagination hiệu quả
- Search indexing support

## Migration Guide

### Từ cách cũ sang mới:

#### Trước (Old way)

```typescript
@Get()
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'sortBy', required: false, type: String })
@ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
async getItems(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('sortBy') sortBy = 'createdAt',
  @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
) {
  // Manual validation and processing
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const sortOrderUpper = sortOrder.toUpperCase();

  // ... rest of the logic
}
```

#### Sau (New way)

```typescript
@Get()
@ApiQueryCommon()
async getItems(@Query() query: CommonQueryDto) {
  const options = {
    page: query.page || 1,
    limit: query.limit || 10,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'DESC',
    q: query.q,
    keySearch: query.keySearch,
    status: query.status,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  };

  const [items, total] = await this.service.findWithPagination(options);
  const pagination = createPaginationMeta(options.page, options.limit, total);

  return createPaginatedResponse(items, pagination);
}
```

## Kết luận

Hệ thống CommonQueryDto và utilities chung đã được thiết kế để:

✅ **Đơn giản hóa** việc implement pagination, sorting, filtering và search  
✅ **Tăng tính nhất quán** giữa các APIs  
✅ **Giảm thiểu code duplication**  
✅ **Cải thiện developer experience** với TypeScript và validation  
✅ **Dễ dàng maintain và extend** trong tương lai

Bạn có thể áp dụng pattern này cho tất cả các controllers cần pagination và search functionality!


import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { RequiresApiKey } from '../decorators/api-key.decorator';
import { ApiKeyOnly } from '../decorators/api-key-only.decorator';
import { Roles } from '../decorators/roles.decorator';

@Controller('examples')
export class AuthUsageExamplesController {
  // API công khai - không cần authentication
  @Public()
  @Get('public')
  getPublicData() {
    return { message: 'This is public data', timestamp: new Date() };
  }

  // API chỉ cần x-api-key - thích hợp cho webhook, callback
  @RequiresApiKey()
  @ApiKeyOnly()
  @Post('webhook')
  receiveWebhook(@Body() data: any) {
    return {
      status: 'webhook received',
      data: data,
      timestamp: new Date(),
    };
  }

  // API cần cả x-api-key và auth token
  @RequiresApiKey()
  @Post('secure')
  secureEndpoint(@Body() data: any, @Request() req) {
    return {
      message: 'Secure endpoint accessed',
      user: req.user,
      data: data,
      timestamp: new Date(),
    };
  }

  // API cần x-api-key, auth token và quyền từ group cụ thể
  @RequiresApiKey()
  @Roles('Administrators', 'Managers')
  @Get('admin-only')
  adminOnlyEndpoint(@Request() req) {
    return {
      message: 'Admin only endpoint',
      user: req.user,
      userGroups: req.user.groups,
      timestamp: new Date(),
    };
  }

  // API cần x-api-key, auth token và quyền từ group Ship Owners
  @RequiresApiKey()
  @Roles('Ship Owners')
  @Get('ship-owner-data')
  shipOwnerData(@Request() req) {
    return {
      message: 'Ship owner data',
      user: req.user,
      ships: [], // Lấy danh sách tàu của owner
      timestamp: new Date(),
    };
  }

  // API cần x-api-key, auth token và quyền từ group Ship Captains
  @RequiresApiKey()
  @Roles('Ship Captains')
  @Get('captain-data')
  captainData(@Request() req) {
    return {
      message: 'Captain data',
      user: req.user,
      assignedShips: [], // Lấy danh sách tàu được giao
      timestamp: new Date(),
    };
  }

  // API cần x-api-key, auth token và quyền từ nhiều group
  @RequiresApiKey()
  @Roles('Ship Owners', 'Ship Captains', 'Crew Members')
  @Get('ship-related')
  shipRelatedData(@Request() req) {
    return {
      message: 'Ship related data',
      user: req.user,
      shipInfo: {}, // Thông tin tàu liên quan
      timestamp: new Date(),
    };
  }
}

/*
CÁCH SỬ DỤNG:

1. API công khai:
   GET /examples/public
   Headers: Không cần

2. API chỉ cần x-api-key:
   POST /examples/webhook
   Headers: 
     x-api-key: your-secret-api-key

3. API cần cả x-api-key và auth token:
   POST /examples/secure
   Headers:
     x-api-key: your-secret-api-key
     Authorization: Bearer your-jwt-token

4. API cần phân quyền:
   GET /examples/admin-only
   Headers:
     x-api-key: your-secret-api-key
     Authorization: Bearer your-jwt-token
   Yêu cầu: User phải trong group Administrators hoặc Managers

5. API cho Ship Owners:
   GET /examples/ship-owner-data
   Headers:
     x-api-key: your-secret-api-key
     Authorization: Bearer your-jwt-token
   Yêu cầu: User phải trong group Ship Owners

6. API cho Ship Captains:
   GET /examples/captain-data
   Headers:
     x-api-key: your-secret-api-key
     Authorization: Bearer your-jwt-token
   Yêu cầu: User phải trong group Ship Captains

7. API cho nhiều group:
   GET /examples/ship-related
   Headers:
     x-api-key: your-secret-api-key
     Authorization: Bearer your-jwt-token
   Yêu cầu: User phải trong một trong các group: Ship Owners, Ship Captains, Crew Members
*/

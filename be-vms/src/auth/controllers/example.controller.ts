import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';

@Controller('example')
export class ExampleController {
  @Get('public')
  @Public()
  getPublicData() {
    return { message: 'This is public data', timestamp: new Date() };
  }

  @Get('user')
  @Roles('user')
  getUserData() {
    return { message: 'User data', timestamp: new Date() };
  }

  @Get('admin')
  @Roles('admin')
  getAdminData() {
    return { message: 'Admin data', timestamp: new Date() };
  }

  @Get('manager')
  @Roles('manager')
  getManagerData() {
    return { message: 'Manager data', timestamp: new Date() };
  }

  @Get('multi-role')
  @Roles('admin', 'manager')
  getMultiRoleData() {
    return { message: 'Multi-role data', timestamp: new Date() };
  }
}

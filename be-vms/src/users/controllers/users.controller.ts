import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import {
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
} from '../../utils';
import { ApiQueryCommon } from '../../utils';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQueryCommon()
  @Roles('admin', 'manager')
  async getUsers(@Query() query: CommonQueryDto) {
    // Sử dụng helper function để normalize query params
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: (query.sortOrder || 'DESC') as 'ASC' | 'DESC',
      q: query.q,
      keySearch: query.keySearch,
      status: query.status,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    };

    // Gọi service với options đã normalize
    const [users, total] = await this.usersService.findUsersWithPagination(
      options.page,
      options.limit,
      options.sortBy,
      options.sortOrder,
    );

    // Tạo pagination meta
    const pagination = createPaginationMeta(options.page, options.limit, total);

    // Map data nếu cần
    const usersData = users.map((user) => ({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      phone: user.phone,
      state: user.state,
    }));

    return createPaginatedResponse(
      usersData,
      pagination,
      'Users retrieved successfully',
    );
  }

  @Get(':id')
  @Roles('admin', 'manager')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      return { error: 'User not found' };
    }
    return { success: true, data: user };
  }

  @Post()
  @Roles('admin')
  async createUser(@Body() createUserDto: any) {
    const user = await this.usersService.create(createUserDto);
    return { success: true, data: user };
  }

  @Put(':id')
  @Roles('admin')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      return { error: 'User not found' };
    }
    return { success: true, data: user };
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteById(id);
    return { success: true, message: 'User deleted successfully' };
  }

  @Post('toggle-account')
  @ApiOperation({ summary: 'Toggle user account status (enable/disable)' })
  @ApiResponse({
    status: 200,
    description: 'Account status toggled successfully',
  })
  async toggleAccount(@Req() req) {
    const userId = req.user.id;
    const result = await this.usersService.toggleAccountStatus(userId);
    return {
      success: true,
      message: result.enable ? 'Account enabled' : 'Account disabled',
      data: {
        enable: result.enable,
      },
    };
  }

  @Get('stats')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get users statistics' })
  @ApiResponse({ status: 200, description: 'Users statistics retrieved' })
  async getUserStatistics() {
    const stats = await this.usersService.getUserStatistics();
    return {
      success: true,
      message: 'Users statistics retrieved successfully',
      data: stats,
    };
  }
}

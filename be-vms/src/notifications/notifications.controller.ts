import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SendNotificationDto } from './dto/notification.dto';

import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { ApiQueryCommon } from '../utils';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto, @Request() req) {
    return this.notificationsService.sendNotification(dto, req.user);
  }

  @Get()
  @ApiQueryCommon()
  async getNotifications(
    @Request() req,
    @Query() query: CommonQueryDto,
    @Query('status') status?: number,
  ) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    };

    const result = await this.notificationsService.getNotifications(
      req.user.id,
      options.page,
      options.limit,
      status,
      options.sortBy,
      options.sortOrder,
    );

    // Nếu service trả về dạng paginated, sử dụng helper
    if (result && Array.isArray(result.data) && result.total !== undefined) {
      const pagination = createPaginationMeta(
        options.page,
        options.limit,
        result.total,
      );

      return createPaginatedResponse(
        result.data,
        pagination,
        'Notifications retrieved successfully',
      );
    }

    // Nếu service trả về dạng khác, tạo response chuẩn
    const [notifications, total] = Array.isArray(result)
      ? [result, result.length]
      : [result?.data || [], result?.total || 0];

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      notifications,
      pagination,
      'Notifications retrieved successfully',
    );
  }

  @Get('statistic')
  async getStatistic(@Request() req, @Query('status') status?: number) {
    return this.notificationsService.getStatistic(req.user.id, status);
  }

  @Get(':id')
  async getNotification(@Param('id') id: string) {
    return this.notificationsService.getNotification(id);
  }
}

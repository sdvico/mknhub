import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyOnly, AuthGuard, RequiresApiKey } from '../auth';
import {
  CreateNotificationTypeDto,
  UpdateNotificationTypeDto,
} from './dto/create-notification-type.dto';
import { NotificationTypeEntity } from './infrastructure/persistence/relational/entities/notification-type.entity';
import { NotificationTypeService } from './notification-type.service';

@ApiTags('Notification Types')
@Controller('notification-types')
@UseGuards(AuthGuard)
export class NotificationTypeController {
  constructor(
    private readonly notificationTypeService: NotificationTypeService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get list of notification types' })
  @ApiQuery({
    name: 'ship_code',
    required: false,
    description:
      'Ship code to count unread notifications. Use "all" to get counts for all ships',
  })
  @ApiResponse({
    status: 200,
    description: 'List of notification types',
    type: [NotificationTypeEntity],
  })
  async getList(@Query('ship_code') shipCode?: string) {
    const types = await this.notificationTypeService.findAll();
    if (shipCode && shipCode !== 'all') {
      // Query theo ship_code cụ thể
      const unreadCounts =
        await this.notificationTypeService.getUnreadCountsByType(shipCode);
      return types.map((type) => ({
        ...type,
        unread_count: unreadCounts[type.code] || 0,
      }));
    } else if (shipCode === 'all' || !shipCode) {
      // Query tất cả ships
      const unreadCounts =
        await this.notificationTypeService.getAllUnreadCountsByType();
      return types.map((type) => ({
        ...type,
        unread_count: unreadCounts[type.code] || 0,
      }));
    }
    return types;
  }

  @Get('user')
  @ApiOperation({ summary: 'Get notification types for authenticated user' })
  @ApiQuery({
    name: 'ship_code',
    required: false,
    description: 'Optional ship code to filter notifications',
  })
  @ApiResponse({
    status: 200,
    description: 'List of notification types with unread counts for user',
    type: [NotificationTypeEntity],
  })
  async getTypesForUser(@Request() req, @Query('ship_code') shipCode?: string) {
    const types = await this.notificationTypeService.findAll();
    const userPhone = req.user.phone;

    if (!userPhone) {
      return types.map((type) => ({
        ...type,
        unread_count: 0,
      }));
    }

    const unreadCounts =
      await this.notificationTypeService.getUnreadCountsByUserPhone(
        userPhone,
        shipCode === 'all' ? undefined : shipCode,
      );

    return types.map((type) => ({
      ...type,
      unread_count: unreadCounts[type.code] || 0,
    }));
  }

  @Get('all')
  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiOperation({ summary: 'Get all list of notification types' })
  @ApiResponse({
    status: 200,
    description: 'List of notification types',
    type: [NotificationTypeEntity],
  })
  async getListAll() {
    const types = await this.notificationTypeService.findAll();
    return types;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification type by id' })
  @ApiResponse({
    status: 200,
    description: 'Notification type detail',
    type: NotificationTypeEntity,
  })
  async getById(@Param('id') id: string) {
    const entity = await this.notificationTypeService.findOne(id);
    return { success: true, data: entity };
  }

  @RequiresApiKey()
  @ApiKeyOnly()
  @Post()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiOperation({ summary: 'Create a new notification type' })
  @ApiResponse({
    status: 201,
    description: 'The notification type has been successfully created',
    type: NotificationTypeEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, e.g., notification type code already exists',
  })
  async create(@Body() createDto: CreateNotificationTypeDto) {
    return this.notificationTypeService.create(createDto);
  }

  @RequiresApiKey()
  @ApiKeyOnly()
  @Put(':id')
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiOperation({ summary: 'Update a notification type' })
  @ApiResponse({
    status: 200,
    description: 'Updated',
    type: NotificationTypeEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationTypeDto,
  ) {
    const entity = await this.notificationTypeService.update(id, updateDto);
    return { success: true, data: entity };
  }
}

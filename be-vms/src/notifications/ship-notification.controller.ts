import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiKeyOnly } from '../auth/decorators/api-key-only.decorator';
import { RequiresApiKey } from '../auth/decorators/api-key.decorator';
import {
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { ShipNotificationQueryDto } from './dto/ship-notification-query.dto';
import {
  SendShipNotificationDto,
  ShipNotificationResponseDto,
  ShipNotificationStatusDto,
  ShipNotificationStatusResponseDto,
} from './dto/ship-notification.dto';
import { TestSequenceDto } from './dto/test-sequence.dto';
import * as crypto from 'crypto';
import { ShipNotificationTaskService } from './ship-notification-task.service';
import { ShipNotificationService } from './ship-notification.service';

/**
 * Ship Notification Controller
 *
 * API này sử dụng x-api-key header để xác thực thay vì Bearer token.
 * Tất cả endpoints đều yêu cầu x-api-key header hợp lệ.
 */
@ApiTags('Ship Notifications')
@Controller('v1/ship-notifications')
@UseGuards(AuthGuard)
export class ShipNotificationController {
  constructor(
    private readonly shipNotificationService: ShipNotificationService,
    private readonly shipNotificationTaskService: ShipNotificationTaskService,
  ) {}

  @ApiBearerAuth()
  @RequiresApiKey()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication',
    required: true,
    example: 'your-secret-api-key-here',
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async sendShipNotificationPost(
    @Body() dto: SendShipNotificationDto,
    @Request() req,
  ): Promise<ShipNotificationResponseDto> {
    try {
      return await this.shipNotificationService.sendShipNotification(
        dto,
        req.user,
        false,
      );
    } catch {
      throw new BadRequestException('Dữ liệu không hợp lệ');
    }
  }

  @Post('test-sequence')
  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication',
    required: true,
    example: 'your-secret-api-key-here',
  })
  @HttpCode(HttpStatus.OK)
  async testSequence(
    @Body() body: TestSequenceDto,
    @Request() req,
  ): Promise<{ ok: true }> {
    const typesDefault = [
      'MKN_2H',
      'MKN_5H',
      'MKN_5H',
      'MKN_6H',
      'MKN_6H',
      'MKN_8D',
      'MKN_8D',
      'MKN_10D',
      'KNL',
    ];
    const types =
      body.includeTypes && body.includeTypes.length
        ? (body.includeTypes as any)
        : (typesDefault as any);
    const baseTime = body.start_at ? new Date(body.start_at) : new Date();
    for (let i = 0; i < types.length; i++) {
      const type = types[i] as any;
      const occurredAt = new Date(baseTime.getTime() + i * 60000).toISOString();
      const clientReq = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
      const dto: SendShipNotificationDto = {
        clientReq,
        ship_code: body.ship_code,
        occurred_at: occurredAt,
        content: `Test ${type}`,
        owner_name: body.owner_name,
        owner_phone: body.owner_phone,
        type,
        lat: body.lat,
        lng: body.lng,
        agent_code: body.agent_code,
      } as any;
      await this.shipNotificationService.sendShipNotification(
        dto,
        req.user,
        true,
      );
    }
    return { ok: true } as const;
  }

  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication',
    required: true,
    example: 'your-secret-api-key-here',
  })
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendShipNotification(
    @Body() dto: SendShipNotificationDto,
    @Request() req,
  ): Promise<ShipNotificationResponseDto> {
    try {
      return await this.shipNotificationService.sendShipNotification(
        dto,
        req.user,
        false,
      );
    } catch {
      throw new BadRequestException('Dữ liệu không hợp lệ');
    }
  }

  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication',
    required: true,
    example: 'your-secret-api-key-here',
  })
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getShipNotificationStatus(
    @Query() query: ShipNotificationStatusDto,
  ): Promise<ShipNotificationStatusResponseDto> {
    try {
      return await this.shipNotificationService.getShipNotificationStatus(
        query,
      );
    } catch {
      throw new BadRequestException('Dữ liệu không hợp lệ');
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get paginated list of ship notifications for authenticated user',
  })
  @ApiQuery({ name: 'current', required: false, description: 'Alias of page' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Alias of limit',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of ship notifications',
  })
  async getShipNotificationsAll(
    @Request() req,
    @Query() query: ShipNotificationQueryDto,
  ) {
    const options = {
      page: (query as any).page || (query as any).current || 1,
      limit: (query as any).limit || (query as any).pageSize || 10,
      sortBy: query.sortBy || 'created_at',
      sortOrder: query.sortOrder || SortOrder.DESC,
      status: query.status,
      type: query.type,
      ship_code: query.ship_code,
      owner_phone: '', // Lấy từ user đăng nhập
    };

    const [notifications, total] =
      await this.shipNotificationService.findShipNotificationsWithPagination(
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        options.status,
        options.type,
        options.ship_code,
        options.owner_phone,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      notifications,
      pagination,
      'Ship notifications retrieved successfully',
    );
  }

  // New endpoints for management and monitoring
  @Get('list')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get paginated list of ship notifications for authenticated user',
  })
  @ApiQuery({ name: 'current', required: false, description: 'Alias of page' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Alias of limit',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of ship notifications',
  })
  async getShipNotifications(
    @Request() req,
    @Query() query: ShipNotificationQueryDto,
  ) {
    const options = {
      page: (query as any).page || (query as any).current || 1,
      limit: (query as any).limit || (query as any).pageSize || 10,
      sortBy: query.sortBy || 'created_at',
      sortOrder: query.sortOrder || SortOrder.DESC,
      status: query.status,
      type: query.type,
      ship_code: query.ship_code,
      owner_phone: req.user.phone, // Lấy từ user đăng nhập
    };

    const [notifications, total] =
      await this.shipNotificationService.findShipNotificationsWithPagination(
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        options.status,
        options.type,
        options.ship_code,
        options.owner_phone,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      notifications,
      pagination,
      'Ship notifications retrieved successfully',
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get ship notification statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics about ship notifications',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        queued: { type: 'number' },
        sending: { type: 'number' },
        sent: { type: 'number' },
        failed: { type: 'number' },
        pendingRetry: { type: 'number' },
      },
    },
  })
  async getStats() {
    return await this.shipNotificationTaskService.getShipNotificationStats();
  }

  @Get('stats-by-type')
  @ApiOperation({ summary: 'Get ship notification statistics grouped by type' })
  @ApiResponse({
    status: 200,
    description:
      'Returns counts per notification type and boundary flags within optional date range',
  })
  async getStatsByType(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return await this.shipNotificationService.getStatsByType(dateFrom, dateTo);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending ship notifications' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of pending ship notifications',
  })
  async getPendingNotifications() {
    return await this.shipNotificationTaskService.getPendingShipNotifications();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ship notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns ship notification details',
  })
  async getNotificationById(@Param('id') id: string) {
    return await this.shipNotificationTaskService.getShipNotificationById(id);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Manually retry a failed ship notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification processing result',
  })
  async retryNotification(@Param('id') id: string) {
    const notification =
      await this.shipNotificationTaskService.getShipNotificationById(id);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.status !== 'FAILED') {
      throw new Error('Only failed notifications can be retried');
    }

    if ((notification.retry_number || 0) >= (notification.max_retry || 0)) {
      throw new Error('Notification has exceeded maximum retry attempts');
    }

    return await this.shipNotificationTaskService.processShipNotification(
      notification,
    );
  }

  @Post(':id/resend')
  @ApiOperation({
    summary: 'Resend ship notification by ID (no duplicate check)',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification resend result',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        userFound: { type: 'boolean' },
        notificationSent: { type: 'boolean' },
      },
    },
  })
  async resendNotification(@Param('id') id: string) {
    try {
      return await this.shipNotificationTaskService.resendShipNotificationById(
        id,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to resend notification',
      );
    }
  }
}

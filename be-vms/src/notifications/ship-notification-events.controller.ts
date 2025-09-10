import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ShipNotificationEventsService } from './ship-notification-events.service';
import {
  EventStatsQueryDto,
  EventStatsResponseDto,
} from './dto/event-stats.dto';
import { EventListQueryDto, EventListResponseDto } from './dto/event-list.dto';

@ApiTags('Ship Notification Events')
@Controller('v1/ship-notifications/events')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ShipNotificationEventsController {
  constructor(private readonly eventsService: ShipNotificationEventsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get ship notification event statistics' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'ship_code', required: false })
  @ApiResponse({ status: 200, type: EventStatsResponseDto })
  async stats(
    @Query() query: EventStatsQueryDto,
  ): Promise<EventStatsResponseDto> {
    return await this.eventsService.getStats(query);
  }

  @Get('unresolved')
  @ApiOperation({ summary: 'Get list of unresolved ship notification events' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'ship_code',
    required: false,
    description: 'Filter by ship code',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by event type',
  })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({ status: 200, type: EventListResponseDto })
  async getUnresolvedEvents(
    @Query() query: EventListQueryDto,
  ): Promise<EventListResponseDto> {
    return await this.eventsService.getUnresolvedEvents(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of all ship notification events' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'ship_code',
    required: false,
    description: 'Filter by ship code',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by event type',
  })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({ status: 200, type: EventListResponseDto })
  async getAllEvents(
    @Query() query: EventListQueryDto,
  ): Promise<EventListResponseDto> {
    return await this.eventsService.getAllEvents(query);
  }

  @Get('ship/:shipCode/unresolved')
  @ApiOperation({ summary: 'Get unresolved events for a specific ship' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by event type',
  })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({ status: 200, type: EventListResponseDto })
  async getUnresolvedEventsByShip(
    @Param('shipCode') shipCode: string,
    @Query() query: Omit<EventListQueryDto, 'ship_code'>,
  ): Promise<EventListResponseDto> {
    return await this.eventsService.getUnresolvedEvents({
      ...query,
      ship_code: shipCode,
    });
  }
}

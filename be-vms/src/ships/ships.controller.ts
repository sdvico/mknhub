import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ShipsService } from './ships.service';
import {
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { ApiQueryCommon } from '../utils';
import { Roles, USER_ROLES } from '../auth';

@ApiTags('Ships')
@Controller('ships')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ShipsController {
  constructor(private readonly shipsService: ShipsService) {}

  @Get()
  @ApiQueryCommon()
  @ApiOperation({
    summary: 'Get list of ships with pagination',
    description:
      'Get paginated list of ships belonging to the authenticated user. Ships are filtered by ownercode (user ID) OR ownerphone (user phone number)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ships retrieved successfully',
  })
  async getShips(@Request() req, @Query() query: CommonQueryDto) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'plate_number',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    };

    const [ships, total] = await this.shipsService.findShipsWithPagination(
      req.user.id,
      options.page,
      options.limit,
      options.sortBy,
      options.sortOrder,
      options.q,
      options.keySearch,
      req.user.phone,
    );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      ships,
      pagination,
      'Ships retrieved successfully',
    );
  }

  @Get('notifications')
  @ApiQueryCommon()
  @ApiQuery({
    name: 'ship_code',
    required: false,
    type: String,
    description: 'Filter by ship code',
    example: 'SHIP001',
  })
  @ApiOperation({
    summary: 'Get ship notifications with pagination',
    description:
      'Get paginated list of ship notifications mapped by phone between user and ship notifications',
  })
  @ApiResponse({
    status: 200,
    description: 'Ship notifications retrieved successfully',
  })
  async getShipNotifications(
    @Request() req,
    @Query() query: CommonQueryDto,
    @Query('ship_code') shipCode?: string,
  ) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'created_at',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    };

    const [notifications, total] =
      await this.shipsService.findShipNotificationsWithPagination(
        req.user.id,
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        shipCode,
        options.q,
        options.keySearch,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      notifications,
      pagination,
      'Ship notifications retrieved successfully',
    );
  }

  @Get('admin')
  @ApiQueryCommon()
  @ApiOperation({
    summary:
      'Admin: Get ships with pagination (with owner info and unresolved events)',
    description:
      'Get paginated list of ships with owner information and unresolved events for each ship',
  })
  @ApiResponse({
    status: 200,
    description: 'Ships retrieved successfully with unresolved events',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              plate_number: { type: 'string' },
              name: { type: 'string' },
              status: { type: 'string' },
              owner: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  username: { type: 'string' },
                  fullname: { type: 'string' },
                  phone: { type: 'string' },
                },
              },
              lastmessage: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string' },
                  status: { type: 'string' },
                  content: { type: 'string' },
                  created_at: { type: 'string', format: 'date-time' },
                },
              },
              unresolved_events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    ship_code: { type: 'string' },
                    type: { type: 'string' },
                    started_at: { type: 'string', format: 'date-time' },
                    user_report_time: {
                      type: 'string',
                      format: 'date-time',
                      nullable: true,
                    },
                    response_minutes_from_6h: {
                      type: 'number',
                      nullable: true,
                    },
                    created_at: { type: 'string', format: 'date-time' },
                  },
                },
              },
              unresolved_events_count: { type: 'number' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @Roles(USER_ROLES.ADMIN)
  async getShipsForAdmin(@Query() query: CommonQueryDto) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'plate_number',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
    };

    const [ships, total] = await this.shipsService.findShipsForAdmin(
      options.page,
      options.limit,
      options.sortBy,
      options.sortOrder,
      options.q,
      options.keySearch,
    );

    const pagination = createPaginationMeta(options.page, options.limit, total);
    return createPaginatedResponse(
      ships,
      pagination,
      'Ships retrieved successfully',
    );
  }

  @Get(':shipCode/events/unresolved')
  @ApiOperation({
    summary: 'Get unresolved events for a specific ship',
    description:
      'Get list of events that are not yet resolved for the specified ship',
  })
  @ApiResponse({
    status: 200,
    description: 'Unresolved events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          ship_code: { type: 'string' },
          type: { type: 'string' },
          started_at: { type: 'string', format: 'date-time' },
          user_report_time: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          response_minutes_from_6h: { type: 'number', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getUnresolvedEventsByShip(@Param('shipCode') shipCode: string) {
    return await this.shipsService.getUnresolvedEventsByShipCode(shipCode);
  }

  @Get('events/unresolved')
  @ApiOperation({
    summary: 'Admin: Get all unresolved events with ship information',
    description:
      'Get list of all events that are not yet resolved with ship details',
  })
  @ApiResponse({
    status: 200,
    description: 'All unresolved events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          ship_code: { type: 'string' },
          type: { type: 'string' },
          started_at: { type: 'string', format: 'date-time' },
          user_report_time: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          response_minutes_from_6h: { type: 'number', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          plate_number: { type: 'string' },
          owner_name: { type: 'string' },
          owner_phone: { type: 'string' },
        },
      },
    },
  })
  @Roles(USER_ROLES.ADMIN)
  async getAllUnresolvedEvents() {
    return await this.shipsService.getAllUnresolvedEvents();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get ship statistics' })
  @ApiResponse({ status: 200, description: 'Ship statistics retrieved' })
  async getStats() {
    const stats = await this.shipsService.getStatistics();
    return {
      success: true,
      message: 'Ship statistics retrieved successfully',
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ship by ID' })
  @ApiResponse({ status: 200, description: 'Ship retrieved successfully' })
  async getShipById(@Param('id') id: string) {
    const ship = await this.shipsService.findById(id);

    if (!ship) {
      return { success: false, message: 'Ship not found' };
    }

    // Resolve last report, last ship notification and owner user
    const [lastReport, lastNotification, owner] = await Promise.all([
      this.shipsService.getReportById(ship.last_report_id as string),
      this.shipsService.getShipNotificationById(
        ship.last_ship_notification_id as string,
      ),
      this.shipsService.getUserById(ship.ownercode as string),
    ]);

    return {
      success: true,
      data: {
        ...ship,
        lastReport,
        lastNotification,
        owner,
      },
    };
  }
}

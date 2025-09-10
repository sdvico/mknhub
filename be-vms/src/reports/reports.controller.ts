import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { CreatePortDto } from './dto/create-port.dto';
import { CreateReportResponseDto } from './dto/create-report-response.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportStatus } from './entities/report.entity';
import { AuthGuard, RolesGuard, Roles, USER_ROLES } from '../auth';
import {
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { ApiQueryCommon } from '../utils';
import { ApiQuery } from '@nestjs/swagger';
import { ResolveEventWithReportDto } from './dto/resolve-event-with-report.dto';
import {
  ReportStatsQueryDto,
  ReportStatsByStatusDto,
  ReportStatsByNotificationTypeDto,
  NotificationViewStatsDto,
} from './dto/report-stats.dto';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new report',
    description:
      'Create a new report with location, description, and optional ship/user references',
  })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
    type: CreateReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or missing required fields',
  })
  async create(@Request() req, @Body() createReportDto: CreateReportDto) {
    const report = await this.reportsService.create(
      createReportDto,
      req.user.id,
      createReportDto.shipNotificationId,
    );
    return {
      success: true,
      message: 'Report created successfully',
      data: report,
    };
  }

  @Get('my-reports')
  @ApiQueryCommon()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ReportStatus,
    description: 'Filter by report status',
    example: ReportStatus.PENDING,
  })
  @ApiQuery({
    name: 'ship_id',
    required: false,
    type: String,
    description: 'Filter by ship ID (reporter_ship_id)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOperation({
    summary: 'Get list of reports for the authenticated user',
    description:
      'Get paginated list of reports created by the current user, optionally filtered by ship',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
  })
  async getMyReports(
    @Request() req,
    @Query() query: CommonQueryDto,
    @Query('status') status?: ReportStatus,
    @Query('ship_id') shipId?: string,
  ) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'reported_at',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    };

    const [reports, total] =
      await this.reportsService.findReportsWithPagination(
        req.user.id,
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        status,
        options.q,
        options.keySearch,
        shipId,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      reports,
      pagination,
      'Reports retrieved successfully',
    );
  }

  @Get()
  @ApiQueryCommon()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ReportStatus,
    description: 'Filter by report status',
    example: ReportStatus.PENDING,
  })
  @ApiOperation({
    summary: 'Get list of all reports with pagination (Admin only)',
    description: 'Get paginated list of all reports in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
  })
  @Roles(USER_ROLES.ADMIN)
  async findAll(
    @Request() req,
    @Query() query: CommonQueryDto,
    @Query('status') status?: ReportStatus,
  ) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'reported_at',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    };

    const [reports, total] =
      await this.reportsService.findReportsWithPagination(
        '',
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        status,
        options.q,
        options.keySearch,
        undefined, // shipId - không filter theo ship trong admin API
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      reports,
      pagination,
      'Reports retrieved successfully',
    );
  }

  @Get('location')
  async getReportsByLocation(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string = '10',
    @Query('limit') limit: string = '50',
  ) {
    return await this.reportsService.getReportsByLocation(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      parseInt(limit),
    );
  }

  @Get('ports')
  @ApiQueryCommon()
  @ApiOperation({ summary: 'Get list of ports (paginated)' })
  @ApiResponse({ status: 200, description: 'Ports retrieved successfully' })
  async listPorts(@Query() query: CommonQueryDto) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 150,
      q: query.q,
    };

    const [ports, total] = await this.reportsService.findPortsWithPagination(
      options.page,
      options.limit,
      options.q,
    );

    const pagination = createPaginationMeta(options.page, options.limit, total);
    return createPaginatedResponse(
      ports,
      pagination,
      'Ports retrieved successfully',
    );
  }

  @Post('resolve-event')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Resolve an open event with a new report' })
  async resolveEvent(@Request() req, @Body() body: ResolveEventWithReportDto) {
    // Create report and close event
    const created = await this.reportsService.create(
      {
        description: body.description,
        lat: 0 as any,
        lng: 0 as any,
        port_code: null as any,
        reporter_ship_id: null as any,
        reported_at: body.reported_at as any,
        status: ReportStatus.APPROVED,
        shipNotificationId: body.ship_notification_id as any,
        source: 'OFFICER' as any,
      } as any,
      req.user.id,
      body.ship_notification_id,
    );
    return {
      success: true,
      message: 'Event resolved with report successfully',
      data: created,
    };
  }

  @Post('ports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update a port' })
  @ApiResponse({
    status: 201,
    description: 'Port created/updated successfully',
  })
  async createPort(@Body() body: CreatePortDto) {
    const port = await this.reportsService.createOrUpdatePort(body);
    return {
      success: true,
      message: 'Port created/updated successfully',
      data: port,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reportsService.findOne(id);
  }

  @Put(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async updateWithPut(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return await this.reportsService.update(id, updateReportDto);
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return await this.reportsService.update(id, updateReportDto);
  }

  @Patch(':id/status')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReportStatus,
  ) {
    return await this.reportsService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.reportsService.remove(id);
  }

  @Get('stats/by-status')
  @ApiOperation({
    summary: 'Get report statistics by status',
    description:
      'Get total count of reports grouped by status (pending, approved, rejected)',
  })
  @ApiResponse({
    status: 200,
    description: 'Report statistics retrieved successfully',
    type: ReportStatsByStatusDto,
  })
  async getStatsByStatus(@Query() query: ReportStatsQueryDto) {
    const stats = await this.reportsService.getReportStatsByStatus(
      query.from,
      query.to,
      query.ship_code,
    );
    return {
      success: true,
      message: 'Report statistics by status retrieved successfully',
      data: stats,
    };
  }

  @Get('stats/by-notification-type')
  @ApiOperation({
    summary: 'Get report statistics by notification type',
    description: 'Get total count of reports grouped by ship notification type',
  })
  @ApiResponse({
    status: 200,
    description: 'Report statistics retrieved successfully',
    type: ReportStatsByNotificationTypeDto,
  })
  async getStatsByNotificationType(@Query() query: ReportStatsQueryDto) {
    const stats = await this.reportsService.getReportStatsByNotificationType(
      query.from,
      query.to,
      query.ship_code,
    );
    return {
      success: true,
      message: 'Report statistics by notification type retrieved successfully',
      data: stats,
    };
  }

  @Get('stats/notification-views')
  @ApiOperation({
    summary: 'Get notification view statistics',
    description:
      'Get statistics about how many notifications have been viewed by fishermen',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification view statistics retrieved successfully',
    type: NotificationViewStatsDto,
  })
  async getNotificationViewStats(@Query() query: ReportStatsQueryDto) {
    const stats = await this.reportsService.getNotificationViewStats(
      query.from,
      query.to,
      query.ship_code,
    );
    return {
      success: true,
      message: 'Notification view statistics retrieved successfully',
      data: stats,
    };
  }
}

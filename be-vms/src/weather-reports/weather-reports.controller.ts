import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiKeyOnly,
  AuthGuard,
  RequiresApiKey,
  Roles,
  RolesGuard,
  USER_ROLES,
} from '../auth';
import {
  ApiQueryCommon,
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { CreateWeatherReportResponseDto } from './dto/create-weather-report-response.dto';
import { CreateWeatherReportDto } from './dto/create-weather-report.dto';
import { UpdateWeatherReportDto } from './dto/update-weather-report.dto';
import { WeatherReportsService } from './weather-reports.service';

@ApiTags('Weather Reports')
@Controller('weather-reports')
@ApiBearerAuth()
export class WeatherReportsController {
  constructor(private readonly weatherReportsService: WeatherReportsService) {}

  @Get('list')
  @UseGuards(AuthGuard)
  @ApiQueryCommon()
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
    description: 'Filter by region',
    example: 'Ho Chi Minh City',
  })
  @ApiOperation({
    summary: 'Get list of weather reports for authenticated users',
    description: 'Get paginated list of weather reports with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather reports retrieved successfully',
  })
  async getList(
    @Query() query: CommonQueryDto,
    @Query('region') region?: string,
  ) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'created_at',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
    };

    const [weatherReports, total] =
      await this.weatherReportsService.findWeatherReportsWithPagination(
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        true, // Only show enabled reports for regular users
        region,
        options.q,
        options.keySearch,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      weatherReports,
      pagination,
      'Weather reports retrieved successfully',
    );
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  @ApiQueryCommon()
  @ApiQuery({
    name: 'enable',
    required: false,
    type: Boolean,
    description: 'Filter by enable status',
    example: true,
  })
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
    description: 'Filter by region',
    example: 'Ho Chi Minh City',
  })
  @ApiOperation({
    summary: 'Get list of all weather reports (Admin only)',
    description:
      'Get paginated list of all weather reports with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather reports retrieved successfully',
  })
  async findAll(
    @Query() query: CommonQueryDto,
    @Query('enable') enable?: string,
    @Query('region') region?: string,
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

    const enableBool = enable !== undefined ? enable === 'true' : undefined;

    const [weatherReports, total] =
      await this.weatherReportsService.findWeatherReportsWithPagination(
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        enableBool,
        region,
        options.q,
        options.keySearch,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      weatherReports,
      pagination,
      'Weather reports retrieved successfully',
    );
  }

  @Get('active')
  async getActive() {
    return await this.weatherReportsService.getActiveWeatherReports();
  }

  @Get('regions')
  async getRegions() {
    return await this.weatherReportsService.getRegions();
  }

  @Get('region/:region')
  async getByRegion(@Param('region') region: string) {
    return await this.weatherReportsService.getWeatherReportsByRegion(region);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.weatherReportsService.findOne(id);
  }

  @Get(':id/view')
  async incrementView(@Param('id') id: string) {
    await this.weatherReportsService.incrementViews(id);
    return { message: 'View count incremented' };
  }

  @Get(':id/click')
  async incrementClick(@Param('id') id: string) {
    await this.weatherReportsService.incrementClicks(id);
    return { message: 'Click count incremented' };
  }

  @Post()
  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for authentication',
    required: true,
    example: 'your-secret-api-key-here',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new weather report',
    description:
      'Create a new weather report with region, summary, and optional details',
  })
  @ApiBody({
    type: CreateWeatherReportDto,
    description: 'Weather report data',
    examples: {
      example1: {
        summary: 'Complete weather report with all fields',
        value: {
          region: 'Vùng biển Phú Quốc - Cà Mau',
          summary: 'Thời tiết biển thuận lợi cho hoạt động đánh cá',
          advice:
            'Tàu thuyền có thể ra khơi an toàn. Cần theo dõi thông tin thời tiết thường xuyên.',
          link: 'https://nchmf.gov.vn/Kttvs/vung-bien-phu-quoc-ca-mau',
          cloud: 'Có mây, không mưa',
          rain: 'Không mưa',
          wind: 'Gió Đông Bắc cấp 3-4',
          wave: 'Sóng cao 1-2m',
          visibility: 'Tầm nhìn xa 8-12km',
          recommendation:
            'Thời tiết thuận lợi cho hoạt động đánh cá. Tàu thuyền có thể ra khơi an toàn.',
          enable: true,
          published_at: '2024-01-01T10:30:00.000Z',
        },
      },
      example2: {
        summary: 'Basic weather report with required fields only',
        value: {
          region: 'Vùng biển Vũng Tàu - Côn Đảo',
          summary: 'Gió Đông Nam cấp 5-6, biển động',
          enable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Weather report created successfully',
    type: CreateWeatherReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  async create(@Body() createWeatherReportDto: CreateWeatherReportDto) {
    const weatherReport = await this.weatherReportsService.create(
      createWeatherReportDto,
    );
    return {
      success: true,
      message: 'Weather report created successfully',
      data: weatherReport,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async update(
    @Param('id') id: string,
    @Body() updateWeatherReportDto: UpdateWeatherReportDto,
  ) {
    return await this.weatherReportsService.update(id, updateWeatherReportDto);
  }

  @Patch(':id/toggle')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async toggleEnable(@Param('id') id: string) {
    return await this.weatherReportsService.toggleEnable(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.weatherReportsService.remove(id);
  }
}

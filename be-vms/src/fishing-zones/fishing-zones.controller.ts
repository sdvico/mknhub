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
import { ApiQueryCommon, CommonQueryDto, SortOrder } from '../utils';
import { CreateFishingZoneDto } from './dto/create-fishing-zone.dto';
import { UpdateFishingZoneDto } from './dto/update-fishing-zone.dto';
import { FishingZonesService } from './fishing-zones.service';

@ApiTags('Fishing Zones')
@Controller('fishing-zones')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FishingZonesController {
  constructor(private readonly fishingZonesService: FishingZonesService) {}

  @Get('list')
  @ApiQueryCommon()
  @ApiOperation({
    summary: 'Get list of fishing zones with pagination',
    description: 'Get paginated list of fishing zones for authenticated users',
  })
  @ApiResponse({
    status: 200,
    description: 'Fishing zones retrieved successfully',
  })
  async getList(
    @Query() query: CommonQueryDto,
    @Query('enable') enable?: string,
  ) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'created_at',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
    };

    const enableBool = enable !== undefined ? enable === 'true' : undefined;
    return await this.fishingZonesService.findAll(
      options.page,
      options.limit,
      enableBool,
      options.sortBy,
      options.sortOrder,
    );
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  @ApiOperation({
    summary: 'Get list of all fishing zones (Admin only)',
    description: 'Get paginated list of all fishing zones in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Fishing zones retrieved successfully',
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('enable') enable?: string,
  ) {
    const enableBool = enable !== undefined ? enable === 'true' : undefined;
    return await this.fishingZonesService.findAll(
      parseInt(page),
      parseInt(limit),
      enableBool,
    );
  }

  @Get('active')
  async getActive() {
    return await this.fishingZonesService.getActiveFishingZones();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fishingZonesService.findOne(id);
  }

  @Get(':id/view')
  async incrementView(@Param('id') id: string) {
    await this.fishingZonesService.incrementViews(id);
    return { message: 'View count incremented' };
  }

  @Get(':id/click')
  async incrementClick(@Param('id') id: string) {
    await this.fishingZonesService.incrementClicks(id);
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
    summary: 'Create a new fishing zone',
    description: 'Create a new fishing zone with location and details',
  })
  @ApiBody({ type: CreateFishingZoneDto })
  @ApiResponse({
    status: 201,
    description: 'Fishing zone created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  async create(@Body() createFishingZoneDto: CreateFishingZoneDto) {
    return await this.fishingZonesService.create(createFishingZoneDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async update(
    @Param('id') id: string,
    @Body() updateFishingZoneDto: UpdateFishingZoneDto,
  ) {
    return await this.fishingZonesService.update(id, updateFishingZoneDto);
  }

  @Patch(':id/toggle')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async toggleEnable(@Param('id') id: string) {
    return await this.fishingZonesService.toggleEnable(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.fishingZonesService.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { CommonQueryDto } from '../utils/dto/common-query.dto';

import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@ApiTags('Agencies')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new agency',
    description: 'Create a new agency with name and unique code',
  })
  @ApiResponse({
    status: 201,
    description: 'Agency created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Agency code already exists',
  })
  @ApiBody({
    type: CreateAgencyDto,
    examples: {
      example1: {
        summary: 'Sample agency',
        value: {
          name: 'Công ty TNHH ABC',
          code: 'ABC001',
        },
      },
    },
  })
  async create(@Body() createAgencyDto: CreateAgencyDto) {
    const agency = await this.agenciesService.create(createAgencyDto);
    return {
      success: true,
      message: 'Agency created successfully',
      data: agency,
    };
  }

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: 'Get list of agencies with pagination',
    description: 'Get paginated list of all agencies',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: SortOrder,
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search query',
  })
  @ApiResponse({
    status: 200,
    description: 'Agencies retrieved successfully',
  })
  async findAll(@Query() query: CommonQueryDto) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'created_at',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
    };

    const [agencies, total] =
      await this.agenciesService.findAgenciesWithPagination(
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        options.q,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      agencies,
      pagination,
      'Agencies retrieved successfully',
    );
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Get agency by ID',
    description: 'Get detailed information of a specific agency',
  })
  @ApiResponse({
    status: 200,
    description: 'Agency retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Agency not found',
  })
  async findOne(@Param('id') id: string) {
    const agency = await this.agenciesService.findById(id);
    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    return {
      success: true,
      message: 'Agency retrieved successfully',
      data: agency,
    };
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Update agency',
    description: 'Update agency information',
  })
  @ApiResponse({
    status: 200,
    description: 'Agency updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Agency not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Agency code already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    const agency = await this.agenciesService.update(id, updateAgencyDto);
    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    return {
      success: true,
      message: 'Agency updated successfully',
      data: agency,
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete agency',
    description: 'Delete an agency by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Agency deleted successfully',
  })
  async remove(@Param('id') id: string) {
    await this.agenciesService.remove(id);
    return {
      success: true,
      message: 'Agency deleted successfully',
    };
  }
}

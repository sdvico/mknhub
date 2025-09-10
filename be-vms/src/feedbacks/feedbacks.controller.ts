import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
  ApiQuery,
} from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateFeedbackResponseDto } from './dto/create-feedback-response.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackStatus } from './entities/feedback.entity';
import { AuthGuard, RolesGuard, Roles, USER_ROLES } from '../auth';
import {
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { ApiQueryCommon } from '../utils';

@ApiTags('Feedbacks')
@Controller('feedbacks')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new feedback',
    description: 'Create a new feedback with content and reporter information',
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully',
    type: CreateFeedbackResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbacksService.create(createFeedbackDto);
    return {
      success: true,
      message: 'Feedback created successfully',
      data: feedback,
    };
  }

  @Get()
  @ApiQueryCommon()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: FeedbackStatus,
    description: 'Filter by feedback status',
    example: FeedbackStatus.NEW,
  })
  @ApiOperation({
    summary: 'Get list of feedbacks with pagination',
    description: 'Get paginated list of feedbacks for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedbacks retrieved successfully',
  })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async findAll(
    @Request() req,
    @Query() query: CommonQueryDto,
    @Query('status') status?: FeedbackStatus,
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

    const [feedbacks, total] =
      await this.feedbacksService.findFeedbacksWithPagination(
        '',
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        status,
        options.q,
        options.keySearch,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      feedbacks,
      pagination,
      'Feedbacks retrieved successfully',
    );
  }

  @Get('stats')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async getStats() {
    return await this.feedbacksService.getFeedbackStats();
  }

  @Get('my-feedbacks')
  @ApiQueryCommon()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: FeedbackStatus,
    description: 'Filter by feedback status',
    example: FeedbackStatus.NEW,
  })
  @ApiOperation({
    summary: 'Get list of feedbacks for the authenticated user',
    description: 'Get paginated list of feedbacks created by the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedbacks retrieved successfully',
  })
  async getMyFeedbacks(
    @Request() req,
    @Query() query: CommonQueryDto,
    @Query('status') status?: FeedbackStatus,
  ) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'created_at',
      sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
      q: query.q,
      keySearch: query.keySearch,
    };

    const [feedbacks, total] =
      await this.feedbacksService.findFeedbacksWithPagination(
        req.user.id,
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        status,
        options.q,
        options.keySearch,
      );

    const pagination = createPaginationMeta(options.page, options.limit, total);

    return createPaginatedResponse(
      feedbacks,
      pagination,
      'Feedbacks retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.feedbacksService.findOne(id);
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return await this.feedbacksService.update(id, updateFeedbackDto);
  }

  @Patch(':id/status')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: FeedbackStatus,
  ) {
    return await this.feedbacksService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.feedbacksService.remove(id);
  }
}

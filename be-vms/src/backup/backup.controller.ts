import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BackupService } from './backup.service';
import { CreateBackupDto, BackupResponseDto } from './dto/backup.dto';
import {
  CommonQueryDto,
  createPaginatedResponse,
  createPaginationMeta,
  SortOrder,
} from '../utils';
import { ApiQueryCommon } from '../utils';

@ApiTags('Backup Management')
@Controller('backup')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo backup mới',
    description: 'API để tạo backup dữ liệu cho user hiện tại',
  })
  @ApiBody({
    type: CreateBackupDto,
    description: 'Dữ liệu cần backup',
    examples: {
      deviceBackup: {
        summary: 'Device backup',
        description: 'Backup dữ liệu thiết bị',
        value: {
          data: {
            devices: [
              { imei: '123456789012345', model: 'GPS-100', status: 'active' },
            ],
            ships: [
              { plateNumber: 'AB-12345', name: 'Tàu ABC', deviceCount: 1 },
            ],
          },
          description: 'Backup thiết bị tháng 12/2024',
        },
      },
      fullBackup: {
        summary: 'Full system backup',
        description: 'Backup toàn bộ hệ thống',
        value: {
          data: {
            devices: [
              { imei: '123456789012345', model: 'GPS-100', status: 'active' },
              { imei: '987654321098765', model: 'GPS-200', status: 'inactive' },
            ],
            ships: [
              { plateNumber: 'AB-12345', name: 'Tàu ABC', deviceCount: 2 },
            ],
            subscriptions: [
              { planId: 'plan-123', deviceId: 'device-123', status: 'active' },
            ],
          },
          description: 'Full backup hệ thống',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo backup thành công',
    type: BackupResponseDto,
    examples: {
      success: {
        summary: 'Backup created',
        value: {
          success: true,
          message: 'Backup created successfully',
          backupId: 'uuid-backup-1234-5678-9012',
          filename: 'backup_2024_12_01_12_30_45.json',
          backupDate: '2024-12-01T12:30:45.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu backup không hợp lệ',
    examples: {
      error: {
        summary: 'Invalid data',
        value: {
          message: 'Backup data is required',
          statusCode: 400,
        },
      },
    },
  })
  async createBackup(@Request() req, @Body() backupData: CreateBackupDto) {
    try {
      const userId = req.user.id;

      if (!backupData || !backupData.data) {
        throw new HttpException(
          'Backup data is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.backupService.createBackup(backupData, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create backup: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách backup',
    description:
      'API để lấy lịch sử backup của user hiện tại với pagination và sorting',
  })
  @ApiQueryCommon()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách backup thành công',
    type: BackupResponseDto,
    examples: {
      success: {
        summary: 'Backup history',
        value: {
          success: true,
          data: [
            {
              id: 'uuid-backup-1234',
              filename: 'backup_2024_12_01.json',
              backupDate: '2024-12-01T12:30:45.000Z',
              description: 'Backup thiết bị tháng 12/2024',
              isActive: true,
              userid: 'user-123',
            },
            {
              id: 'uuid-backup-5678',
              filename: 'backup_2024_11_30.json',
              backupDate: '2024-11-30T15:20:30.000Z',
              description: 'Backup thiết bị tháng 11/2024',
              isActive: true,
              userid: 'user-123',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
          },
        },
      },
    },
  })
  async getBackupHistory(@Query() query: CommonQueryDto, @Request() req) {
    try {
      const userId = req.user.id;
      const options = {
        page: query.page || 1,
        limit: query.limit || 10,
        sortBy: query.sortBy || 'backupDate',
        sortOrder: (query.sortOrder || SortOrder.DESC) as SortOrder,
        q: query.q,
        keySearch: query.keySearch,
        status: query.status,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      };

      const result = await this.backupService.getBackupHistory(
        userId,
        options.page,
        options.limit,
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
          'Backup history retrieved successfully',
        );
      }

      // Nếu service trả về dạng khác, tạo response chuẩn
      const [backups, total] = Array.isArray(result)
        ? [result, result.length]
        : [result?.data || [], result?.total || 0];

      const pagination = createPaginationMeta(
        options.page,
        options.limit,
        total,
      );

      return createPaginatedResponse(
        backups,
        pagination,
        'Backup history retrieved successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get backup history: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết backup',
    description: 'API để lấy dữ liệu chi tiết của một backup',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của backup cần lấy',
    example: 'uuid-backup-1234-5678-9012',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy backup thành công',
    type: BackupResponseDto,
    examples: {
      success: {
        summary: 'Backup details',
        value: {
          success: true,
          backupData: {
            devices: [
              { imei: '123456789012345', model: 'GPS-100', status: 'active' },
            ],
            ships: [
              { plateNumber: 'AB-12345', name: 'Tàu ABC', deviceCount: 1 },
            ],
          },
          backupInfo: {
            id: 'uuid-backup-1234',
            filename: 'backup_2024_12_01.json',
            backupDate: '2024-12-01T12:30:45.000Z',
            description: 'Backup thiết bị tháng 12/2024',
            isActive: true,
            userid: 'user-123',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy backup',
    examples: {
      error: {
        summary: 'Backup not found',
        value: {
          message: 'Backup not found',
          statusCode: 404,
        },
      },
    },
  })
  async getBackup(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user.id;

      if (!id) {
        throw new HttpException(
          'Backup ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.backupService.getBackup(id, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get backup: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa backup',
    description: 'API để xóa một backup',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của backup cần xóa',
    example: 'uuid-backup-1234-5678-9012',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa backup thành công',
    examples: {
      success: {
        summary: 'Backup deleted',
        value: {
          success: true,
          message: 'Backup deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy backup',
    examples: {
      error: {
        summary: 'Backup not found',
        value: {
          message: 'Backup not found',
          statusCode: 404,
        },
      },
    },
  })
  async deleteBackup(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user.id;

      if (!id) {
        throw new HttpException(
          'Backup ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.backupService.deleteBackup(id, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to delete backup: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBackupDto {
  @ApiProperty({
    description: 'Dữ liệu cần backup',
    example: {
      devices: [
        { imei: '123456789012345', model: 'GPS-100', status: 'active' },
      ],
      ships: [{ plateNumber: 'AB-12345', name: 'Tàu ABC', deviceCount: 1 }],
    },
    type: Object,
  })
  @IsNotEmpty()
  @IsObject()
  data: any;

  @ApiProperty({
    description: 'Mô tả backup (tùy chọn)',
    example: 'Backup hàng tháng tháng 12/2024',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class BackupResponseDto {
  @ApiProperty({
    description: 'Trạng thái thành công',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Backup created successfully',
    type: String,
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'ID của backup',
    example: 'uuid-backup-1234-5678-9012',
    type: String,
    required: false,
  })
  backupId?: string;

  @ApiProperty({
    description: 'Tên file backup',
    example: 'backup_2024_12_01_12_30_45.json',
    type: String,
    required: false,
  })
  filename?: string;

  @ApiProperty({
    description: 'Ngày tạo backup',
    example: '2024-12-01T12:30:45.000Z',
    type: Date,
    required: false,
  })
  backupDate?: Date;

  @ApiProperty({
    description: 'Dữ liệu backup',
    example: {
      devices: [
        { imei: '123456789012345', model: 'GPS-100', status: 'active' },
      ],
    },
    type: Object,
    required: false,
  })
  backupData?: any;

  @ApiProperty({
    description: 'Thông tin chi tiết backup',
    example: {
      id: 'uuid-backup-1234',
      filename: 'backup_2024_12_01.json',
      backupDate: '2024-12-01T12:30:45.000Z',
      description: 'Backup thiết bị tháng 12/2024',
      isActive: true,
      userid: 'user-123',
    },
    type: Object,
    required: false,
  })
  backupInfo?: {
    id: string;
    filename: string;
    backupDate: Date;
    description?: string;
    isActive: boolean;
    userid: string;
  };

  @ApiProperty({
    description: 'Danh sách backup',
    example: [
      {
        id: 'uuid-backup-1234',
        filename: 'backup_2024_12_01.json',
        backupDate: '2024-12-01T12:30:45.000Z',
        description: 'Backup thiết bị tháng 12/2024',
        isActive: true,
        userid: 'user-123',
      },
    ],
    type: Array,
    required: false,
  })
  backups?: Array<{
    id: string;
    filename: string;
    backupDate: Date;
    description?: string;
    isActive: boolean;
    userid: string;
  }>;
}

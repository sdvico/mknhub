import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ShipNotificationType } from '../infrastructure/persistence/relational/entities/ship-notification.entity';

export class TestSequenceDto {
  @ApiProperty({
    description: 'Mã tàu',
    example: 'VN-TEST-001',
    default: 'VN-TEST-001',
  })
  @IsString()
  ship_code!: string;

  @ApiProperty({
    description: 'Tên chủ tàu',
    example: 'Nguyễn Văn A',
    default: 'Người Kiểm Thử',
  })
  @IsString()
  owner_name!: string;

  @ApiProperty({
    description: 'SĐT chủ tàu',
    example: '+84901234567',
    default: '+84901234567',
  })
  @IsString()
  owner_phone!: string;

  @ApiProperty({
    description: 'Agent code',
    required: false,
    default: 'AGENT001',
  })
  @IsOptional()
  @IsString()
  agent_code?: string;

  @ApiProperty({ description: 'Lat', required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ description: 'Lng', required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({
    description: 'Thời điểm bắt đầu (ISO)',
    required: false,
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  start_at?: string;

  @ApiProperty({
    description:
      'Danh sách loại MKN muốn chạy (nếu không set sẽ chạy mặc định)',
    required: false,
    isArray: true,
    enum: ShipNotificationType,
    example: ['MKN_2H', 'MKN_5H', 'MKN_6H', 'MKN_8D', 'MKN_10D', 'KNL'],
  })
  @IsOptional()
  @IsArray()
  includeTypes?: ShipNotificationType[];
}

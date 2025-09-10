import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class ResolveEventWithReportDto {
  @ApiProperty({
    description: 'Event ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  @IsNotEmpty()
  event_id!: string;

  @ApiProperty({
    description: 'Ship notification ID to link report',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  ship_notification_id?: string;

  @ApiProperty({
    description: 'Report description',
    example: 'Đã kiểm tra và khôi phục kết nối',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: 'Reported at (ISO-8601)',
    example: '2025-08-31T05:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  reported_at!: string;
}

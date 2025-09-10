import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus } from '../entities/report.entity';

export class CreateReportDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 10.76262234,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 106.66017234,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @ApiProperty({
    description: 'Date and time when the report was made',
    example: '2024-01-01T10:30:00.000Z',
    type: String,
  })
  @IsNotEmpty()
  @IsDateString()
  reported_at: string;

  @ApiPropertyOptional({
    description: 'Port code where the report was made',
    example: 'VNSGN',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  port_code?: string;

  @ApiPropertyOptional({
    description: 'Description of the report',
    example: 'Ship encountered rough weather conditions',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Status of the report',
    enum: ReportStatus,
    example: ReportStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({
    description: 'ID of the user who made the report',
    example: '57B49DE2-4C82-47F7-9D47-9F28349661C7',
  })
  @IsOptional()
  @IsUUID()
  reporter_user_id?: string;

  @ApiPropertyOptional({
    description: 'ID of the ship related to the report',
    example: '57B49DE2-4C82-47F7-9D47-9F28349661C8',
  })
  @IsOptional()
  @IsUUID()
  reporter_ship_id?: string;

  @ApiPropertyOptional({
    description: 'ID of the ship notification to link with this report',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  shipNotificationId?: string;

  @ApiPropertyOptional({
    description: 'Source of the report (web, app, etc.)',
    example: 'web',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  source?: string;
}

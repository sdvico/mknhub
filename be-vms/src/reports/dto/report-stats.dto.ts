import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ReportStatsQueryDto {
  @ApiPropertyOptional({
    description: 'From datetime (ISO-8601)',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'To datetime (ISO-8601)',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Filter by ship code',
    example: 'VN-12345-TS',
  })
  @IsOptional()
  @IsString()
  ship_code?: string;
}

export class ReportStatsByStatusDto {
  @ApiProperty({ description: 'Total number of reports' })
  total!: number;

  @ApiProperty({ description: 'Number of pending reports' })
  pending!: number;

  @ApiProperty({ description: 'Number of approved reports' })
  approved!: number;

  @ApiProperty({ description: 'Number of rejected reports' })
  rejected!: number;
}

export class NotificationViewStatsDto {
  @ApiProperty({ description: 'Total number of notifications' })
  total!: number;

  @ApiProperty({ description: 'Number of viewed notifications' })
  viewed!: number;

  @ApiProperty({ description: 'Number of unviewed notifications' })
  unviewed!: number;

  @ApiProperty({ description: 'View rate percentage' })
  view_rate!: number;
}

export class ReportStatsByNotificationTypeDto {
  @ApiProperty({ description: 'Total number of reports' })
  total!: number;

  @ApiProperty({
    description: 'Reports count by notification type',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      MKN_2H: 15,
      MKN_5H: 8,
      MKN_6H: 12,
      MKN_8D: 5,
      MKN_10D: 3,
      KNL: 20,
      NEAR_BORDER: 7,
      CROSS_BORDER: 2,
    },
  })
  by_type!: Record<string, number>;
}

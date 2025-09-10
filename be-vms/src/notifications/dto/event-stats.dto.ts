import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class EventStatsQueryDto {
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

export class EventStatsResponseDto {
  @ApiProperty({ description: 'Total events' })
  total!: number;

  @ApiProperty({ description: 'Total MKN events' })
  mkn_total!: number;

  @ApiProperty({ description: 'Breakdown of MKN events by type code' })
  mkn_by_type!: Record<string, number>;

  @ApiProperty({ description: 'Boundary events NEAR count' })
  boundary_near!: number;

  @ApiProperty({ description: 'Boundary events CROSSED count' })
  boundary_crossed!: number;

  @ApiProperty({ description: 'Open events (resolved_at IS NULL)' })
  open!: number;

  @ApiProperty({ description: 'Resolved events (resolved_at IS NOT NULL)' })
  resolved!: number;
}

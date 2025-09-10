import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class EventListQueryDto {
  @ApiProperty({ required: false, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Search by ship code' })
  @IsOptional()
  @IsString()
  ship_code?: string;

  @ApiProperty({ required: false, description: 'Search by event type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false, description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'created_at';

  @ApiProperty({
    required: false,
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class EventListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ship_code: string;

  @ApiProperty({ nullable: true })
  user_report_time?: Date | null;

  @ApiProperty({ nullable: true })
  type?: string | null;

  @ApiProperty({ nullable: true })
  started_at?: Date | null;

  @ApiProperty({ nullable: true })
  resolved_at?: Date | null;

  @ApiProperty({ nullable: true })
  response_minutes_from_6h?: number | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ description: 'Duration in minutes since event started' })
  duration_minutes?: number;

  @ApiProperty({ description: 'Whether event is resolved' })
  is_resolved: boolean;
}

export class EventListResponseDto {
  @ApiProperty({ type: [EventListItemDto] })
  data: EventListItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

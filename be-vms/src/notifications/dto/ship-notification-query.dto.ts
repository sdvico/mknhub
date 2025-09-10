import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueryDto } from '../../utils/dto/common-query.dto';
import {
  ShipNotificationStatus,
  ShipNotificationType,
} from '../infrastructure/persistence/relational/entities/ship-notification.entity';

export class ShipNotificationQueryDto extends CommonQueryDto {
  @ApiPropertyOptional({
    enum: ShipNotificationStatus,
    description: 'Filter by notification status',
  })
  @IsOptional()
  @IsEnum(ShipNotificationStatus)
  status?: ShipNotificationStatus;

  @ApiPropertyOptional({
    enum: ShipNotificationType,
    description: 'Filter by notification type',
  })
  @IsOptional()
  @IsEnum(ShipNotificationType)
  type?: ShipNotificationType;

  @ApiPropertyOptional({
    description: 'Filter by ship code',
  })
  @IsOptional()
  @IsString()
  ship_code?: string;

  @ApiPropertyOptional({ description: 'Alias of page (AntD): current' })
  @IsOptional()
  current?: number;

  @ApiPropertyOptional({ description: 'Alias of limit (AntD): pageSize' })
  @IsOptional()
  pageSize?: number;
}

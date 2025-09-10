import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNotificationTypeDto {
  @ApiProperty({
    description: 'Unique code for the notification type',
    example: 'WEATHER_ALERT',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({
    description: 'Name of the notification type',
    example: 'Weather Alert Notification',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    description: 'Type of form to be displayed (optional)',
    example: 'WEATHER_FORM',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @MaxLength(50)
  form_type?: string;

  @ApiPropertyOptional({
    description: 'Icon name or class (optional)',
    example: 'weather-sunny',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({
    description: 'Text color in hex or named color (optional)',
    example: '#FF0000',
    maxLength: 20,
    nullable: true,
  })
  @IsString()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({
    description: 'Background color in hex or named color (optional)',
    example: '#FFEEEE',
    maxLength: 20,
    nullable: true,
  })
  @IsString()
  @MaxLength(20)
  background_color?: string;

  @ApiPropertyOptional({
    description: 'Title for the notification type (optional)',
    example: 'Cảnh báo thời tiết',
    maxLength: 255,
    nullable: true,
  })
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Template message for notifications (optional)',
    example:
      'Tàu {{ship_code}} gặp {{weather_condition}} tại vị trí {{location}}. Thời gian: {{time}}.',
    nullable: true,
  })
  @IsString()
  template_message?: string;

  @ApiPropertyOptional({
    description: 'Next action to take after this notification (optional)',
    example: 'CALL_OWNER',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  next_action?: string;

  @ApiPropertyOptional({
    description: 'Priority for this notification type (optional)',
    example: 5,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  priority?: number;
}

export class UpdateNotificationTypeDto {
  @ApiPropertyOptional({ maxLength: 50, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({ maxLength: 255, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ maxLength: 50, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  form_type?: string;

  @ApiPropertyOptional({ maxLength: 50, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ maxLength: 20, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({ maxLength: 20, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  background_color?: string;

  @ApiPropertyOptional({ maxLength: 255, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  template_message?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  priority?: number;
}

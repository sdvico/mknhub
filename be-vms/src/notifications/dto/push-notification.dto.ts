import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class PushNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    example: 'Price Alert',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification body message',
    example: 'Coffee price has increased by 5%',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Additional data payload',
    example: { productId: '123', type: 'price_alert' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({
    description: 'Image URL for notification',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Click action for notification',
    example: 'FLUTTER_NOTIFICATION_CLICK',
    required: false,
  })
  @IsOptional()
  @IsString()
  clickAction?: string;
}

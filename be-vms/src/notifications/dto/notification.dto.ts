import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID của ship notification (tùy chọn)',
    example: 'uuid-ship-notification-1234-5678-9012',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  ShipNotifications_id?: string;

  @ApiProperty({
    description: 'Số biển tàu (tùy chọn)',
    example: 'AB-12345',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  plateNumber?: string;

  @ApiProperty({
    description: 'ID của user nhận notification',
    example: 'uuid-user-1234-5678-9012',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  user!: string;

  @ApiProperty({
    description: 'Tiêu đề notification',
    example: 'Cảnh báo thiết bị',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Nội dung notification',
    example: 'Thiết bị GPS mất tín hiệu',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    description: 'Loại notification',
    example: 'warning',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Sub-type của notification',
    example: 'device_offline',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  stype?: string;

  @ApiProperty({
    description: 'Dữ liệu bổ sung (JSON string)',
    example: '{"deviceId": "123", "imei": "123456789012345"}',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  data?: string;

  @ApiProperty({
    description: 'ID của push token (tùy chọn)',
    example: 'uuid-push-token-1234-5678-9012',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  push_token_id?: string;
}

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'ID của notification cần update',
    example: 'uuid-notification-1234-5678-9012',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: 'ID của ship notification (tùy chọn)',
    example: 'uuid-ship-notification-1234-5678-9012',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  ShipNotifications_id?: string;

  @ApiProperty({
    description: 'Số biển tàu (tùy chọn)',
    example: 'AB-12345',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  plateNumber?: string;

  @ApiProperty({
    description: 'Tiêu đề notification',
    example: 'Cảnh báo thiết bị - Đã cập nhật',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Nội dung notification',
    example: 'Thiết bị GPS đã khôi phục tín hiệu',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Loại notification',
    example: 'info',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Sub-type của notification',
    example: 'device_online',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  stype?: string;

  @ApiProperty({
    description: 'Dữ liệu bổ sung (JSON string)',
    example: '{"deviceId": "123", "status": "online"}',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  data?: string;

  @ApiProperty({
    description: 'ID của push token (tùy chọn)',
    example: 'uuid-push-token-1234-5678-9012',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  push_token_id?: string;
}

export class SendNotificationDto {
  @ApiProperty({
    description: 'Tiêu đề notification',
    example: 'Thanh toán thành công',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Nội dung notification',
    example: 'Thanh toán gói cước Premium thành công',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiProperty({
    description: 'ID của user nhận notification',
    example: 'uuid-user-1234-5678-9012',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    description: 'Push token của device (tùy chọn)',
    example: 'fcm-token-abcd1234567890',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: 'Dữ liệu bổ sung',
    example: {
      topupId: 'uuid-topup-123',
      subscriptionId: 'uuid-sub-456',
      imei: '123456789012345',
    },
    type: Object,
    required: false,
  })
  @IsOptional()
  data?: Record<string, string>;
}

export class CreateShipNotificationDto {
  @ApiProperty({
    description: 'Mã tàu (ship_code)',
    example: 'VN-12345',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  plateNumber!: string;

  @ApiProperty({
    description: 'ID của user nhận notification',
    example: 'uuid-user-1234-5678-9012',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  user!: string;

  @ApiProperty({
    description: 'Tiêu đề notification',
    example: 'Cảnh báo tàu',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Nội dung notification',
    example: 'Tàu VN-12345 mất kết nối 5 giờ',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    description: 'Loại notification',
    example: 'ship_warning',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Sub-type của notification',
    example: 'mkn_5h',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  stype?: string;

  @ApiProperty({
    description: 'Dữ liệu bổ sung (JSON string)',
    example: '{"ship_code": "VN-12345", "occurred_at": "2025-01-09T10:00:00Z"}',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  data?: string;
}

import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  MaxLength,
  Matches,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ShipNotificationType } from '../infrastructure/persistence/relational/entities/ship-notification.entity';

export class SendShipNotificationDto {
  @ApiProperty({
    description: 'Mã định danh do client sinh (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    type: String,
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, {
    message: 'clientReq must be a valid UUID format',
  })
  clientReq!: string;

  @ApiProperty({
    description: 'Mã tàu',
    example: 'VN-12345',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  ship_code!: string;

  @ApiProperty({
    description: 'Thời điểm xảy ra sự kiện (ISO-8601)',
    example: '2025-08-31T05:30:00Z',
    type: String,
  })
  @IsDateString()
  @IsNotEmpty()
  occurred_at!: string;

  @ApiProperty({
    description: 'Nội dung thông báo (≤500 ký tự)',
    example: 'Tàu VN-12345 mất kết nối 5 giờ. Vui lòng kiểm tra.',
    type: String,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content!: string;

  @ApiProperty({
    description: 'Tên chủ tàu',
    example: 'Nguyễn Văn A',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  owner_name!: string;

  @ApiProperty({
    description: 'Số điện thoại chủ tàu (E.164 format)',
    example: '+84901234567',
    type: String,
    pattern: '^\\+[1-9]\\d{1,14}$',
  })
  @IsString()
  @IsNotEmpty()
  owner_phone!: string;

  @ApiProperty({
    description: 'Loại thông báo',
    example: 'MKN_5H',
    enum: ShipNotificationType,
  })
  @IsEnum(ShipNotificationType)
  @IsNotEmpty()
  type!: ShipNotificationType;

  @ApiProperty({
    description:
      'Status code cho vượt ranh giới (1: trong ranh giới, 2: gần ranh giới, 3: đã vượt ranh giới)',
    example: '2',
    type: String,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  boundary_status_code?: string;

  @ApiProperty({
    description: 'Vĩ độ (Latitude)',
    example: 10.76262234,
    type: Number,
    minimum: -90,
    maximum: 90,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiProperty({
    description: 'Kinh độ (Longitude)',
    example: 106.66017234,
    type: Number,
    minimum: -180,
    maximum: 180,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @ApiProperty({
    description: 'Mã đại lý/nhà cung cấp',
    example: 'AGENT001',
    type: String,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  agent_code?: string;

  // the following fields are managed by server-side processes and not accepted in request body
}

export class ShipNotificationStatusDto {
  @ApiProperty({
    description: 'Mã định danh do client sinh (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    type: String,
    required: false,
    // pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    {
      message: 'clientReq must be a valid UUID format',
    },
  )
  clientReq?: string;

  @ApiProperty({
    description: 'Mã định danh do server sinh (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
    required: false,
    //pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    {
      message: 'requestId must be a valid UUID format',
    },
  )
  requestId?: string;
}

export class ShipNotificationResponseDto {
  @ApiProperty({
    description: 'Mã định danh do server sinh (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  requestId!: string;

  @ApiProperty({
    description: 'Mã định danh do client sinh (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  clientReq!: string;

  @ApiProperty({
    description: 'Trạng thái xử lý',
    example: 'QUEUED',
  })
  status!: string;
}

export class ShipNotificationStatusResponseDto {
  @ApiProperty({
    description: 'Mã định danh do server sinh (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  requestId!: string;

  @ApiProperty({
    description: 'Mã định danh do client sinh (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  clientReq!: string;

  @ApiProperty({
    description: 'Trạng thái xử lý',
    example: 'SENT',
  })
  status!: string;
}

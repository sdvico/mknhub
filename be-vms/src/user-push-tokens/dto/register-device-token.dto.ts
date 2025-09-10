import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDeviceTokenDto {
  @ApiProperty({
    description: 'Operating system of the device',
    example: 'iOS',
    required: false,
  })
  @IsString()
  @IsOptional()
  device_os?: string;

  @ApiProperty({
    description: 'Push notification token for the device',
    example: 'fMEP0JqFyF4:APA91bHqX...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  push_token!: string;

  @ApiProperty({
    description: 'App version',
    example: '1.0.0',
    required: false,
  })
  @IsString()
  @IsOptional()
  app_ver?: string;

  @ApiProperty({
    description: 'Module name',
    example: 'main',
    required: false,
  })
  @IsString()
  @IsOptional()
  module?: string;
}

export class RegisterDeviceTokenResponseDto {
  @ApiProperty({
    description: 'Device token ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  id!: string;

  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  userid!: string;

  @ApiProperty({
    description: 'Operating system of the device',
    example: 'iOS',
  })
  device_os?: string;

  @ApiProperty({
    description: 'Push notification token for the device',
    example: 'fMEP0JqFyF4:APA91bHqX...',
  })
  push_token?: string;

  @ApiProperty({
    description: 'Registration date',
    example: '2025-01-15T10:30:00Z',
  })
  registered_date!: Date;

  @ApiProperty({
    description: 'App version',
    example: '1.0.0',
  })
  app_ver?: string;

  @ApiProperty({
    description: 'Module name',
    example: 'main',
  })
  module?: string;
}

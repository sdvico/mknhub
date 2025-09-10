import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Username để đăng ký (có thể là số điện thoại)',
    example: '0123456789',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn A',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: 'Password (nếu không nhập sẽ tự động set bằng username)',
    example: '123456',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;
}

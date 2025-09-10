import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserApiDto {
  @ApiProperty({
    description: 'Username for login',
    example: 'nguyenvana',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Nguyễn Văn A',
  })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'Phone number (can start with 0 or +84)',
    example: '0901234567',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 12)
  phone: string;
}

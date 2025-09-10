import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username để đăng nhập',
    example: 'bv11111ts',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password để đăng nhập',
    example: '123456',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

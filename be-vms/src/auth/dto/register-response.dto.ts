import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Trạng thái đăng ký',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Thông báo',
    example: 'Đăng ký thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Thông tin user đã đăng ký',
    example: {
      id: 'uuid-user-1234-5678-9012',
      username: '0123456789',
      phone: '0123456789',
      fullname: 'Nguyễn Văn A',
      state: 0,
    },
  })
  user: {
    id: string;
    username: string;
    phone: string;
    fullname: string;
    state: number;
  };
}

import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Trạng thái đăng nhập thành công',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'JWT token để authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
  })
  token: string;

  @ApiProperty({
    description: 'Thông tin user',
    example: {
      id: 'uuid-1234-5678-9012',
      username: 'admin',
      state: 1,
    },
    type: Object,
  })
  user: {
    id: string;
    username: string;
    state: number;
  };
}

import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản mới',
    description:
      'API để đăng ký tài khoản mới với username, fullname và password (tùy chọn). Nếu không nhập password sẽ tự động set bằng username',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Thông tin đăng ký',
    examples: {
      phone: {
        summary: 'Đăng ký bằng số điện thoại',
        description: 'Đăng ký với số điện thoại làm username',
        value: {
          username: '0123456789',
          fullname: 'Nguyễn Văn A',
          password: '0123456789',
        },
      },
      username: {
        summary: 'Đăng ký bằng username',
        description: 'Đăng ký với username thông thường',
        value: {
          username: 'user123',
          fullname: 'Nguyễn Văn B',
          password: 'user123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    type: RegisterResponseDto,
    examples: {
      success: {
        summary: 'Register successful',
        value: {
          success: true,
          message: 'Đăng ký thành công',
          user: {
            id: 'uuid-user-1234-5678-9012',
            username: '0123456789',
            phone: '0123456789',
            fullname: 'Nguyễn Văn A',
            state: 0,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
    examples: {
      error: {
        summary: 'Invalid data',
        value: {
          success: false,
          message: 'Username and fullname are required',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Username đã tồn tại',
    examples: {
      error: {
        summary: 'Username exists',
        value: {
          success: false,
          message: 'Username already exists',
        },
      },
    },
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập hệ thống',
    description:
      'API để đăng nhập với username/password hoặc phone/password. Nếu username là số điện thoại thì sẽ tìm theo phone, ngược lại tìm theo username',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Thông tin đăng nhập',
    examples: {
      phone: {
        summary: 'Đăng nhập bằng số điện thoại',
        description: 'Đăng nhập với số điện thoại làm username',
        value: {
          username: '0123456789',
          password: '0123456789',
        },
      },
      username: {
        summary: 'Đăng nhập bằng username',
        description: 'Đăng nhập với username thông thường',
        value: {
          username: 'user123',
          password: 'user123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    type: LoginResponseDto,
    examples: {
      success: {
        summary: 'Login successful',
        value: {
          success: true,
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 'uuid-user-1234-5678-9012',
            username: 'admin',
            state: 1,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Sai username hoặc password',
    examples: {
      error: {
        summary: 'Login failed',
        value: {
          success: false,
          message: 'Invalid username or password',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('login-admin')
  @ApiOperation({
    summary: 'Đăng nhập Admin',
    description:
      'API đăng nhập chỉ dành cho Admin. Yêu cầu user thuộc nhóm admin.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Đăng nhập admin thành công' })
  @ApiResponse({ status: 401, description: 'Không có quyền admin' })
  async loginAdmin(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.loginAdmin(loginDto);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Đăng xuất hệ thống',
    description: 'API để đăng xuất và vô hiệu hóa token',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng xuất thành công',
    examples: {
      success: {
        summary: 'Logout successful',
        value: {
          success: true,
          message: 'Logout successful',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ',
    examples: {
      error: {
        summary: 'Invalid token',
        value: {
          success: false,
          message: 'Invalid or expired token',
        },
      },
    },
  })
  async logout(
    @Headers('authorization') authHeader: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.logout(authHeader);
  }

  @Get('test')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Test authentication',
    description: 'API để test xem token có hợp lệ không',
  })
  @ApiResponse({
    status: 200,
    description: 'Token hợp lệ',
    examples: {
      success: {
        summary: 'Authentication valid',
        value: {
          message: 'Authentication successful',
          user: {
            id: 'uuid-user-1234-5678-9012',
            username: 'admin',
            state: 1,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ',
    examples: {
      error: {
        summary: 'Authentication failed',
        value: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  test(@Request() req): { message: string; user: any } {
    return {
      message: 'Authentication successful',
      user: req.user,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin user hiện tại',
    description: 'API để lấy thông tin chi tiết của user hiện tại từ token',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin user hiện tại',
    examples: {
      success: {
        summary: 'User info retrieved',
        value: {
          success: true,
          user: {
            id: 'uuid-user-1234-5678-9012',
            username: 'admin',
            state: 1,
            // Thêm các field khác nếu cần
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ',
    examples: {
      error: {
        summary: 'Authentication failed',
        value: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  me(@Request() req): { success: boolean; user: any } {
    return {
      success: true,
      user: req.user,
    };
  }
}

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { username, fullname, password } = registerDto;

    if (!username || !fullname) {
      throw new BadRequestException('Username and fullname are required');
    }

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Tạo password: nếu user nhập thì dùng, không thì dùng username
    const finalPassword = password || username;
    const md5Password = crypto
      .createHash('md5')
      .update(finalPassword)
      .digest('hex');

    // Format phone number: nếu bắt đầu bằng 0 thì chuyển thành +84
    let formattedPhone = username;
    if (/^0\d{9}$/.test(username)) {
      formattedPhone = '+84' + username.substring(1);
    }

    // Tạo user mới
    const newUser = await this.usersService.create({
      username: username,
      password: md5Password,
      phone: formattedPhone, // Auto fill phone bằng username đã format
      fullname: fullname,
      state: 0, // Trạng thái mặc định
      verified: false,
      enable: true,
    });

    return {
      success: true,
      message: 'Đăng ký thành công',
      user: {
        id: newUser.id,
        username: newUser.username,
        phone: newUser.phone,
        fullname: newUser.fullname,
        state: newUser.state,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    // Hash password bằng md5 trước khi kiểm tra
    const md5Password = crypto.createHash('md5').update(password).digest('hex');

    // Kiểm tra xem username có phải là số điện thoại không
    const isPhoneNumber = /^[0-9]+$/.test(username);

    let user: any = null;

    if (isPhoneNumber) {
      // Nếu là số điện thoại, tìm theo phone và password
      // Thử tìm với định dạng gốc trước
      user = await this.usersService.findByPhoneAndPassword(
        username,
        md5Password,
      );

      // Nếu không tìm thấy và username bắt đầu bằng 0, thử tìm với định dạng +84
      if (!user && /^0\d{9}$/.test(username)) {
        const formattedPhone = '+84' + username.substring(1);
        user = await this.usersService.findByPhoneAndPassword(
          formattedPhone,
          md5Password,
        );
      }

      // Nếu không tìm thấy và username bắt đầu bằng +84, thử tìm với định dạng 0
      if (!user && /^\+84\d{9}$/.test(username)) {
        const localPhone = '0' + username.substring(3);
        user = await this.usersService.findByPhoneAndPassword(
          localPhone,
          md5Password,
        );
      }
    } else {
      // Nếu không phải số điện thoại, tìm theo username và password
      user = await this.usersService.findByUsernameAndPassword(
        username,
        md5Password,
      );
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token to session
    await this.sessionService.create({
      userid: user.id,
      token: token,
      created_date: new Date(),
      expired_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    });

    return {
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        state: user.state,
      },
    };
  }

  async loginAdmin(loginDto: LoginDto): Promise<LoginResponseDto> {
    const result = await this.login(loginDto);
    // Verify user is in admin group
    const userGroups = await this.groupsService.getUserGroups(result.user.id);
    const isAdmin = userGroups.some((g) => g.name === 'admin');
    if (!isAdmin) {
      throw new UnauthorizedException('Admin role required');
    }
    return result;
  }

  async logout(
    authHeader: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    // Remove token from session
    await this.sessionService.deleteByToken(token);

    return { success: true, message: 'Logged out successfully' };
  }
}

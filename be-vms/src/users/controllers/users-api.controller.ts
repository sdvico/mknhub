import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { RequiresApiKey } from '../../auth/decorators/api-key.decorator';
import { ApiKeyOnly } from '../../auth/decorators/api-key-only.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CreateGroupApiDto } from '../dto/create-group-api.dto';
import { CreateUserApiDto } from '../dto/create-user-api.dto';
import { GroupsService } from '../groups.service';
import { UsersService } from '../users.service';

@ApiTags('Users API')
@Controller('api/users')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'x-api-key',
  description: 'API key for authentication',
  required: true,
  example: 'your-api-key-here',
})
export class UsersApiController {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}

  @Post()
  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        success: true,
        message: 'User created successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          username: 'nguyenvana',
          fullname: 'Nguyễn Văn A',
          phone: '0901234567',
          state: 1,
          verified: false,
          enable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or duplicate username/phone',
  })
  async createUser(@Body() createUserDto: CreateUserApiDto) {
    // Hash password with MD5
    const hashedPassword = crypto
      .createHash('md5')
      .update(createUserDto.password)
      .digest('hex');

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      state: 1,
      verified: false,
      enable: true,
    });

    return {
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        phone: user.phone,
        state: user.state,
        verified: user.verified,
        enable: user.enable,
      },
    };
  }

  @Post('groups')
  @RequiresApiKey()
  @ApiKeyOnly()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    schema: {
      example: {
        success: true,
        message: 'Group created successfully',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Nhóm tàu cá Phú Quốc',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  async createGroup(@Body() createGroupDto: CreateGroupApiDto) {
    const group = await this.groupsService.create(createGroupDto);

    return {
      success: true,
      message: 'Group created successfully',
      data: {
        id: group.id,
        name: group.name,
      },
    };
  }
}

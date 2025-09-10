import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { User } from '../../users/domain/user';
import {
  RegisterDeviceTokenDto,
  RegisterDeviceTokenResponseDto,
} from '../dto/register-device-token.dto';
import { UserPushTokensService } from '../user-push-tokens.service';

@ApiTags('User Push Tokens')
@Controller('v1/user-push-tokens')
@UseGuards(AuthGuard)
export class UserPushTokensController {
  constructor(private readonly userPushTokensService: UserPushTokensService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register or update device push token' })
  @ApiResponse({
    status: 200,
    description: 'Device token registered successfully',
    type: RegisterDeviceTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async registerDeviceToken(
    @Body() dto: RegisterDeviceTokenDto,
    @Request() req,
  ): Promise<RegisterDeviceTokenResponseDto> {
    try {
      const currentUser = req.user as User;

      if (!currentUser || !currentUser.id) {
        throw new BadRequestException('User not authenticated');
      }

      return await this.userPushTokensService.registerDeviceToken(
        dto,
        currentUser.id,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to register device token');
    }
  }
}

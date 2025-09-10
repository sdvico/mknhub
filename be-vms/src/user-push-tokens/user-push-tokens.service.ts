import { Injectable, BadRequestException } from '@nestjs/common';
import { UserPushToken } from './domain/user-push-token';
import { UserPushTokenRepository } from './infrastructure/persistence/relational/repositories/user-push-token.repository';
import { NullableType } from '../utils/types/nullable.type';
import {
  RegisterDeviceTokenDto,
  RegisterDeviceTokenResponseDto,
} from './dto/register-device-token.dto';

@Injectable()
export class UserPushTokensService {
  constructor(
    private readonly userPushTokenRepository: UserPushTokenRepository,
  ) {}

  async findById(id: string): Promise<NullableType<UserPushToken>> {
    return this.userPushTokenRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<UserPushToken[]> {
    return this.userPushTokenRepository.findByUserId(userId);
  }

  async create(data: Omit<UserPushToken, 'id'>): Promise<UserPushToken> {
    return this.userPushTokenRepository.create(data);
  }

  async update(
    id: string,
    payload: Partial<Omit<UserPushToken, 'id'>>,
  ): Promise<UserPushToken | null> {
    return this.userPushTokenRepository.update(id, payload);
  }

  async deleteById(id: string): Promise<void> {
    return this.userPushTokenRepository.deleteById(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    return this.userPushTokenRepository.deleteByUserId(userId);
  }

  /**
   * Register or update device push token
   * If device token already exists, update the user_id
   * If not exists, create new record
   */
  async registerDeviceToken(
    dto: RegisterDeviceTokenDto,
    userId: string,
  ): Promise<RegisterDeviceTokenResponseDto> {
    try {
      // Check if device token already exists
      const existingToken = await this.userPushTokenRepository.findByPushToken(
        dto.push_token,
      );

      let result: UserPushToken;

      if (existingToken) {
        // Update existing token with new user_id and other fields
        const updatedToken = await this.userPushTokenRepository.update(
          existingToken.id,
          {
            userid: userId,
            device_os: dto.device_os || existingToken.device_os,
            app_ver: dto.app_ver || existingToken.app_ver,
            module: dto.module || existingToken.module,
          },
        );

        if (!updatedToken) {
          throw new BadRequestException(
            'Failed to update existing device token',
          );
        }

        result = updatedToken;
      } else {
        // Create new device token
        result = await this.userPushTokenRepository.create({
          userid: userId,
          device_os: dto.device_os,
          push_token: dto.push_token,
          app_ver: dto.app_ver,
          module: dto.module,
          registered_date: new Date(),
        });

        if (!result) {
          throw new BadRequestException('Failed to create new device token');
        }
      }

      // Convert to response DTO
      return {
        id: result.id,
        userid: result.userid,
        device_os: result.device_os,
        push_token: result.push_token,
        registered_date: result.registered_date,
        app_ver: result.app_ver,
        module: result.module,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to register device token');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { UserPushToken } from '../../../../domain/user-push-token';
import { UserPushTokenEntity } from '../entities/user-push-token.entity';

@Injectable()
export class UserPushTokenMapper {
  toDomain(entity: UserPushTokenEntity): UserPushToken {
    const userPushToken = new UserPushToken();
    userPushToken.id = entity.id;
    userPushToken.userid = entity.userid;
    userPushToken.device_os = entity.device_os;
    userPushToken.push_token = entity.push_token;
    userPushToken.registered_date = entity.registered_date;
    userPushToken.app_ver = entity.app_ver;
    userPushToken.module = entity.module;
    return userPushToken;
  }

  toEntity(domain: UserPushToken): UserPushTokenEntity {
    const entity = new UserPushTokenEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.userid = domain.userid;
    entity.device_os = domain.device_os;
    entity.push_token = domain.push_token;
    entity.registered_date = domain.registered_date;
    entity.app_ver = domain.app_ver;
    entity.module = domain.module;
    return entity;
  }
}

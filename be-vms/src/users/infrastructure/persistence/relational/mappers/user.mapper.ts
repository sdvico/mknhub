import { Injectable } from '@nestjs/common';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserMapper {
  toDomain(entity: UserEntity): User {
    const user = new User();
    user.id = entity.id;
    user.username = entity.username;
    user.password = entity.password;
    user.state = entity.state;
    user.fullname = entity.fullname;
    user.phone = entity.phone;
    user.agency_id = entity.agency_id;
    user.agent_code = entity.agent_code;
    return user;
  }

  toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    // Chỉ gán id nếu nó tồn tại (trường hợp update)
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.username = domain.username;
    entity.password = domain.password;
    entity.state = domain.state;
    entity.fullname = domain.fullname;
    entity.phone = domain.phone;
    if (domain.agency_id !== undefined)
      entity.agency_id = domain.agency_id as any;
    if (domain.agent_code !== undefined)
      entity.agent_code = domain.agent_code as any;
    return entity;
  }
}

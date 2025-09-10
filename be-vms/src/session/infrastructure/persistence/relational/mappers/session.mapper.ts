import { Injectable } from '@nestjs/common';
import { Session } from '../../../../domain/session';
import { SessionEntity } from '../entities/session.entity';
import { User } from '../../../../../users/domain/user';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class SessionMapper {
  toDomain(entity: SessionEntity): Session {
    const session = new Session();
    session.id = entity.id;
    session.userid = entity.userid;
    session.token = entity.token;
    session.created_date = entity.created_date;
    session.expired_date = entity.expired_date;

    if (entity.user) {
      const user = new User();
      user.id = entity.user.id;
      user.username = entity.user.username;
      user.password = entity.user.password;
      user.state = entity.user.state;
      user.fullname = entity.user.fullname;
      user.phone = entity.user.phone;
      user.agent_code = entity.user.agent_code;
      session.user = user;
    }

    return session;
  }

  toEntity(domain: Session): SessionEntity {
    const entity = new SessionEntity();
    // Chỉ gán id nếu nó tồn tại (trường hợp update)
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.userid = domain.userid;
    entity.token = domain.token;
    entity.created_date = domain.created_date;
    entity.expired_date = domain.expired_date;

    if (domain.user) {
      const userEntity = new UserEntity();
      userEntity.id = domain.user.id;
      userEntity.username = domain.user.username;
      userEntity.password = domain.user.password;
      userEntity.state = domain.user.state;
      userEntity.fullname = domain.user.fullname;
      userEntity.phone = domain.user.phone;
      userEntity.agent_code = domain.user.agent_code;
      entity.user = userEntity;
    }

    return entity;
  }
}

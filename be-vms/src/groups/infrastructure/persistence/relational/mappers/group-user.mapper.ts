import { Injectable } from '@nestjs/common';
import { GroupUser } from '../../../../domain/group-user';
import { GroupUserEntity } from '../entities/group-user.entity';

@Injectable()
export class GroupUserMapper {
  toDomain(entity: GroupUserEntity): GroupUser {
    const groupUser = new GroupUser();
    groupUser.id = entity.id;
    groupUser.userid = entity.userid;
    groupUser.groupid = entity.groupid;
    return groupUser;
  }

  toEntity(domain: GroupUser): GroupUserEntity {
    const entity = new GroupUserEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.userid = domain.userid;
    entity.groupid = domain.groupid;
    return entity;
  }
}

import { Injectable } from '@nestjs/common';
import { Group } from '../../../../domain/group';
import { GroupEntity } from '../entities/group.entity';

@Injectable()
export class GroupMapper {
  toDomain(entity: GroupEntity): Group {
    const group = new Group();
    group.id = entity.id;
    group.name = entity.name;
    return group;
  }

  toEntity(domain: Group): GroupEntity {
    const entity = new GroupEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    return entity;
  }
}

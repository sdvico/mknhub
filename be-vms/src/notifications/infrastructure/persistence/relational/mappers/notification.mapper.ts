import { Injectable } from '@nestjs/common';
import { Notification } from '../../../../domain/notification';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationMapper {
  toDomain(entity: NotificationEntity): Notification {
    return new Notification({
      id: entity.id,
      plateNumber: entity.plateNumber,
      user: entity.user,
      title: entity.title,
      content: entity.content,
      type: entity.type,
      created_at: entity.created_at,
      create_by: entity.create_by,
      update_at: entity.update_at,
      update_by: entity.update_by,
      status: entity.status,
      stype: entity.stype,
      data: entity.data,
    });
  }

  toEntity(domain: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.plateNumber = domain.plateNumber;
    entity.user = domain.user;
    entity.title = domain.title;
    entity.content = domain.content;
    entity.type = domain.type;
    entity.created_at = domain.created_at;
    entity.create_by = domain.create_by;
    entity.update_at = domain.update_at;
    entity.update_by = domain.update_by;
    entity.status = domain.status;
    entity.stype = domain.stype;
    entity.data = domain.data;
    return entity;
  }
}

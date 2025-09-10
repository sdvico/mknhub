import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Notification } from '../../../domain/notification';
import { NotificationMapper } from './mappers/notification.mapper';
import { NullableType } from '../../../../utils/types/nullable.type';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
    private readonly notificationMapper: NotificationMapper,
  ) {}

  async findOne(id: string): Promise<NullableType<Notification>> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.notificationMapper.toDomain(entity) : null;
  }

  async findByUser(
    userId: string,
    page: number,
    limit: number,
    status?: number,
    sortBy: string = 'created_at',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<[Notification[], number]> {
    const query = this.repository
      .createQueryBuilder('notification')
      .leftJoin('Users', 'user', 'notification.user = user.id')
      .where('notification.user = :userId', { userId });

    if (status !== undefined) {
      query.andWhere('notification.status = :status', { status });
    }

    // Sorting với validation
    const allowedSortFields = [
      'id',
      'title',
      'content',
      'status',
      'created_at',
      'update_at',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';

    query
      .orderBy(`notification.${safeSortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await query.getManyAndCount();
    const notifications = entities.map((entity) =>
      this.notificationMapper.toDomain(entity),
    );
    return [notifications, total];
  }

  async save(notification: Partial<Notification>): Promise<Notification> {
    const entity = this.notificationMapper.toEntity(
      notification as Notification,
    );
    const savedEntity = await this.repository.save(entity);
    return this.notificationMapper.toDomain(savedEntity);
  }

  async update(id: string, notification: Partial<Notification>): Promise<void> {
    await this.repository.update(id, notification);
  }

  async countByUser(userId: string, status?: number): Promise<number> {
    const query = this.repository
      .createQueryBuilder('notification')
      .where('notification.user = :userId', { userId });

    if (status !== undefined) {
      query.andWhere('notification.status = :status', { status });
    }

    return query.getCount();
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTypeEntity } from './infrastructure/persistence/relational/entities/notification-type.entity';
import { ShipNotificationEntity } from './infrastructure/persistence/relational/entities/ship-notification.entity';
import {
  CreateNotificationTypeDto,
  UpdateNotificationTypeDto,
} from './dto/create-notification-type.dto';

@Injectable()
export class NotificationTypeService {
  constructor(
    @InjectRepository(NotificationTypeEntity)
    private readonly notificationTypeRepository: Repository<NotificationTypeEntity>,
    @InjectRepository(ShipNotificationEntity)
    private readonly shipNotificationRepository: Repository<ShipNotificationEntity>,
  ) {}

  async findAll(): Promise<NotificationTypeEntity[]> {
    return this.notificationTypeRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  async create(
    createDto: CreateNotificationTypeDto,
  ): Promise<NotificationTypeEntity> {
    // Check if code already exists
    const existing = await this.notificationTypeRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(
        `Notification type with code ${createDto.code} already exists`,
      );
    }

    const notificationType = this.notificationTypeRepository.create(createDto);
    return this.notificationTypeRepository.save(notificationType);
  }

  async update(
    id: string,
    updateDto: UpdateNotificationTypeDto,
  ): Promise<NotificationTypeEntity> {
    const entity = await this.notificationTypeRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Notification type with id ${id} not found`);
    }

    // unique code check if updating code
    if (updateDto.code && updateDto.code !== entity.code) {
      const existing = await this.notificationTypeRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existing) {
        throw new BadRequestException(
          `Notification type with code ${updateDto.code} already exists`,
        );
      }
    }

    Object.assign(entity, updateDto);
    return this.notificationTypeRepository.save(entity);
  }

  async getUnreadCountsByType(
    shipCode: string,
  ): Promise<Record<string, number>> {
    const unreadCounts = await this.shipNotificationRepository
      .createQueryBuilder('sn')
      .select('sn.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('sn.ship_code = :shipCode', { shipCode })
      .andWhere('sn.is_viewed = :isViewed', { isViewed: 0 })
      .groupBy('sn.type')
      .getRawMany();

    return unreadCounts.reduce(
      (acc, { type, count }) => {
        acc[type] = parseInt(count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getAllUnreadCountsByType(): Promise<Record<string, number>> {
    const unreadCounts = await this.shipNotificationRepository
      .createQueryBuilder('sn')
      .select('sn.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('sn.is_viewed = :isViewed', { isViewed: 0 })
      .groupBy('sn.type')
      .getRawMany();

    return unreadCounts.reduce(
      (acc, { type, count }) => {
        acc[type] = parseInt(count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getUnreadCountsByUserPhone(
    userPhone: string,
    shipCode?: string,
  ): Promise<Record<string, number>> {
    const queryBuilder = this.shipNotificationRepository
      .createQueryBuilder('sn')
      .select('sn.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('sn.owner_phone = :userPhone', { userPhone })
      .andWhere('sn.is_viewed = :isViewed', { isViewed: 0 });

    // Nếu có ship_code thì filter thêm
    if (shipCode) {
      queryBuilder.andWhere('sn.ship_code = :shipCode', { shipCode });
    }

    const unreadCounts = await queryBuilder.groupBy('sn.type').getRawMany();

    return unreadCounts.reduce(
      (acc, { type, count }) => {
        acc[type] = parseInt(count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async findOne(id: string): Promise<NotificationTypeEntity> {
    const entity = await this.notificationTypeRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Notification type with id ${id} not found`);
    }
    return entity;
  }
}

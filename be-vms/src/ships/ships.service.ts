import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ShipNotificationEventEntity } from '../notifications/infrastructure/persistence/relational/entities/ship-notification-event.entity';
import { ShipNotificationEntity } from '../notifications/infrastructure/persistence/relational/entities/ship-notification.entity';
import { Report } from '../reports/entities/report.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { SortOrder } from '../utils';
import { NullableType } from '../utils/types/nullable.type';
import { Ship } from './domain/ship';
import { ShipRepository } from './infrastructure/persistence/relational/repositories/ship.repository';

@Injectable()
export class ShipsService {
  constructor(
    private readonly shipRepository: ShipRepository,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(ShipNotificationEntity)
    private readonly shipNotificationRepository: Repository<ShipNotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ShipNotificationEventEntity)
    private readonly shipNotificationEventRepository: Repository<ShipNotificationEventEntity>,
  ) {}

  findById(id: string): Promise<NullableType<Ship>> {
    return this.shipRepository.findById(id);
  }

  async getReportById(id?: string) {
    if (!id) return null;
    return this.reportRepository.findOne({ where: { id } });
  }

  async getShipNotificationById(id?: string) {
    if (!id) return null;
    return this.shipNotificationRepository.findOne({ where: { id } });
  }

  async getUserById(id?: string) {
    if (!id) return null;
    return this.userRepository.findOne({ where: { id } });
  }

  findByPlateNumber(plateNumber: string): Promise<NullableType<Ship>> {
    return this.shipRepository.findByPlateNumber(plateNumber);
  }

  findAll(): Promise<Ship[]> {
    return this.shipRepository.findAll();
  }

  create(data: Omit<Ship, 'id'>): Promise<Ship> {
    return this.shipRepository.create(data);
  }

  update(id: string, payload: Partial<Omit<Ship, 'id'>>): Promise<Ship | null> {
    return this.shipRepository.update(id, payload);
  }

  deleteById(id: string): Promise<void> {
    return this.shipRepository.deleteById(id);
  }

  async findShipsWithPagination(
    userId: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    q?: string,
    keySearch?: string,
    userPhone?: string,
  ): Promise<[Ship[], number]> {
    return this.shipRepository.findShipsWithPagination(
      userId,
      page,
      limit,
      sortBy,
      sortOrder,
      q,
      keySearch,
      userPhone,
    );
  }

  async findShipNotificationsWithPagination(
    userId: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    shipCode?: string,
    q?: string,
    keySearch?: string,
  ): Promise<[any[], number]> {
    return this.shipRepository.findShipNotificationsWithPagination(
      userId,
      page,
      limit,
      sortBy,
      sortOrder,
      shipCode,
      q,
      keySearch,
    );
  }

  getStatistics() {
    return this.shipRepository.getStatistics();
  }

  async findShipsForAdmin(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    q?: string,
    keySearch?: string,
  ): Promise<[any[], number]> {
    return this.shipRepository.findShipsForAdmin(
      page,
      limit,
      sortBy,
      sortOrder,
      q,
      keySearch,
    );
  }

  /**
   * Lấy danh sách events chưa resolve cho một tàu
   */
  async getUnresolvedEventsByShipCode(
    shipCode: string,
  ): Promise<ShipNotificationEventEntity[]> {
    return this.shipNotificationEventRepository.find({
      where: {
        ship_code: shipCode,
        resolved_at: IsNull(),
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * Lấy tất cả events chưa resolve với thông tin tàu
   */
  async getAllUnresolvedEvents(): Promise<any[]> {
    return this.shipNotificationEventRepository
      .createQueryBuilder('event')
      .leftJoin('Ships', 'ship', 'ship.plate_number = event.ship_code')
      .select([
        'event.id',
        'event.ship_code',
        'event.type',
        'event.started_at',
        'event.user_report_time',
        'event.response_minutes_from_6h',
        'event.created_at',
        'ship.plate_number',
        'ship.owner_name',
        'ship.owner_phone',
      ])
      .where('event.resolved_at IS NULL')
      .orderBy('event.created_at', 'DESC')
      .getMany();
  }
}

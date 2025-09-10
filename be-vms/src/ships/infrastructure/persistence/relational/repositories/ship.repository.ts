import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ShipEntity } from '../entities/ship.entity';
import { Ship } from '../../../../domain/ship';
import { ShipMapper } from '../mappers/ship.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SortOrder } from '../../../../../utils';
import { ShipNotificationEntity } from '../../../../../notifications/infrastructure/persistence/relational/entities/ship-notification.entity';
import { Report } from '../../../../../reports/entities/report.entity';

@Injectable()
export class ShipRepository {
  constructor(
    @InjectRepository(ShipEntity)
    private readonly shipRepository: Repository<ShipEntity>,
    @InjectRepository(ShipNotificationEntity)
    private readonly shipNotificationRepository: Repository<ShipNotificationEntity>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly shipMapper: ShipMapper,
  ) {}

  async findById(id: string): Promise<NullableType<Ship>> {
    const entity = await this.shipRepository.findOne({
      where: { id },
      relations: ['lastReport'],
    });
    return entity ? this.shipMapper.toDomain(entity) : null;
  }

  async findByPlateNumber(plateNumber: string): Promise<NullableType<Ship>> {
    const entity = await this.shipRepository.findOne({
      where: { plate_number: plateNumber },
      relations: ['lastReport'],
    });
    return entity ? this.shipMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Ship[]> {
    const entities = await this.shipRepository.find({
      relations: ['lastReport'],
    });
    return entities.map((entity) => this.shipMapper.toDomain(entity));
  }

  async create(data: Omit<Ship, 'id'>): Promise<Ship> {
    const entity = this.shipMapper.toEntity(data as Ship);
    const savedEntity = await this.shipRepository.save(entity);
    return this.shipMapper.toDomain(savedEntity);
  }

  async update(
    id: string,
    payload: Partial<Omit<Ship, 'id'>>,
  ): Promise<Ship | null> {
    const entity = await this.shipRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, payload);
    const updatedEntity = await this.shipRepository.save(entity);
    return this.shipMapper.toDomain(updatedEntity);
  }

  async deleteById(id: string): Promise<void> {
    await this.shipRepository.delete({ id });
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
    const queryBuilder = this.shipRepository.createQueryBuilder('ship');

    // Base filter by user ownership (ownercode OR ownerphone)
    if (userPhone) {
      queryBuilder.where(
        '(ship.ownercode = :userId OR ship.ownerphone = :userPhone)',
        { userId, userPhone },
      );
    } else {
      queryBuilder.where('ship.ownercode = :userId', { userId });
    }

    // Apply search filters
    if (q) {
      queryBuilder.andWhere(
        '(ship.plate_number LIKE :q OR ship.name LIKE :q OR ship.HoHieu LIKE :q)',
        { q: `%${q}%` },
      );
    }

    if (keySearch) {
      queryBuilder.andWhere(`ship.${keySearch} LIKE :keySearch`, {
        keySearch: `%${keySearch}%`,
      });
    }

    // Apply sorting
    const allowedSortFields = [
      'plate_number',
      'name',
      'status',
      'HoHieu',
      'IMO',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'plate_number';
    queryBuilder.orderBy(`ship.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Execute first query: paginated ships with lastReport relation
    const [entities, total] = await queryBuilder
      .leftJoinAndSelect('ship.lastReport', 'lastReport')
      .getManyAndCount();

    if (entities.length === 0) {
      return [[], total];
    }

    // Batch fetch last notifications in a single query
    const lastNotificationIds = entities
      .map((e) => e.last_ship_notification_id)
      .filter((id): id is string => Boolean(id));

    const lastMessagesById: Record<string, ShipNotificationEntity> = {};
    if (lastNotificationIds.length > 0) {
      const lastMessages = await this.shipNotificationRepository.find({
        where: { id: In(lastNotificationIds) },
      });
      for (const msg of lastMessages) {
        lastMessagesById[msg.id] = msg;
      }

      // Batch fetch related reports for those messages that have reports_id
      const reportIds = lastMessages
        .map((m) => m.reports_id)
        .filter((id): id is string => Boolean(id));

      const reportsById: Record<string, Report> = {};
      if (reportIds.length > 0) {
        const relReports = await this.reportRepository
          .createQueryBuilder('r')
          .where('r.id IN (:...ids)', { ids: reportIds })
          .getMany();
        for (const r of relReports) reportsById[r.id] = r as any;

        // attach report to messages map for quick access later
        for (const msg of lastMessages) {
          if (msg.reports_id && reportsById[msg.reports_id]) {
            // no-op; just ensure map available
          }
        }
      }

      // Build final ships array merging data
      const ships: Ship[] = entities.map((entity) => {
        const ship = this.shipMapper.toDomain(entity);
        const msg = entity.last_ship_notification_id
          ? lastMessagesById[entity.last_ship_notification_id]
          : undefined;
        if (msg) {
          const relatedReport = msg.reports_id
            ? reportsById[msg.reports_id]
            : undefined;
          ship.lastmessage = {
            id: msg.id,
            clientReq: msg.clientReq,
            requestId: msg.requestId,
            ship_code: msg.ship_code,
            occurred_at: msg.occurred_at,
            content: msg.content,
            owner_name: msg.owner_name,
            owner_phone: msg.owner_phone,
            type: msg.type,
            status: msg.status,
            boundary_crossed: msg.boundary_crossed,
            boundary_near_warning: msg.boundary_near_warning,
            boundary_status_code: msg.boundary_status_code,
            created_at: msg.created_at,
            updated_at: msg.updated_at,
            report: relatedReport
              ? {
                  id: relatedReport.id,
                  lat: relatedReport.lat as any,
                  lng: relatedReport.lng as any,
                  reported_at: relatedReport.reported_at as any,
                  status: relatedReport.status as any,
                  port_code: relatedReport.port_code as any,
                  description: relatedReport.description as any,
                  created_at: relatedReport.created_at as any,
                  updated_at: relatedReport.updated_at as any,
                }
              : null,
          };
        }
        return ship;
      });

      return [ships, total];
    }

    // If no last notifications, simply map ships
    const ships: Ship[] = entities.map((entity) =>
      this.shipMapper.toDomain(entity),
    );
    return [ships, total];
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
    // First get user's phone
    const userQueryBuilder = this.shipRepository.manager
      .createQueryBuilder()
      .select('u.phone')
      .from('Users', 'u')
      .where('u.id = :userId', { userId });

    const userResult = await userQueryBuilder.getRawOne();
    if (!userResult) {
      return [[], 0];
    }

    const userPhone = userResult.phone;

    // Then get ship notifications for that phone
    const queryBuilder = this.shipRepository.manager
      .createQueryBuilder()
      .select([
        'sn.id',
        'sn.ship_code',
        'sn.occurred_at',
        'sn.content',
        'sn.owner_name',
        'sn.owner_phone',
        'sn.type',
        'sn.status',
        'sn.created_at',
        'sn.updated_at',
        's.plate_number',
        's.name',
        's.HoHieu',
      ])
      .from('ShipNotifications', 'sn')
      .leftJoin('Ships', 's', 's.plate_number = sn.ship_code')
      .where('sn.owner_phone = :userPhone', { userPhone });

    // Apply ship_code filter
    if (shipCode) {
      queryBuilder.andWhere('sn.ship_code = :shipCode', { shipCode });
    }

    // Apply search filters
    if (q) {
      queryBuilder.andWhere(
        '(sn.ship_code LIKE :q OR sn.content LIKE :q OR s.plate_number LIKE :q)',
        { q: `%${q}%` },
      );
    }

    if (keySearch) {
      queryBuilder.andWhere(`sn.${keySearch} LIKE :keySearch`, {
        keySearch: `%${keySearch}%`,
      });
    }

    // Apply sorting
    const allowedSortFields = [
      'occurred_at',
      'created_at',
      'ship_code',
      'type',
      'status',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    queryBuilder.orderBy(`sn.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Execute queries
    return queryBuilder.getManyAndCount();
  }

  async findShipsForAdmin(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    q?: string,
    keySearch?: string,
  ): Promise<[any[], number]> {
    const qb = this.shipRepository.createQueryBuilder('ship');
    console.log('keySearch', keySearch);

    // Search filters
    if (q) {
      qb.andWhere(`(ship.${keySearch} LIKE :q)`, { q: `%${q}%` });
    }

    const allowedSortFields = [
      'plate_number',
      'name',
      'status',
      'HoHieu',
      'IMO',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'plate_number';
    qb.orderBy(`ship.${safeSortBy}`, sortOrder);

    // Pagination
    const offset = (page - 1) * limit;
    qb.skip(offset).take(limit);

    // Fetch paginated ships with lastReport
    const [entities, total] = await qb
      .leftJoinAndSelect('ship.lastReport', 'lastReport')
      .getManyAndCount();

    if (entities.length === 0) return [[], total];

    // Batch fetch last notifications
    const lastNotificationIds = entities
      .map((e) => e.last_ship_notification_id)
      .filter((id): id is string => Boolean(id));

    const lastMessagesById: Record<string, ShipNotificationEntity> = {};
    if (lastNotificationIds.length > 0) {
      const lastMessages = await this.shipNotificationRepository.find({
        where: { id: In(lastNotificationIds) },
      });
      for (const msg of lastMessages) lastMessagesById[msg.id] = msg;
    }

    // Batch fetch owners (users) by ownercode
    const ownerIds = entities
      .map((e) => e.ownercode)
      .filter((id): id is string => Boolean(id));

    const owners: Record<
      string,
      { id: string; username: string; fullname: string; phone: string }
    > = {};
    if (ownerIds.length > 0) {
      const rows = await this.shipRepository.manager
        .createQueryBuilder()
        .select(['u.id', 'u.username', 'u.fullname', 'u.phone'])
        .from('Users', 'u')
        .where('u.id IN (:...ids)', { ids: ownerIds })
        .getRawMany<{
          id: string;
          username: string;
          fullname: string;
          phone: string;
        }>();
      for (const r of rows) owners[r.id] = r;
    }

    // Batch fetch unresolved events by ship_code
    const shipCodes = entities.map((e) => e.plate_number);
    const unresolvedEventsByShip: Record<string, any[]> = {};
    if (shipCodes.length > 0) {
      const events = await this.shipRepository.manager
        .createQueryBuilder()
        .select([
          'event.id',
          'event.ship_code',
          'event.type',
          'event.started_at',
          'event.user_report_time',
          'event.response_minutes_from_6h',
          'event.created_at',
        ])
        .from('ShipNotificationEvents', 'event')
        .where('event.ship_code IN (:...shipCodes)', { shipCodes })
        .andWhere('event.resolved_at IS NULL')
        .orderBy('event.created_at', 'DESC')
        .getRawMany();

      // Group events by ship_code
      for (const event of events) {
        if (!unresolvedEventsByShip[event.event_ship_code]) {
          unresolvedEventsByShip[event.event_ship_code] = [];
        }
        unresolvedEventsByShip[event.event_ship_code].push({
          id: event.event_id,
          ship_code: event.event_ship_code,
          type: event.event_type,
          started_at: event.event_started_at,
          user_report_time: event.event_user_report_time,
          response_minutes_from_6h: event.event_response_minutes_from_6h,
          created_at: event.event_created_at,
        });
      }
    }

    const ships = entities.map((entity) => {
      const domain = this.shipMapper.toDomain(entity);
      const msg = entity.last_ship_notification_id
        ? lastMessagesById[entity.last_ship_notification_id]
        : undefined;
      const owner = entity.ownercode ? owners[entity.ownercode] : undefined;
      const unresolvedEvents =
        unresolvedEventsByShip[entity.plate_number] || [];

      const result: any = domain;
      if (msg) {
        result.lastmessage = {
          id: msg.id,
          clientReq: msg.clientReq,
          requestId: msg.requestId,
          ship_code: msg.ship_code,
          occurred_at: msg.occurred_at,
          content: msg.content,
          owner_name: msg.owner_name,
          owner_phone: msg.owner_phone,
          type: msg.type,
          status: msg.status,
          boundary_crossed: msg.boundary_crossed,
          boundary_near_warning: msg.boundary_near_warning,
          boundary_status_code: msg.boundary_status_code,
          created_at: msg.created_at,
          updated_at: msg.updated_at,
        };
      }
      if (owner) {
        result.owner = owner;
      }

      // Add unresolved events
      result.unresolved_events = unresolvedEvents;
      result.unresolved_events_count = unresolvedEvents.length;

      return result;
    });

    return [ships, total];
  }

  async getStatistics(): Promise<{
    total: number;
    disconnected_mkn: number;
    connected: number;
    with_owner_no_push_token: number;
  }> {
    const manager = this.shipRepository.manager;

    const totalPromise = this.shipRepository
      .createQueryBuilder('s')
      .select('COUNT(1)', 'count')
      .getRawOne<{ count: string }>();

    const disconnectedMknPromise = this.shipRepository
      .createQueryBuilder('s')
      .innerJoin(
        'ShipNotifications',
        'sn',
        'sn.id = s.last_ship_notification_id',
      )
      .where("sn.type LIKE 'MKN_%'")
      .andWhere("s.status <> 'CONNECTED'")
      .select('COUNT(1)', 'count')
      .getRawOne<{ count: string }>();

    const connectedPromise = this.shipRepository
      .createQueryBuilder('s')
      .where("s.status = 'CONNECTED'")
      .select('COUNT(1)', 'count')
      .getRawOne<{ count: string }>();

    const withOwnerNoPushTokenPromise = manager
      .createQueryBuilder()
      .from('Ships', 's')
      .leftJoin('UserPushTokens', 'upt', 'upt.userid = s.ownercode')
      .where('s.ownercode IS NOT NULL')
      .andWhere('upt.id IS NULL')
      .select('COUNT(1)', 'count')
      .getRawOne<{ count: string }>();

    const [totalRaw, disMknRaw, connectedRaw, noPushRaw] = await Promise.all([
      totalPromise,
      disconnectedMknPromise,
      connectedPromise,
      withOwnerNoPushTokenPromise,
    ]);

    return {
      total: parseInt(totalRaw?.count || '0', 10),
      disconnected_mkn: parseInt(disMknRaw?.count || '0', 10),
      connected: parseInt(connectedRaw?.count || '0', 10),
      with_owner_no_push_token: parseInt(noPushRaw?.count || '0', 10),
    };
  }
}

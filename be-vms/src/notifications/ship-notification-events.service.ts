import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';
import {
  EventListItemDto,
  EventListQueryDto,
  EventListResponseDto,
} from './dto/event-list.dto';
import { ShipNotificationEventEntity } from './infrastructure/persistence/relational/entities/ship-notification-event.entity';

@Injectable()
export class ShipNotificationEventsService {
  constructor(
    @InjectRepository(ShipNotificationEventEntity)
    private readonly eventRepository: Repository<ShipNotificationEventEntity>,
  ) {}

  async getStats(query: { from?: string; to?: string; ship_code?: string }) {
    const where: any = {};
    if (query.ship_code) where.ship_code = query.ship_code;
    if (query.from || query.to) {
      const from = query.from ? new Date(query.from) : undefined;
      const to = query.to ? new Date(query.to) : undefined;
      if (from && to) where.created_at = Between(from, to);
      else if (from) where.created_at = Between(from, new Date());
      else if (to) where.created_at = Between(new Date(0), to);
    }

    const [total, open, resolved] = await Promise.all([
      this.eventRepository.count({ where }),
      this.eventRepository.count({
        where: { ...where, resolved_at: IsNull() },
      }),
      this.eventRepository.count({
        where: { ...where, resolved_at: Not(IsNull()) },
      }),
    ]);

    // Boundary
    const [boundary_near, boundary_crossed] = await Promise.all([
      this.eventRepository.count({
        where: { ...where, type: 'BOUNDARY_NEAR' },
      }),
      this.eventRepository.count({
        where: { ...where, type: 'BOUNDARY_CROSSED' },
      }),
    ]);

    // MKN by type
    const mknTypes = ['MKN_2H', 'MKN_5H', 'MKN_6H', 'MKN_8D', 'MKN_10D'];
    const mknCounts = await Promise.all(
      mknTypes.map((code) =>
        this.eventRepository.count({ where: { ...where, type: code } }),
      ),
    );

    const mkn_by_type = mknTypes.reduce<Record<string, number>>(
      (acc, code, idx) => {
        acc[code] = mknCounts[idx];
        return acc;
      },
      {},
    );

    const mkn_total = mknCounts.reduce((a, b) => a + b, 0);

    return {
      total,
      mkn_total,
      mkn_by_type,
      boundary_near,
      boundary_crossed,
      open,
      resolved,
    };
  }

  async getUnresolvedEvents(
    query: EventListQueryDto,
  ): Promise<EventListResponseDto> {
    const {
      page = 1,
      limit = 10,
      ship_code,
      type,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .where('event.resolved_at IS NULL');

    // Apply filters
    if (ship_code) {
      queryBuilder.andWhere('event.ship_code LIKE :ship_code', {
        ship_code: `%${ship_code}%`,
      });
    }

    if (type) {
      queryBuilder.andWhere('event.type = :type', { type });
    }

    // Apply sorting
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'started_at',
      'ship_code',
      'type',
      'response_minutes_from_6h',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    queryBuilder.orderBy(`event.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    // Transform events to DTOs
    const data: EventListItemDto[] = events.map((event) => {
      const now = new Date();
      const startedAt = event.started_at || event.created_at;
      const durationMinutes = Math.floor(
        (now.getTime() - startedAt.getTime()) / (1000 * 60),
      );

      return {
        id: event.id,
        ship_code: event.ship_code,
        user_report_time: event.user_report_time,
        type: event.type,
        started_at: event.started_at,
        resolved_at: event.resolved_at,
        response_minutes_from_6h: event.response_minutes_from_6h,
        created_at: event.created_at,
        updated_at: event.updated_at,
        duration_minutes: durationMinutes,
        is_resolved: !!event.resolved_at,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getAllEvents(query: EventListQueryDto): Promise<EventListResponseDto> {
    const {
      page = 1,
      limit = 10,
      ship_code,
      type,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    // Apply filters
    if (ship_code) {
      queryBuilder.andWhere('event.ship_code LIKE :ship_code', {
        ship_code: `%${ship_code}%`,
      });
    }

    if (type) {
      queryBuilder.andWhere('event.type = :type', { type });
    }

    // Apply sorting
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'started_at',
      'ship_code',
      'type',
      'response_minutes_from_6h',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    queryBuilder.orderBy(`event.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    // Transform events to DTOs
    const data: EventListItemDto[] = events.map((event) => {
      const now = new Date();
      const startedAt = event.started_at || event.created_at;
      const durationMinutes = event.resolved_at
        ? Math.floor(
            (event.resolved_at.getTime() - startedAt.getTime()) / (1000 * 60),
          )
        : Math.floor((now.getTime() - startedAt.getTime()) / (1000 * 60));

      return {
        id: event.id,
        ship_code: event.ship_code,
        user_report_time: event.user_report_time,
        type: event.type,
        started_at: event.started_at,
        resolved_at: event.resolved_at,
        response_minutes_from_6h: event.response_minutes_from_6h,
        created_at: event.created_at,
        updated_at: event.updated_at,
        duration_minutes: durationMinutes,
        is_resolved: !!event.resolved_at,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

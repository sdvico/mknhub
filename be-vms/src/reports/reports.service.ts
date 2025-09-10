import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SortOrder } from '../utils';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report, ReportStatus } from './entities/report.entity';
import { Port } from './entities/port.entity';
import { ShipNotificationUpdateService } from './ship-notification-update.service';
import { ShipNotificationEventEntity } from '../notifications/infrastructure/persistence/relational/entities/ship-notification-event.entity';
import { CreatePortDto } from './dto/create-port.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Port)
    private readonly portRepository: Repository<Port>,
    private readonly shipNotificationUpdateService: ShipNotificationUpdateService,
    @InjectRepository(ShipNotificationEventEntity)
    private readonly eventRepository: Repository<ShipNotificationEventEntity>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    userId: string,
    shipNotificationId?: string,
  ): Promise<Report> {
    // Always use the authenticated user's ID
    createReportDto.reporter_user_id = userId;

    // Normalize and validate port_code FK
    const rawPortCode = (createReportDto.port_code ?? '').trim();
    if (!rawPortCode) {
      createReportDto.port_code = null as any;
    } else {
      const portExists = await this.portRepository.findOne({
        where: { code: rawPortCode },
      });
      createReportDto.port_code = portExists ? rawPortCode : (null as any);
    }

    const report = this.reportRepository.create({
      ...createReportDto,
      reporter_user_id: userId,
      reported_at: new Date(createReportDto.reported_at),
      status: createReportDto.status || ReportStatus.PENDING,
    });

    const savedReport = await this.reportRepository.save(report);

    // If linked to a ship notification with an open event, close the event and set report time
    try {
      if (shipNotificationId) {
        const notif = await this.reportRepository.manager
          .createQueryBuilder()
          .select(['sn.id', 'sn.event_id', 'sn.ship_code'])
          .from('ShipNotifications', 'sn')
          .where('sn.id = :id', { id: shipNotificationId })
          .getRawOne<{
            sn_id: string;
            sn_event_id: string;
            sn_ship_code: string;
          }>();

        const eventId = (notif as any)?.sn_event_id as string | null;
        if (eventId) {
          const openEvent = await this.eventRepository.findOne({
            where: { id: eventId },
          });
          if (openEvent && !openEvent.resolved_at) {
            openEvent.user_report_time = new Date(createReportDto.reported_at);
            if (openEvent.started_at && openEvent.user_report_time) {
              const diffMs =
                new Date(openEvent.user_report_time).getTime() -
                new Date(openEvent.started_at).getTime();
              openEvent.response_minutes_from_6h = Math.max(
                0,
                Math.round(diffMs / 60000),
              );
            }
            openEvent.resolved_at = new Date();
            await this.eventRepository.save(openEvent);
          }
        }
      }
    } catch {
      // Best-effort; do not block report creation
    }

    // Update ship notification and ship's last_report_id if ID is provided
    if (shipNotificationId) {
      await this.shipNotificationUpdateService.updateReportId(
        shipNotificationId,
        savedReport.id,
      );

      // Get ship_code from notification and update ship's last_report_id
      const shipCode =
        await this.shipNotificationUpdateService.getShipCodeFromNotification(
          shipNotificationId,
        );

      if (shipCode) {
        await this.shipNotificationUpdateService.updateShipLastReportId(
          shipCode,
          savedReport.id,
        );
      }
    }

    return savedReport;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: ReportStatus,
    reporter_user_id?: string,
    reporter_ship_id?: string,
  ): Promise<{ data: Report[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reporter_user', 'reporter_user')
      .leftJoinAndSelect('report.reporter_ship', 'reporter_ship')
      .orderBy('report.reported_at', 'DESC');

    if (status) {
      queryBuilder.andWhere('report.status = :status', { status });
    }

    if (reporter_user_id) {
      queryBuilder.andWhere('report.reporter_user_id = :reporter_user_id', {
        reporter_user_id,
      });
    }

    if (reporter_ship_id) {
      queryBuilder.andWhere('report.reporter_ship_id = :reporter_ship_id', {
        reporter_ship_id,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['reporter_user', 'reporter_ship'],
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);

    if (updateReportDto.reported_at) {
      updateReportDto.reported_at = new Date(
        updateReportDto.reported_at,
      ) as any;
    }

    // Normalize and validate port_code on update
    if (
      Object.prototype.hasOwnProperty.call(updateReportDto as any, 'port_code')
    ) {
      const rawPortCode = (
        ((updateReportDto as any).port_code ?? '') as string
      ).trim();
      if (!rawPortCode) {
        (updateReportDto as any).port_code = null;
      } else {
        const portExists = await this.portRepository.findOne({
          where: { code: rawPortCode },
        });
        (updateReportDto as any).port_code = portExists ? rawPortCode : null;
      }
    }

    Object.assign(report, updateReportDto);
    return await this.reportRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    const report = await this.findOne(id);
    await this.reportRepository.remove(report);
  }

  async updateStatus(id: string, status: ReportStatus): Promise<Report> {
    const report = await this.findOne(id);
    report.status = status;
    return await this.reportRepository.save(report);
  }

  async getReportsByLocation(
    lat: number,
    lng: number,
    radius: number = 10, // km
    limit: number = 50,
  ): Promise<Report[]> {
    // Simple distance calculation using Haversine formula
    const query = `
      SELECT *, 
        (6371 * acos(cos(radians(@0)) * cos(radians(lat)) * 
         cos(radians(lng) - radians(@1)) + sin(radians(@0)) * 
         sin(radians(lat)))) AS distance
      FROM Reports 
      HAVING distance < @2
      ORDER BY distance
      OFFSET 0 ROWS FETCH NEXT @3 ROWS ONLY
    `;

    return await this.reportRepository.query(query, [lat, lng, radius, limit]);
  }

  async findReportsWithPagination(
    userId: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    status?: ReportStatus,
    q?: string,
    keySearch?: string,
    shipId?: string,
  ): Promise<[any[], number]> {
    const queryBuilder = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reporter_user', 'reporter_user')
      .leftJoinAndSelect('report.reporter_ship', 'reporter_ship');

    // Optional filter by userId
    if (userId) {
      queryBuilder.andWhere('report.reporter_user_id = :userId', { userId });
    }

    // Filters
    if (status) {
      queryBuilder.andWhere('report.status = :status', { status });
    }
    if (shipId) {
      queryBuilder.andWhere('report.reporter_ship_id = :shipId', { shipId });
    }
    if (q && keySearch == 'ship_code') {
      queryBuilder.andWhere('reporter_ship.plate_number LIKE :shipCode', {
        shipCode: `%${q}%`,
      });
    } else if (q) {
      queryBuilder.andWhere(
        '(report.description LIKE :q OR report.port_code LIKE :q OR reporter_ship.plate_number LIKE :q)',
        { q: `%${q}%` },
      );
    }

    // Sorting
    const allowedSortFields = [
      'reported_at',
      'created_at',
      'status',
      'port_code',
      'lat',
      'lng',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'reported_at';
    queryBuilder.orderBy(`report.${safeSortBy}`, sortOrder);

    // Pagination in DB
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // First query: get paginated reports with relations
    const [reports, total] = await queryBuilder.getManyAndCount();

    // Early return if no reports
    if (reports.length === 0) {
      return [[], total];
    }

    // Second query: get all ship notifications for these reports in one go
    const reportIds = reports.map((r) => r.id);
    const rawNotifications = await this.reportRepository.manager
      .createQueryBuilder()
      .select([
        'sn.id',
        'sn.reports_id',
        'sn.ship_code',
        'sn.occurred_at',
        'sn.content',
        'sn.owner_name',
        'sn.owner_phone',
        'sn.type',
        'sn.status',
        'sn.created_at',
        'sn.updated_at',
      ])
      .from('ShipNotifications', 'sn')
      .where('sn.reports_id IN (:...ids)', { ids: reportIds })
      .orderBy('sn.occurred_at', 'DESC')
      .getRawMany();

    // Group notifications by report id (using aliases sn_* from raw selection)
    const notificationsByReport: Record<string, any[]> = {};
    for (const row of rawNotifications as any[]) {
      const reportId = row.sn_reports_id as string;
      const formatted = {
        id: row.sn_id,
        ship_code: row.sn_ship_code,
        occurred_at: row.sn_occurred_at,
        content: row.sn_content,
        owner_name: row.sn_owner_name,
        owner_phone: row.sn_owner_phone,
        type: row.sn_type,
        status: row.sn_status,
        created_at: row.sn_created_at,
        updated_at: row.sn_updated_at,
      };
      if (!notificationsByReport[reportId])
        notificationsByReport[reportId] = [];
      notificationsByReport[reportId].push(formatted);
    }

    // Merge using a single pass
    const reportsWithNotifications = reports.map((report) => ({
      id: report.id,
      lat: report.lat,
      lng: report.lng,
      reported_at: report.reported_at,
      source: report.source,
      status: report.status,
      port_code: report.port_code,
      description: report.description,
      created_at: report.created_at,
      updated_at: report.updated_at,
      reporter_user: report.reporter_user
        ? {
            id: report.reporter_user.id,
            username: report.reporter_user.username,
            fullname: report.reporter_user.fullname,
            phone: report.reporter_user.phone,
          }
        : null,
      reporter_ship: report.reporter_ship
        ? {
            id: report.reporter_ship.id,
            plate_number: report.reporter_ship.plate_number,
            name: report.reporter_ship.name,
            HoHieu: report.reporter_ship.HoHieu,
          }
        : null,
      ship_notifications: notificationsByReport[report.id] || [],
    }));

    return [reportsWithNotifications, total];
  }

  async findPortsWithPagination(
    page: number = 1,
    limit: number = 150,
    q?: string,
  ): Promise<[Port[], number]> {
    const queryBuilder = this.portRepository
      .createQueryBuilder('port')
      .orderBy('port.name', 'ASC');

    if (q) {
      queryBuilder.andWhere(
        '(port.code LIKE :q OR port.name LIKE :q OR port.address LIKE :q)',
        { q: `%${q}%` },
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return [entities, total];
  }

  async createOrUpdatePort(dto: CreatePortDto): Promise<Port> {
    const existing = await this.portRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      Object.assign(existing, dto);
      return this.portRepository.save(existing);
    }
    const entity = this.portRepository.create(dto as Partial<Port>);
    return this.portRepository.save(entity as Port);
  }

  async getReportStatsByStatus(
    from?: string,
    to?: string,
    ship_code?: string,
  ): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    let query = this.reportRepository
      .createQueryBuilder('r')
      .leftJoin('ShipNotifications', 'sn', 'sn.reports_id = r.id')
      .select([
        'COUNT(*) as total',
        "SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending",
        "SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END) as approved",
        "SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END) as rejected",
      ]);

    if (from) {
      query = query.andWhere('r.reported_at >= :from', {
        from: new Date(from),
      });
    }

    if (to) {
      query = query.andWhere('r.reported_at <= :to', { to: new Date(to) });
    }

    if (ship_code) {
      query = query.andWhere('sn.ship_code = :ship_code', { ship_code });
    }

    const result = await query.getRawOne();

    return {
      total: parseInt(result.total) || 0,
      pending: parseInt(result.pending) || 0,
      approved: parseInt(result.approved) || 0,
      rejected: parseInt(result.rejected) || 0,
    };
  }

  async getReportStatsByNotificationType(
    from?: string,
    to?: string,
    ship_code?: string,
  ): Promise<{
    total: number;
    by_type: Record<string, number>;
  }> {
    let query = this.reportRepository
      .createQueryBuilder('r')
      .leftJoin('ShipNotifications', 'sn', 'sn.reports_id = r.id')
      .select([
        'COUNT(*) as total',
        'sn.type as notification_type',
        'COUNT(sn.type) as count_by_type',
      ])
      .where('sn.type IS NOT NULL')
      .groupBy('sn.type');

    if (from) {
      query = query.andWhere('r.reported_at >= :from', {
        from: new Date(from),
      });
    }

    if (to) {
      query = query.andWhere('r.reported_at <= :to', { to: new Date(to) });
    }

    if (ship_code) {
      query = query.andWhere('sn.ship_code = :ship_code', { ship_code });
    }

    const results = await query.getRawMany();

    const by_type: Record<string, number> = {};
    let total = 0;

    results.forEach((row) => {
      const type = row.notification_type;
      const count = parseInt(row.count_by_type) || 0;
      by_type[type] = count;
      total += count;
    });

    return {
      total,
      by_type,
    };
  }

  async getNotificationViewStats(
    from?: string,
    to?: string,
    ship_code?: string,
  ): Promise<{
    total: number;
    viewed: number;
    unviewed: number;
    view_rate: number;
  }> {
    let query = this.reportRepository
      .createQueryBuilder('r')
      .leftJoin('ShipNotifications', 'sn', 'sn.reports_id = r.id')
      .select([
        'COUNT(*) as total',
        'SUM(CASE WHEN sn.is_viewed = 1 THEN 1 ELSE 0 END) as viewed',
        'SUM(CASE WHEN sn.is_viewed = 0 OR sn.is_viewed IS NULL THEN 1 ELSE 0 END) as unviewed',
      ]);

    if (from) {
      query = query.andWhere('sn.created_at >= :from', {
        from: new Date(from),
      });
    }

    if (to) {
      query = query.andWhere('sn.created_at <= :to', {
        to: new Date(to),
      });
    }

    if (ship_code) {
      query = query.andWhere('sn.ship_code = :ship_code', { ship_code });
    }

    const result = await query.getRawOne();

    const total = parseInt(result.total) || 0;
    const viewed = parseInt(result.viewed) || 0;
    const unviewed = parseInt(result.unviewed) || 0;
    const view_rate =
      total > 0 ? Math.round((viewed / total) * 100 * 100) / 100 : 0; // Round to 2 decimal places

    return {
      total,
      viewed,
      unviewed,
      view_rate,
    };
  }
}

import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { Report } from '../reports';
import {
  ShipEntity,
  ShipStatus,
} from '../ships/infrastructure/persistence/relational/entities/ship.entity';
import { User } from '../users/domain/user';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { SortOrder } from '../utils';
import {
  SendShipNotificationDto,
  ShipNotificationResponseDto,
  ShipNotificationStatusResponseDto,
} from './dto/ship-notification.dto';
import {
  LogType,
  ShipNotificationLogEntity,
} from './infrastructure/persistence/relational/entities/ship-notification-log.entity';
import {
  ShipNotificationEntity,
  ShipNotificationStatus,
  ShipNotificationType,
} from './infrastructure/persistence/relational/entities/ship-notification.entity';
import { ShipNotificationEventEntity } from './infrastructure/persistence/relational/entities/ship-notification-event.entity';
import { ShipNotificationTaskService } from './ship-notification-task.service';
import * as crypto from 'crypto';

@Injectable()
export class ShipNotificationService {
  constructor(
    @InjectRepository(ShipNotificationEntity)
    private readonly shipNotificationRepository: Repository<ShipNotificationEntity>,
    @InjectRepository(ShipNotificationLogEntity)
    private readonly shipNotificationLogRepository: Repository<ShipNotificationLogEntity>,
    @InjectRepository(ShipEntity)
    private readonly shipRepository: Repository<ShipEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
    @InjectRepository(ShipNotificationEventEntity)
    private readonly eventRepository: Repository<ShipNotificationEventEntity>,
    @Inject(forwardRef(() => ShipNotificationTaskService))
    private readonly shipNotificationTaskService: ShipNotificationTaskService,
  ) {}

  private async getNotificationTypeByCode(
    code: string,
  ): Promise<{ priority?: number } | null> {
    if (!code) return null;
    const row = await this.shipNotificationRepository.query(
      `SELECT TOP 1 priority FROM "NotificationTypes" WHERE code = @0`,
      [code],
    );
    return row?.[0] || null;
  }

  async sendShipNotification(
    dto: SendShipNotificationDto,
    currentUser: User,
    isImport: boolean,
  ): Promise<ShipNotificationResponseDto> {
    // console.log('currentUser', currentUser);

    // Tạo log duy nhất cho request (với shipNotificationId ban đầu là null)
    const tempLog = await this.createLog(
      null, // shipNotificationId ban đầu là null, sẽ cập nhật sau
      dto.clientReq,
      LogType.REQUEST,
      '/v1/ship-notifications/send',
      'POST',
      JSON.stringify(dto),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );

    try {
      // Kiểm tra hoặc tạo user dựa trên owner_phone
      let user = await this.findUserByPhone(dto.owner_phone);
      if (!user) {
        user = await this.createUser(dto.owner_name, dto.owner_phone);
      }

      // Kiểm tra agent_code nếu có truyền
      if (
        dto.agent_code &&
        currentUser &&
        currentUser?.agent_code != dto.agent_code &&
        !isImport
      ) {
        await this.updateLogWithError(
          tempLog.id,
          '403',
          'Agent code does not match user agency',
          Date.now() - tempLog.created_at.getTime(),
        );
        throw new Error('Agent code does not match user agency');
      }

      // Kiểm tra hoặc tạo ship dựa trên ship_code
      let ship = await this.shipRepository.findOne({
        where: { plate_number: dto.ship_code },
      });

      if (!ship) {
        ship = await this.createShip(dto.ship_code, dto.owner_phone);
      }
      // Cập nhật ownercode và ownerphone nếu chưa có
      // console.log('user----', ship.ownercode, user);
      let needUpdate = false;
      if (!ship.ownercode && user) {
        ship.ownercode = user.id;
        needUpdate = true;
      }
      if (!ship.ownerphone && dto.owner_phone) {
        ship.ownerphone = dto.owner_phone;
        needUpdate = true;
      }

      if (needUpdate) {
        await this.shipRepository.save(ship);
      }

      // Xác định trạng thái ban đầu (DUPLICATE hoặc QUEUED) trước khi lưu
      let initialStatus: ShipNotificationStatus = ShipNotificationStatus.QUEUED;

      const lastIdPre = ship.last_ship_notification_id;

      const typeInfoForPriority = await this.getNotificationTypeByCode(
        dto.type,
      );

      //th mất kết nối mới check lại có phải là duplicate không
      if (lastIdPre && dto.type.startsWith('MKN_')) {
        const lastNotifPre = await this.shipNotificationRepository.findOne({
          where: { id: lastIdPre },
        });
        if (lastNotifPre && lastNotifPre.type === dto.type) {
          initialStatus = ShipNotificationStatus.DUPLICATE;
        } else {
          const previousTypePre = await this.getNotificationTypeByCode(
            lastNotifPre?.type || '',
          );
          const currentPriorityPre = typeInfoForPriority?.priority ?? 0;
          const previousPriorityPre = previousTypePre?.priority ?? 0;
          if (
            currentPriorityPre <= previousPriorityPre &&
            dto.type.startsWith('MKN_') &&
            lastNotifPre?.type.startsWith('MKN_')
          ) {
            initialStatus = ShipNotificationStatus.DUPLICATE;
          }
        }
      }

      // Tạo ship notification với trạng thái đã xác định
      // Lấy priority từ NotificationTypes (ưu tiên dùng dto.priority nếu có)
      const resolvedPriority =
        (dto as any)?.priority ?? typeInfoForPriority?.priority ?? null;

      const shipNotification = this.shipNotificationRepository.create({
        clientReq: dto.clientReq,
        // requestId sẽ được database tự động generate với NEWID()
        ship_code: dto.ship_code,
        occurred_at: new Date(dto.occurred_at),
        content: dto.content,
        owner_name: dto.owner_name,
        owner_phone: dto.owner_phone,
        type: dto.type,
        status: initialStatus,
        priority: resolvedPriority as any,
        lat: dto.lat,
        lng: dto.lng,
        agent_code: dto.agent_code,
        boundary_crossed: (dto as any)?.boundary_status_code === '3' || false,
        boundary_near_warning:
          (dto as any)?.boundary_status_code === '2' || false,
        // TypeORM sẽ tự động xử lý created_at và updated_at
      });

      // Save để lấy ID và các giá trị được generate tự động
      const savedNotification =
        await this.shipNotificationRepository.save(shipNotification);

      // Kiểm tra nếu save thành công
      if (!savedNotification) {
        // Cập nhật log với error
        await this.updateLogWithError(
          tempLog.id,
          '500',
          'Failed to save ship notification',
          Date.now() - tempLog.created_at.getTime(),
        );
        throw new Error('Failed to save ship notification');
      }

      // Tạo/ghi nhận Event khi có MKN_ (chỉ khi không phải DUPLICATE)
      if (
        shipNotification.status !== ShipNotificationStatus.DUPLICATE &&
        dto.type &&
        dto.type.startsWith('MKN_')
      ) {
        // Tìm event đang mở theo ship_code và type bắt đầu bằng MKN_
        let openEvent = await this.eventRepository.findOne({
          where: {
            ship_code: dto.ship_code,
            resolved_at: null as any,
            type: Like('MKN_%'),
          },
          order: { created_at: 'DESC' },
        });

        if (!openEvent) {
          // Bắt đầu event tại mốcđầu tiên
          openEvent = this.eventRepository.create({
            ship_code: dto.ship_code,
            type: dto.type,
            started_at: new Date(dto.occurred_at),
          });
        }

        // Cập nhật type cuối cùng của event
        openEvent.type = dto.type;
        await this.eventRepository.save(openEvent);

        if (openEvent) {
          // Liên kết notification với event
          savedNotification.event_id = openEvent.id;
          await this.shipNotificationRepository.save(savedNotification);
        }
      }

      //NEAR_BORDER  //CROSS_BODER
      // Boundary event logic: use boundary_status_code (2 = NEAR, 3 = CROSSED)
      if (shipNotification.status !== ShipNotificationStatus.DUPLICATE) {
        const code = (dto as any)?.boundary_status_code;
        if (code === '2' || code === '3') {
          const boundaryType =
            code === '3' ? 'BOUNDARY_CROSSED' : 'BOUNDARY_NEAR';
          const boundaryEvent = await this.eventRepository.save(
            this.eventRepository.create({
              ship_code: dto.ship_code,
              type: boundaryType,
              started_at: new Date(dto.occurred_at),
            }),
          );

          savedNotification.boundary_event_id = boundaryEvent.id;

          await this.shipNotificationRepository.save(savedNotification);

          // Tạo thêm notification cho boundary event
          const boundaryNotificationType =
            code === '3'
              ? ShipNotificationType.CROSS_BORDER
              : ShipNotificationType.NEAR_BORDER;

          const boundaryNotification =
            await this.shipNotificationRepository.save(
              this.shipNotificationRepository.create({
                clientReq: crypto.randomUUID
                  ? crypto.randomUUID()
                  : `${Date.now()}-${Math.random()}`,
                requestId: crypto.randomUUID
                  ? crypto.randomUUID()
                  : `${Date.now()}-${Math.random()}`,
                ship_code: dto.ship_code,
                occurred_at: new Date(dto.occurred_at),
                content:
                  code === '3'
                    ? `Tàu ${dto.ship_code} đã vượt biên tại ${dto.lat}, ${dto.lng}`
                    : `Tàu ${dto.ship_code} đang ở gần biên tại ${dto.lat}, ${dto.lng}`,
                owner_name: dto.owner_name,
                owner_phone: dto.owner_phone,
                type: boundaryNotificationType,
                lat: dto.lat,
                lng: dto.lng,
                agent_code: dto.agent_code,
                status: ShipNotificationStatus.QUEUED,
                boundary_event_id: boundaryEvent.id,
                boundary_crossed: code === '3',
                boundary_near_warning: code === '2',
                boundary_status_code: code,
              }),
            );

          // Gửi notification boundary ngay lập tức
          try {
            await this.shipNotificationTaskService.processShipNotification(
              boundaryNotification,
            );
          } catch (error) {
            console.error(
              `Failed to process boundary notification: ${error.message}`,
            );
          }
        }
      }

      // Đóng tất cả event đang mở khi nhận thông báo kết nối lại (KNL)
      if (dto.type === 'KNL') {
        const openEvents = await this.eventRepository.find({
          where: { ship_code: dto.ship_code, resolved_at: IsNull() },
        });
        if (openEvents && openEvents.length > 0) {
          for (const ev of openEvents) {
            ev.resolved_at = new Date(dto.occurred_at);
          }
          await this.eventRepository.save(openEvents);
        }
      }

      // Cập nhật ship status/last notification chỉ khi KHÔNG duplicate
      if (shipNotification.status !== ShipNotificationStatus.DUPLICATE) {
        const lastId = ship.last_ship_notification_id;
        if (lastId) {
          ship.last_ship_notification_id = savedNotification.id;
        } else {
          ship.last_ship_notification_id = savedNotification.id;
        }
        if (dto.type.startsWith('MKN_')) {
          ship.status = ShipStatus.DISCONNECTED;
        } else if (dto.type === 'KNL') {
          ship.status = ShipStatus.CONNECTED;
        }
        await this.shipRepository.save(ship);
      }

      // Cập nhật log với shipNotificationId thật
      await this.updateLogWithShipNotificationId(
        tempLog.id,
        savedNotification.id,
      );

      // TODO: Implement logic to send notification to ship owner devices
      // This would involve finding devices associated with the ship owner
      // and sending push notifications

      const response = {
        requestId: savedNotification.requestId,
        clientReq: savedNotification.clientReq,
        status: savedNotification.status,
      };

      // Cập nhật log với response
      const responseTime = Date.now() - tempLog.created_at.getTime(); // Tính responseTime

      await this.updateLogWithResponse(
        tempLog.id,
        '200',
        JSON.stringify(response),
        responseTime,
      );

      return response;
    } catch (error) {
      // Cập nhật log với error
      await this.updateLogWithError(
        tempLog.id,
        '500',
        error.message,
        Date.now() - tempLog.created_at.getTime(),
      );
      throw error;
    }
  }

  /**
   * Tìm user theo số điện thoại
   */
  private async findUserByPhone(phone: string): Promise<UserEntity | null> {
    // Thử tìm với định dạng gốc trước
    let user = await this.userRepository.findOne({
      where: { phone },
    });

    // Nếu không tìm thấy và phone bắt đầu bằng 0, thử tìm với định dạng +84
    if (!user && /^0\d{9}$/.test(phone)) {
      const formattedPhone = '+84' + phone.substring(1);
      user = await this.userRepository.findOne({
        where: { phone: formattedPhone },
      });
    }

    // Nếu không tìm thấy và phone bắt đầu bằng +84, thử tìm với định dạng 0
    if (!user && /^\+84\d{9}$/.test(phone)) {
      const localPhone = '0' + phone.substring(3);
      user = await this.userRepository.findOne({
        where: { phone: localPhone },
      });
    }

    return user;
  }

  /**
   * Tạo user mới
   */
  private async createUser(name: string, phone: string): Promise<UserEntity> {
    const finalPassword = process.env.DEFAULT_PASSS_FOR_NEW_USER || '123456';

    const md5Password = crypto
      .createHash('md5')
      .update(finalPassword)
      .digest('hex');

    const user = this.userRepository.create({
      fullname: name,
      phone,
      username: phone,
      password: md5Password, // Password tạm thời
      state: 1,
      verified: false,
      enable: true,
    });
    return await this.userRepository.save(user);
  }

  /**
   * Tạo ship mới
   */
  private async createShip(
    plateNumber: string,
    ownerPhone?: string,
  ): Promise<ShipEntity> {
    const ship = this.shipRepository.create({
      plate_number: plateNumber,
      state: 1, // Active state
      status: ShipStatus.CONNECTED, // Default status
      ownerphone: ownerPhone,
    });
    return await this.shipRepository.save(ship);
  }

  async getShipNotificationStatus(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _query: any,
  ): Promise<ShipNotificationStatusResponseDto> {
    // Implementation for getting ship notification status
    await Promise.resolve(); // Temporary await to satisfy linter
    return {
      requestId: '',
      clientReq: '',
      status: ShipNotificationStatus.QUEUED,
    } as ShipNotificationStatusResponseDto;
  }

  private async createLog(
    shipNotificationId: string | null,
    clientReq: string,
    type: LogType,
    endpoint: string,
    method: string,
    requestBody: string,
    responseBody?: string,
    statusCode?: string,
    errorMessage?: string,
    responseTime?: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ShipNotificationLogEntity> {
    const log = this.shipNotificationLogRepository.create({
      shipNotificationId,
      clientReq,
      logType: type,
      endpoint,
      method,
      requestBody,
      responseBody,
      statusCode,
      errorMessage,
      responseTime: responseTime || 0,
      ipAddress,
      userAgent,
    });
    return await this.shipNotificationLogRepository.save(log);
  }

  private async updateLogWithShipNotificationId(
    logId: string,
    shipNotificationId: string,
  ): Promise<void> {
    await this.shipNotificationLogRepository.update(logId, {
      shipNotificationId,
    });
  }

  private async updateLogWithResponse(
    logId: string,
    statusCode: string,
    responseBody: string,
    responseTime: number,
  ): Promise<void> {
    await this.shipNotificationLogRepository.update(logId, {
      statusCode,
      responseBody,
      responseTime,
    });
  }

  private async updateLogWithError(
    logId: string,
    statusCode: string,
    errorMessage: string,
    responseTime: number,
  ): Promise<void> {
    await this.shipNotificationLogRepository.update(logId, {
      statusCode,
      errorMessage,
      responseTime,
    });
  }

  async findShipNotificationsWithPagination(
    page: number,
    limit: number,
    sortBy: string = 'created_at',
    sortOrder: SortOrder = SortOrder.DESC,
    status?: ShipNotificationStatus,
    type?: string,
    ship_code?: string,
    owner_phone?: string,
  ): Promise<[ShipNotificationEntity[], number]> {
    const queryBuilder = this.shipNotificationRepository
      .createQueryBuilder('sn')
      .leftJoinAndSelect('sn.report', 'report')
      .skip((page - 1) * limit)
      .take(limit);

    // Add filters if provided
    if (status) {
      queryBuilder.andWhere('sn.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('sn.type = :type', { type });
    }

    if (ship_code) {
      queryBuilder.andWhere('sn.ship_code LIKE :ship_code', {
        ship_code: `%${ship_code}%`,
      });
    }

    if (owner_phone) {
      queryBuilder.andWhere('sn.owner_phone = :owner_phone', { owner_phone });
    }

    // Add sorting
    const sortColumn = this.getSortColumn(sortBy);
    queryBuilder.orderBy(
      `sn.${sortColumn}`,
      sortOrder.toUpperCase() as SortOrder,
    );

    return await queryBuilder.getManyAndCount();
  }

  /**
   * Kiểm tra agent_code có khớp với agency của user không
   */
  private async validateAgentCode(
    agentCode: string,
    user: any,
  ): Promise<boolean> {
    try {
      // Case 1: Kiểm tra user.agent_code trước (ưu tiên cao nhất)
      if (user.agent_code) {
        return user.agent_code === agentCode;
      }

      // Case 2: Nếu user không có agent_code, kiểm tra qua agency
      if (!user.agency_id) {
        return true; // User không thuộc agency nào, cho phép
      }

      // Lấy thông tin agency của user
      const userAgency = await this.shipNotificationRepository.query(
        `SELECT "code" FROM "Agencies" WHERE "id" = @0`,
        [user.agency_id],
      );

      // Nếu không tìm thấy agency của user
      if (!userAgency || userAgency.length === 0) {
        return false;
      }

      // So sánh agent_code với agency code của user
      return userAgency[0].code === agentCode;
    } catch (error) {
      console.error('Error validating agent code:', error);
      return false;
    }
  }

  private getSortColumn(sortBy: string): string {
    const allowedColumns = [
      'created_at',
      'occurred_at',
      'ship_code',
      'owner_name',
      'owner_phone',
      'type',
      'status',
    ];
    return allowedColumns.includes(sortBy) ? sortBy : 'created_at';
  }

  async getStatsByType(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<{
    types: string[];
    byType: Record<string, number>;
    boundary_near_warning: number;
    boundary_crossed: number;
    total: number;
  }> {
    const types = Object.values(ShipNotificationType);

    // Base query builder with optional date filters on occurred_at
    const qb = this.shipNotificationRepository
      .createQueryBuilder('sn')
      .select('sn.type', 'type')
      .addSelect('COUNT(1)', 'count');

    if (dateFrom && dateTo) {
      qb.where('sn.occurred_at BETWEEN :dateFrom AND :dateTo', {
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
      });
    } else if (dateFrom) {
      qb.where('sn.occurred_at >= :dateFrom', { dateFrom: new Date(dateFrom) });
    } else if (dateTo) {
      qb.where('sn.occurred_at <= :dateTo', { dateTo: new Date(dateTo) });
    }

    const grouped = await qb
      .groupBy('sn.type')
      .getRawMany<{ type: string; count: string }>();

    const byType: Record<string, number> = {};
    types.forEach((t) => (byType[t] = 0));
    grouped.forEach((row) => {
      if (row.type) byType[row.type] = parseInt(row.count || '0', 10);
    });

    // Boundary flags
    const boundaryBase =
      this.shipNotificationRepository.createQueryBuilder('sn');
    if (dateFrom && dateTo) {
      boundaryBase.where('sn.occurred_at BETWEEN :dateFrom AND :dateTo', {
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
      });
    } else if (dateFrom) {
      boundaryBase.where('sn.occurred_at >= :dateFrom', {
        dateFrom: new Date(dateFrom),
      });
    } else if (dateTo) {
      boundaryBase.where('sn.occurred_at <= :dateTo', {
        dateTo: new Date(dateTo),
      });
    }

    const [nearRaw, crossedRaw, totalRaw] = await Promise.all([
      boundaryBase
        .clone()
        .andWhere('sn.boundary_near_warning = 1')
        .select('COUNT(1)', 'count')
        .getRawOne<{ count: string }>(),
      boundaryBase
        .clone()
        .andWhere('sn.boundary_crossed = 1')
        .select('COUNT(1)', 'count')
        .getRawOne<{ count: string }>(),
      boundaryBase
        .clone()
        .select('COUNT(1)', 'count')
        .getRawOne<{ count: string }>(),
    ]);

    return {
      types,
      byType,
      boundary_near_warning: parseInt(nearRaw?.count || '0', 10),
      boundary_crossed: parseInt(crossedRaw?.count || '0', 10),
      total: parseInt(totalRaw?.count || '0', 10),
    };
  }
}

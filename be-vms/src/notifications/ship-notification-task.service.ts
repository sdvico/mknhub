import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ShipNotificationEntity,
  ShipNotificationStatus,
  ShipNotificationFailureReason,
} from './infrastructure/persistence/relational/entities/ship-notification.entity';
import { UsersService } from '../users/users.service';
import { UserPushTokensService } from '../user-push-tokens/user-push-tokens.service';
import { NotificationsService } from './notifications.service';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from '../users/domain/user';

@Injectable()
export class ShipNotificationTaskService {
  private readonly logger = new Logger(ShipNotificationTaskService.name);

  constructor(
    @InjectRepository(ShipNotificationEntity)
    private readonly shipNotificationRepository: Repository<ShipNotificationEntity>,
    private readonly usersService: UsersService,
    private readonly userPushTokensService: UserPushTokensService,
    private readonly notificationsService: NotificationsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Lấy tất cả ship notifications đang pending hoặc cần retry
   */
  async getPendingShipNotifications(): Promise<ShipNotificationEntity[]> {
    // const now = new Date();

    // 1) Mark duplicate notifications as DUPLICATE per event_id - chỉ lấy 1 notification mỗi type
    await this.shipNotificationRepository.manager.query(`
      UPDATE sn 
      SET status = 'DUPLICATE'
      FROM "ShipNotifications" sn
      INNER JOIN (
        SELECT
          sn2.id,
          ROW_NUMBER() OVER (
            PARTITION BY sn2.event_id, sn2.type
            ORDER BY sn2.created_at DESC
          ) AS rn
        FROM "ShipNotifications" sn2
        WHERE sn2.status = 'QUEUED' AND sn2.event_id IS NOT NULL
      ) ranked ON sn.id = ranked.id
      WHERE ranked.rn > 1
    `);

    // 2) Mark duplicate notifications as DUPLICATE per boundary_event_id - chỉ lấy 1 notification mỗi type
    await this.shipNotificationRepository.manager.query(`
      UPDATE sn 
      SET status = 'DUPLICATE'
      FROM "ShipNotifications" sn
      INNER JOIN (
        SELECT
          sn2.id,
          ROW_NUMBER() OVER (
            PARTITION BY sn2.boundary_event_id, sn2.type
            ORDER BY sn2.created_at DESC
          ) AS rn
        FROM "ShipNotifications" sn2
        WHERE sn2.status = 'QUEUED' AND sn2.boundary_event_id IS NOT NULL
      ) ranked ON sn.id = ranked.id
      WHERE ranked.rn > 1
    `);

    // 3) Collect winners per event_id (rn=1) - mỗi type chỉ lấy 1 notification
    const winnersByEvent: { sn_id: string }[] = await this
      .shipNotificationRepository.manager.query(`
      WITH ranked AS (
        SELECT
          sn.id,
          ROW_NUMBER() OVER (
            PARTITION BY sn.event_id, sn.type
            ORDER BY sn.created_at DESC
          ) AS rn
        FROM "ShipNotifications" sn
        WHERE sn.status = 'QUEUED' AND sn.event_id IS NOT NULL
      )
      SELECT id AS sn_id FROM ranked WHERE rn = 1
    `);

    // 4) Collect winners per boundary_event_id (rn=1) - mỗi type chỉ lấy 1 notification
    const winnersByBoundary: { sn_id: string }[] = await this
      .shipNotificationRepository.manager.query(`
      WITH ranked AS (
        SELECT
          sn.id,
          ROW_NUMBER() OVER (
            PARTITION BY sn.boundary_event_id, sn.type
            ORDER BY sn.created_at DESC
          ) AS rn
        FROM "ShipNotifications" sn
        WHERE sn.status = 'QUEUED' AND sn.boundary_event_id IS NOT NULL
      )
      SELECT id AS sn_id FROM ranked WHERE rn = 1
    `);

    const winnerIds = Array.from(
      new Set(
        [
          ...winnersByEvent.map((r) => r.sn_id),
          ...winnersByBoundary.map((r) => r.sn_id),
        ].flat(),
      ),
    );

    // 5) Load winners and standalone queued without event linkage
    const winners = winnerIds.length
      ? await this.shipNotificationRepository
          .createQueryBuilder('sn')
          .where('sn.id IN (:...ids)', { ids: winnerIds })
          .getMany()
      : [];

    const standaloneQueued = await this.shipNotificationRepository
      .createQueryBuilder('sn')
      .where('sn.status = :status', { status: ShipNotificationStatus.QUEUED })
      .andWhere('sn.event_id IS NULL')
      .andWhere('sn.boundary_event_id IS NULL')
      .orderBy('sn.created_at', 'ASC')
      .getMany();

    // 6) Failed eligible for retry (unchanged) tạm thời k cho retry nữa
    // const failedNotifications = await this.shipNotificationRepository
    //   .createQueryBuilder('notification')
    //   .where('notification.status = :status', {
    //     status: ShipNotificationStatus.FAILED,
    //   })
    //   .andWhere('notification.retry_number < notification.max_retry')
    //   .andWhere('notification.next_retry <= :now', { now })
    //   .orderBy('notification.created_at', 'ASC')
    //   .getMany();

    return [...winners, ...standaloneQueued];
  }

  /**
   * Resend notification theo ID - không check duplicate, chỉ gửi lại
   */
  async resendShipNotificationById(id: string): Promise<{
    success: boolean;
    message: string;
    userFound: boolean;
    notificationSent: boolean;
  }> {
    try {
      this.logger.log(`Resending ship notification: ${id}`);

      // Lấy notification theo ID
      const notification = await this.shipNotificationRepository.findOne({
        where: { id },
      });

      if (!notification) {
        return {
          success: false,
          message: 'Notification not found',
          userFound: false,
          notificationSent: false,
        };
      }

      // Đánh dấu đang xử lý
      await this.markShipNotificationAsProcessing(id);

      // Xử lý notification (không check duplicate)
      const result = await this.processShipNotification(notification);

      this.logger.log(
        `Resend completed for notification: ${id} - Success: ${result.success}`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Error resending notification ${id}:`, error.message);
      return {
        success: false,
        message: error.message,
        userFound: false,
        notificationSent: false,
      };
    }
  }

  /**
   * Lấy ship notification theo ID
   */
  async getShipNotificationById(id: string): Promise<any> {
    const result = await this.shipNotificationRepository
      .createQueryBuilder('sn')
      .leftJoinAndSelect('sn.report', 'report')
      .leftJoin('Ships', 'ship', 'ship.plate_number = sn.ship_code')
      .select([
        'sn',
        'report',
        'ship.id',
        'ship.plate_number',
        'ship.status',
        'ship.ownercode',
        'ship.name',
        'ship.locationcode',
        'ship.trackingid',
        'ship.last_ship_notification_id',
      ])
      .where('sn.id = :id', { id })
      .getRawAndEntities();

    if (result.entities.length === 0) {
      return null;
    }

    const notification = result.entities[0];
    const rawData = result.raw[0];

    // Manually attach ship data if exists
    if (rawData.ship_id) {
      (notification as any).ship = {
        id: rawData.ship_id,
        plate_number: rawData.ship_plate_number,
        status: rawData.ship_status,
        ownercode: rawData.ship_ownercode,
        name: rawData.ship_name,
        locationcode: rawData.ship_locationcode,
        trackingid: rawData.ship_trackingid,
        last_ship_notification_id: rawData.ship_last_ship_notification_id,
      };

      // Get last report for this ship
      try {
        const lastReport = await this.shipNotificationRepository.query(
          `
          SELECT TOP 1 r.*
          FROM Reports r
          INNER JOIN Ships s ON s.id = r.reporter_ship_id
          WHERE s.plate_number = @0
          ORDER BY r.created_at DESC
        `,
          [rawData.ship_plate_number],
        );

        if (lastReport && lastReport.length > 0) {
          (notification as any).ship.lastReport = {
            id: lastReport[0].id,
            lat: lastReport[0].lat,
            lng: lastReport[0].lng,
            reported_at: lastReport[0].reported_at,
            status: lastReport[0].status,
            reporter_user_id: lastReport[0].reporter_user_id,
            reporter_ship_id: lastReport[0].reporter_ship_id,
            port_code: lastReport[0].port_code,
            description: lastReport[0].description,
            created_at: lastReport[0].created_at,
            updated_at: lastReport[0].updated_at,
          };
        }
      } catch (error) {
        console.warn(
          `Failed to fetch last report for ship ${rawData.ship_plate_number}:`,
          error,
        );
      }
    }

    // Update is_viewed to true when viewing the notification detail
    await this.updateNotificationAsViewed(id);

    return notification;
  }

  /**
   * Đánh dấu ship notification đang được xử lý
   */
  async markShipNotificationAsProcessing(id: string): Promise<void> {
    await this.shipNotificationRepository.update(id, {
      status: ShipNotificationStatus.SENDING,
    });
  }

  /**
   * Đánh dấu ship notification đã gửi thành công
   */
  async markShipNotificationAsSent(id: string): Promise<void> {
    await this.shipNotificationRepository.update(id, {
      status: ShipNotificationStatus.SENT,
      retry_number: 0,
      reason: undefined,
      next_retry: undefined,
    });
  }

  /**
   * Đánh dấu ship notification gửi thất bại với retry logic
   */
  async markShipNotificationAsFailed(
    id: string,
    reason: ShipNotificationFailureReason,
    errorMessage?: string,
  ): Promise<void> {
    const notification = await this.getShipNotificationById(id);
    if (!notification) {
      this.logger.error(`Notification ${id} not found for failure marking`);
      return;
    }

    const currentRetryNumber = notification.retry_number || 0;
    const maxRetry = notification.max_retry || 0;
    const nextRetryNumber = currentRetryNumber + 1;

    if (nextRetryNumber >= maxRetry) {
      // Đã vượt quá số lần retry, đánh dấu FAILED vĩnh viễn
      await this.shipNotificationRepository.update(id, {
        status: ShipNotificationStatus.FAILED,
        retry_number: nextRetryNumber,
        reason,
        next_retry: undefined,
      });
      this.logger.warn(
        `Notification ${id} marked as permanently FAILED after ${nextRetryNumber} retries. Reason: ${reason}`,
      );
    } else {
      // Tính toán thời gian retry tiếp theo (exponential backoff)
      const retryDelayMinutes = Math.pow(2, nextRetryNumber); // 2, 4, 8 phút
      const nextRetry = new Date();
      nextRetry.setMinutes(nextRetry.getMinutes() + retryDelayMinutes);

      await this.shipNotificationRepository.update(id, {
        status: ShipNotificationStatus.FAILED,
        retry_number: nextRetryNumber,
        reason,
        next_retry: nextRetry,
      });
      this.logger.warn(
        `Notification ${id} marked for retry ${nextRetryNumber}/${maxRetry} at ${nextRetry.toISOString()}. Reason: ${reason}`,
      );
    }

    if (errorMessage) {
      this.logger.error(
        `Error details for notification ${id}: ${errorMessage}`,
      );
    }
  }

  /**
   * Tìm user theo số điện thoại
   */
  async findUserByPhone(phone: string): Promise<User | null> {
    // Thử tìm với định dạng gốc trước
    let user = await this.usersService.findByPhone(phone);

    // Nếu không tìm thấy và phone bắt đầu bằng 0, thử tìm với định dạng +84
    if (!user && /^0\d{9}$/.test(phone)) {
      const formattedPhone = '+84' + phone.substring(1);
      user = await this.usersService.findByPhone(formattedPhone);
    }

    // Nếu không tìm thấy và phone bắt đầu bằng +84, thử tìm với định dạng 0
    if (!user && /^\+84\d{9}$/.test(phone)) {
      const localPhone = '0' + phone.substring(3);
      user = await this.usersService.findByPhone(localPhone);
    }

    return user;
  }

  /**
   * Gửi notification cho user
   */
  async sendNotificationToUser(
    user: User,
    title: string,
    content: string,
    shipCode: string,
    notificationType?: string,
    additionalData?: any,
  ): Promise<{
    success: boolean;
    reason?: ShipNotificationFailureReason;
    errorMessage?: string;
  }> {
    try {
      // Tìm push tokens của user
      console.log('send to user----', user);
      const pushTokens = await this.userPushTokensService.findByUserId(user.id);

      if (pushTokens.length === 0) {
        this.logger.warn(`No push tokens found for user ${user.id}`);
        return {
          success: false,
          reason: ShipNotificationFailureReason.NO_DEVICE_FOUND,
          errorMessage: `No push tokens found for user ${user.id}`,
        };
      }

      // Tạo notification record cho mỗi device
      for (const token of pushTokens) {
        try {
          await this.notificationsService.createNotification({
            user: user.id,
            title,
            content,
            ShipNotifications_id: additionalData?.shipNotificationId,
            plateNumber: shipCode,
            type: notificationType || 'ship_notification',
            stype: 'ship_alert',
            data: JSON.stringify({
              ship_code: shipCode,
              type: notificationType || 'ship_notification',
              notification_id: additionalData?.shipNotificationId,
            }),
            push_token_id: token.id,
            create_by: user.id,
          });
        } catch (error) {
          this.logger.error(
            `Failed to create notification record for token ${token.id}:`,
            error.message,
          );
        }
      }

      // Gửi push notification đến tất cả devices của user
      let successCount = 0;

      if (pushTokens.length > 0) {
        try {
          // const message = {
          //   notification: {
          //     title,
          //     body: content,
          //   },
          //   data: {
          //     ship_code: shipCode,
          //     type: notificationType || 'ship_notification',
          //     id: additionalData?.shipNotificationId || '',
          //   },
          //   tokens: pushTokens.map((token) => token.push_token).filter(Boolean),
          // };

          const response = await this.firebaseService.sendMulticastMessage({
            notification: {
              title,
              body: content,
            },
            data: {
              ship_code: shipCode,
              type: notificationType || 'ship_notification',
              id: additionalData?.shipNotificationId || '',
            },
            tokens: pushTokens
              .map((token) => token.push_token)
              .filter((it) => it) as string[],
          });

          if (response && response.successCount) {
            successCount = response.successCount;
            this.logger.log(
              `Firebase sent ${successCount}/${pushTokens.length} notifications successfully`,
            );
          } else {
            this.logger.error(
              `Failed to send push notifications via Firebase:`,
              response.responses[0]?.error,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to send push notifications via Firebase:`,
            error.message,
          );
        }
      }

      this.logger.log(
        `Sent ${successCount}/${pushTokens.length} notifications to user ${user.id}`,
      );

      if (successCount > 0) {
        return { success: true };
      } else {
        return {
          success: false,
          reason: ShipNotificationFailureReason.FIREBASE_ERROR,
          errorMessage: `All ${pushTokens.length} push notifications failed`,
        };
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${user.id}:`,
        error.message,
      );
      return {
        success: false,
        reason: ShipNotificationFailureReason.UNKNOWN_ERROR,
        errorMessage: error.message,
      };
    }
  }

  /**
   * Xử lý một ship notification
   */
  async processShipNotification(notification: ShipNotificationEntity): Promise<{
    success: boolean;
    message: string;
    userFound: boolean;
    notificationSent: boolean;
  }> {
    try {
      this.logger.log(
        `Processing ship notification: ${notification.id} for ship: ${notification.ship_code} (retry ${notification.retry_number || 0}/${notification.max_retry || 0})`,
      );

      // Tìm user theo số điện thoại
      const user = await this.findUserByPhone(notification.owner_phone);

      if (!user) {
        this.logger.warn(
          `User not found for phone: ${notification.owner_phone}`,
        );
        await this.markShipNotificationAsFailed(
          notification.id,
          ShipNotificationFailureReason.USER_NOT_FOUND,
          `User not found for phone: ${notification.owner_phone}`,
        );
        return {
          success: false,
          message: 'User not found',
          userFound: false,
          notificationSent: false,
        };
      }

      // Format message từ template
      const { title, formattedMessage } =
        await this.formatNotificationMessage(notification);
      const content = formattedMessage || notification.content;

      // Gửi notification
      const result = await this.sendNotificationToUser(
        user,
        title,
        content,
        notification.ship_code,
        notification.type,
        {
          shipNotificationId: notification.id,
          occurred_at: notification.occurred_at.toISOString(),
          boundary_crossed: notification.boundary_crossed,
          boundary_near_warning: notification.boundary_near_warning,
          boundary_status_code: notification.boundary_status_code,
        },
      );

      // Lưu formatted_message
      if (formattedMessage) {
        await this.saveFormattedMessage(notification.id, formattedMessage);
      }

      if (result.success) {
        await this.markShipNotificationAsSent(notification.id);

        this.logger.log(
          `Successfully processed ship notification: ${notification.id}`,
        );
        return {
          success: true,
          message: 'Notification sent successfully',
          userFound: true,
          notificationSent: true,
        };
      } else {
        await this.markShipNotificationAsFailed(
          notification.id,
          result.reason || ShipNotificationFailureReason.UNKNOWN_ERROR,
          result.errorMessage,
        );
        this.logger.error(
          `Failed to send notification for ship notification: ${notification.id}. Reason: ${result.reason}`,
        );
        return {
          success: false,
          message: result.errorMessage || 'Failed to send notification',
          userFound: true,
          notificationSent: false,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error processing ship notification ${notification.id}:`,
        error.message,
      );
      await this.markShipNotificationAsFailed(
        notification.id,
        ShipNotificationFailureReason.UNKNOWN_ERROR,
        error.message,
      );
      return {
        success: false,
        message: error.message,
        userFound: false,
        notificationSent: false,
      };
    }
  }

  /**
   * Lấy thống kê về ship notifications
   */
  async getShipNotificationStats(): Promise<{
    total: number;
    queued: number;
    sending: number;
    sent: number;
    failed: number;
    pendingRetry: number;
  }> {
    const [total, queued, sending, sent, failed] = await Promise.all([
      this.shipNotificationRepository.count(),
      this.shipNotificationRepository.count({
        where: { status: ShipNotificationStatus.QUEUED },
      }),
      this.shipNotificationRepository.count({
        where: { status: ShipNotificationStatus.SENDING },
      }),
      this.shipNotificationRepository.count({
        where: { status: ShipNotificationStatus.SENT },
      }),
      this.shipNotificationRepository.count({
        where: { status: ShipNotificationStatus.FAILED },
      }),
    ]);

    const pendingRetry = await this.shipNotificationRepository
      .createQueryBuilder('notification')
      .where('notification.status = :status', {
        status: ShipNotificationStatus.FAILED,
      })
      .andWhere('notification.retry_number < notification.max_retry')
      .getCount();

    return {
      total,
      queued,
      sending,
      sent,
      failed,
      pendingRetry,
    };
  }

  /**
   * Cập nhật is_viewed = true khi xem chi tiết notification
   */
  private async updateNotificationAsViewed(
    notificationId: string,
  ): Promise<void> {
    try {
      await this.shipNotificationRepository.update(
        { id: notificationId },
        { is_viewed: true },
      );
    } catch (error) {
      console.warn(
        `Failed to update is_viewed for notification ${notificationId}:`,
        error,
      );
    }
  }

  /**
   * Format notification message từ template
   */
  private async formatNotificationMessage(notification: any): Promise<{
    title: string;
    formattedMessage: string | null;
  }> {
    try {
      // Lấy notification type từ database
      const notificationType = await this.shipNotificationRepository.query(
        `SELECT "title", "template_message" FROM "NotificationTypes" WHERE "code" = @0`,
        [notification.type],
      );

      // Default title và message
      let title = `Thông báo tàu ${notification.ship_code}`;
      let formattedMessage: string | null = null;

      if (notificationType && notificationType.length > 0) {
        const typeData = notificationType[0];

        // Sử dụng title từ NotificationTypes nếu có
        if (typeData.title) {
          title = typeData.title;
        }

        // Format template message nếu có
        if (typeData.template_message) {
          formattedMessage = this.formatTemplate(
            typeData.template_message,
            notification,
          );
        }
      }

      return { title, formattedMessage };
    } catch (error) {
      console.error('Error formatting notification message:', error);
      return {
        title: `Cảnh báo tàu ${notification.ship_code}`,
        formattedMessage: null,
      };
    }
  }

  /**
   * Format template với context data
   */
  private formatTemplate(template: string, notification: any): string {
    // Tạo context object với tất cả thông tin cần thiết
    const context = {
      vesselCode: notification.ship_code,
      ship_code: notification.ship_code,
      firstLostAt: this.formatDateTime(notification.occurred_at),
      occurred_at: this.formatDateTime(notification.occurred_at),
      location: this.formatLocation(notification.lat, notification.lng),
      lat: notification.lat,
      lng: notification.lng,
      owner_name: notification.owner_name,
      owner_phone: notification.owner_phone,
      phone: notification.owner_phone,
      content: notification.content,
      type: notification.type,
      agent_code: notification.agent_code,
    };

    // Replace tất cả {{key}} với giá trị tương ứng
    let formatted = template;
    Object.keys(context).forEach((key) => {
      const value = context[key] || '';
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      formatted = formatted.replace(regex, value);
    });

    return formatted;
  }

  /**
   * Format datetime theo định dạng Việt Nam
   */
  private formatDateTime(date: Date): string {
    if (!date) return '';

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    };

    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
  }

  /**
   * Format location từ lat/lng thành DMS
   */
  private formatLocation(lat?: number, lng?: number): string {
    if (!lat || !lng) return '';

    const latDMS = this.toDMS(lat, true);
    const lngDMS = this.toDMS(lng, false);

    return `${latDMS}${lngDMS}`;
  }

  /**
   * Convert decimal degrees to DMS like 06°10'12"N105°54'24"E
   */
  private toDMS(value: number, isLat: boolean): string {
    const dir = isLat ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
    const abs = Math.abs(value);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    const degStr = String(deg).padStart(2, '0');
    const minStr = String(min).padStart(2, '0');
    const secStr = String(sec).padStart(2, '0');
    return isLat
      ? `${degStr}°${minStr}'${secStr}"${dir}`
      : `${degStr}°${minStr}'${secStr}"${dir}`;
  }

  /**
   * Lưu formatted_message vào database
   */
  private async saveFormattedMessage(
    notificationId: string,
    formattedMessage: string,
  ): Promise<void> {
    try {
      await this.shipNotificationRepository.update(
        { id: notificationId },
        { formatted_message: formattedMessage },
      );
    } catch (error) {
      console.warn(
        `Failed to save formatted_message for notification ${notificationId}:`,
        error,
      );
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ShipNotificationTaskService } from './ship-notification-task.service';

export interface ShipNotificationTaskResult {
  recordsProcessed: number;
  recordsChanged: number;
  successCount: number;
  failureCount: number;
  details: Array<{
    notificationId: string;
    shipCode: string;
    success: boolean;
    message: string;
    userFound: boolean;
    notificationSent: boolean;
  }>;
}

@Injectable()
export class ShipNotificationTaskExecutorService {
  private readonly logger = new Logger(
    ShipNotificationTaskExecutorService.name,
  );

  constructor(
    private readonly shipNotificationTaskService: ShipNotificationTaskService,
  ) {}

  /**
   * Thực thi xử lý ship notifications
   */
  async executeShipNotificationTasks(): Promise<ShipNotificationTaskResult> {
    this.logger.log('Starting ship notification task execution...');

    const result: ShipNotificationTaskResult = {
      recordsProcessed: 0,
      recordsChanged: 0,
      successCount: 0,
      failureCount: 0,
      details: [],
    };

    try {
      // Lấy tất cả ship notifications đang pending
      const pendingNotifications =
        await this.shipNotificationTaskService.getPendingShipNotifications();

      if (pendingNotifications?.length === 0) {
        this.logger.log('No pending ship notifications to process');
        return result;
      }

      this.logger.log(
        `Found ${pendingNotifications?.length} pending ship notifications to process`,
      );

      // Xử lý từng notification
      for (const notification of pendingNotifications) {
        try {
          this.logger.log(
            `Processing ship notification: ${notification.id} for ship: ${notification.ship_code}`,
          );

          // Đánh dấu đang xử lý
          await this.shipNotificationTaskService.markShipNotificationAsProcessing(
            notification.id,
          );

          // Xử lý notification
          const processResult =
            await this.shipNotificationTaskService.processShipNotification(
              notification,
            );

          // Cập nhật kết quả
          result.recordsProcessed++;
          result.recordsChanged++;

          const detail = {
            notificationId: notification.id,
            shipCode: notification.ship_code,
            success: processResult.success,
            message: processResult.message,
            userFound: processResult.userFound,
            notificationSent: processResult.notificationSent,
          };

          result.details.push(detail);

          if (processResult.success) {
            result.successCount++;
            this.logger.log(
              `Successfully processed ship notification: ${notification.id}`,
            );
          } else {
            result.failureCount++;
            this.logger.error(
              `Failed to process ship notification: ${notification.id} - ${processResult.message}`,
            );
          }
        } catch (error) {
          result.recordsProcessed++;
          result.failureCount++;

          const detail = {
            notificationId: notification.id,
            shipCode: notification.ship_code,
            success: false,
            message: error.message,
            userFound: false,
            notificationSent: false,
          };

          result.details.push(detail);

          this.logger.error(
            `Error processing ship notification ${notification.id}:`,
            error.message,
          );
        }
      }

      this.logger.log(
        `Ship notification task execution completed. Processed: ${result.recordsProcessed}, Success: ${result.successCount}, Failed: ${result.failureCount}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        'Ship notification task execution failed:',
        error.message,
      );
      throw error;
    }
  }

  /**
   * Thực thi xử lý một ship notification cụ thể (cho testing)
   */
  async executeSingleShipNotificationTask(notificationId: string): Promise<{
    success: boolean;
    message: string;
    userFound: boolean;
    notificationSent: boolean;
  }> {
    this.logger.log(
      `Executing single ship notification task for ID: ${notificationId}`,
    );

    try {
      // Lấy notification theo ID
      const notification =
        await this.shipNotificationTaskService.getShipNotificationById(
          notificationId,
        );

      if (!notification) {
        throw new Error(`Ship notification not found: ${notificationId}`);
      }

      // Đánh dấu đang xử lý
      await this.shipNotificationTaskService.markShipNotificationAsProcessing(
        notification.id,
      );

      // Xử lý notification
      const result =
        await this.shipNotificationTaskService.processShipNotification(
          notification,
        );

      this.logger.log(
        `Single ship notification task completed for ID: ${notificationId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Single ship notification task failed for ID: ${notificationId}:`,
        error.message,
      );
      throw error;
    }
  }
}

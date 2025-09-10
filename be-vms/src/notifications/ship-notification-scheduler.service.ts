import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ShipNotificationTaskExecutorService } from './ship-notification-task-executor.service';

@Injectable()
export class ShipNotificationSchedulerService {
  private readonly logger = new Logger(ShipNotificationSchedulerService.name);
  private isRunning = false;

  constructor(
    private readonly shipNotificationTaskExecutorService: ShipNotificationTaskExecutorService,
  ) {}

  /**
   * Cron job chạy mỗi 30 giây
   * //
   */
  @Cron('*/30 * * * * *') // Chạy mỗi 30 giây
  async handleShipNotificationScheduler() {
    if (this.isRunning) {
      this.logger.warn(
        'Ship notification scheduler is already running, skipping this execution',
      );
      return;
    }

    this.isRunning = true;

    try {
      this.logger.log('Starting ship notification scheduler...');

      // Thực thi xử lý ship notifications
      const result =
        await this.shipNotificationTaskExecutorService.executeShipNotificationTasks();

      if (result.recordsProcessed === 0) {
        this.logger.log('No ship notifications to process');
        return;
      }

      this.logger.log(
        `Ship notification scheduler completed. Processed: ${result.recordsProcessed}, Success: ${result.successCount}, Failed: ${result.failureCount}`,
      );

      // Log chi tiết nếu có lỗi
      if (result.failureCount > 0) {
        this.logger.warn(
          `Failed to process ${result.failureCount} ship notifications:`,
        );
        result.details
          .filter((detail) => !detail.success)
          .forEach((detail) => {
            this.logger.warn(
              `- Ship ${detail.shipCode} (ID: ${detail.notificationId}): ${detail.message}`,
            );
          });
      }
    } catch (error) {
      this.logger.error('Ship notification scheduler failed:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Trigger thủ công cho testing hoặc xử lý ngay lập tức
   */
  async triggerSchedulerManually(): Promise<void> {
    this.logger.log('Manual trigger of ship notification scheduler');
    await this.handleShipNotificationScheduler();
  }

  /**
   * Lấy trạng thái scheduler
   */
  getSchedulerStatus(): { isRunning: boolean; lastRun: Date | null } {
    return {
      isRunning: this.isRunning,
      lastRun: null, // Có thể mở rộng để track thời gian chạy cuối
    };
  }

  /**
   * Xử lý một ship notification cụ thể (cho testing)
   */
  async processSingleShipNotification(notificationId: string): Promise<{
    success: boolean;
    message: string;
    userFound: boolean;
    notificationSent: boolean;
  }> {
    this.logger.log(
      `Manual processing of single ship notification: ${notificationId}`,
    );

    try {
      const result =
        await this.shipNotificationTaskExecutorService.executeSingleShipNotificationTask(
          notificationId,
        );
      this.logger.log(
        `Manual processing completed for notification: ${notificationId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Manual processing failed for notification: ${notificationId}:`,
        error.message,
      );
      throw error;
    }
  }
}

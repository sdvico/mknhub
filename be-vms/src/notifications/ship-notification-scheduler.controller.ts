import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ShipNotificationSchedulerService } from './ship-notification-scheduler.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Ship Notification Scheduler')
@Controller('ship-notification-scheduler')
export class ShipNotificationSchedulerController {
  constructor(
    private readonly shipNotificationSchedulerService: ShipNotificationSchedulerService,
  ) {}

  @Public()
  @Post('trigger')
  @ApiOperation({
    summary: 'Trigger ship notification scheduler manually',
    description: 'Kích hoạt scheduler xử lý ship notifications ngay lập tức',
  })
  @ApiResponse({
    status: 200,
    description: 'Scheduler triggered successfully',
    examples: {
      success: {
        summary: 'Scheduler triggered',
        value: {
          success: true,
          message: 'Ship notification scheduler triggered successfully',
        },
      },
    },
  })
  async triggerScheduler(): Promise<{ success: boolean; message: string }> {
    await this.shipNotificationSchedulerService.triggerSchedulerManually();
    return {
      success: true,
      message: 'Ship notification scheduler triggered successfully',
    };
  }

  @Get('status')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get ship notification scheduler status',
    description: 'Lấy trạng thái hiện tại của ship notification scheduler',
  })
  @ApiResponse({
    status: 200,
    description: 'Scheduler status',
    examples: {
      success: {
        summary: 'Scheduler status',
        value: {
          isRunning: false,
          lastRun: null,
        },
      },
    },
  })
  getSchedulerStatus(): { isRunning: boolean; lastRun: Date | null } {
    return this.shipNotificationSchedulerService.getSchedulerStatus();
  }

  @Post('process/:notificationId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Process single ship notification',
    description: 'Xử lý một ship notification cụ thể theo ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification processed successfully',
    examples: {
      success: {
        summary: 'Notification processed',
        value: {
          success: true,
          message: 'Notification sent successfully',
          userFound: true,
          notificationSent: true,
        },
      },
      userNotFound: {
        summary: 'User not found',
        value: {
          success: false,
          message: 'User not found',
          userFound: false,
          notificationSent: false,
        },
      },
      notificationFailed: {
        summary: 'Notification failed',
        value: {
          success: false,
          message: 'Failed to send notification',
          userFound: true,
          notificationSent: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ship notification not found',
    examples: {
      error: {
        summary: 'Notification not found',
        value: {
          success: false,
          message: 'Ship notification not found',
        },
      },
    },
  })
  async processSingleNotification(
    @Param('notificationId') notificationId: string,
  ): Promise<{
    success: boolean;
    message: string;
    userFound: boolean;
    notificationSent: boolean;
  }> {
    return await this.shipNotificationSchedulerService.processSingleShipNotification(
      notificationId,
    );
  }
}

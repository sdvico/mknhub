import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './infrastructure/persistence/relational/notification.repository';
import { SendNotificationDto } from './dto/notification.dto';
import { User } from '../users/domain/user';
import { FirebaseService } from '../firebase/firebase.service';
import { UserPushTokenRepository } from 'src/user-push-tokens/infrastructure/persistence/relational/repositories/user-push-token.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userPushTokenRepository: UserPushTokenRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async sendNotification(dto: SendNotificationDto, currentUser: User) {
    // Chỉ cho phép gửi tới chính mình hoặc admin
    // if (currentUser.id !== dto.userId && currentUser.username !== 'admin') {
    //   throw new UnauthorizedException(
    //     'Not allowed to send notification to this user',
    //   );
    // }

    const message = {
      notification: {
        title: dto.title,
        body: dto.body,
      },
      data: dto.data || {},
      tokens: dto.token ? [dto.token] : [],
    };

    if (!dto.token) {
      const tokens = await this.userPushTokenRepository.findByUserId(
        dto.userId,
      );

      const pushTokens = tokens
        .map((t) => t.push_token)
        .filter(Boolean) as string[];
      message.tokens = pushTokens as string[];
    }

    const response = await this.firebaseService.sendMulticastMessage(message);

    // Save notification to database
    await this.notificationRepository.save({
      user: dto.userId,
      title: dto.title,
      content: dto.body,
      status: 0,
      created_at: new Date(),
      create_by: currentUser.id,
      update_at: new Date(),
      update_by: currentUser.id,
    });

    return { success: true, response };
  }

  async getNotifications(
    userId: string,
    page: number,
    limit: number,
    status?: number,
    sortBy: string = 'created_at',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const [notifications, total] = await this.notificationRepository.findByUser(
      userId,
      page,
      limit,
      status,
      sortBy,
      sortOrder,
    );

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStatistic(userId: string, status?: number) {
    const total = await this.notificationRepository.countByUser(userId, status);
    return { total };
  }

  async getNotification(id: string) {
    const notification = await this.notificationRepository.findOne(id);
    if (notification) {
      await this.notificationRepository.update(id, { status: 1 });
    }
    return { data: notification };
  }

  async createNotification(data: {
    user: string;
    title: string;
    content: string;
    ShipNotifications_id?: string;
    plateNumber?: string;
    type?: string;
    stype?: string;
    data?: string;
    push_token_id?: string;
    create_by: string;
  }) {
    return await this.notificationRepository.save({
      ...data,
      status: 0,
      created_at: new Date(),
      update_at: new Date(),
      update_by: data.create_by,
    });
  }
}

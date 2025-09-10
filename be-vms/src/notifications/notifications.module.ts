import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from 'src/session/session.module';
import { UserPushTokensModule } from 'src/user-push-tokens/user-push-tokens.module';
import { UsersModule } from 'src/users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { Report } from '../reports';
import { ShipEntity } from '../ships/infrastructure/persistence/relational/entities/ship.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { NotificationTypeEntity } from './infrastructure/persistence/relational/entities/notification-type.entity';
import { NotificationEntity } from './infrastructure/persistence/relational/entities/notification.entity';
import { ShipNotificationLogEntity } from './infrastructure/persistence/relational/entities/ship-notification-log.entity';
import { ShipNotificationEntity } from './infrastructure/persistence/relational/entities/ship-notification.entity';
import { ShipNotificationEventEntity } from './infrastructure/persistence/relational/entities/ship-notification-event.entity';
import { NotificationMapper } from './infrastructure/persistence/relational/mappers/notification.mapper';
import { NotificationRepository } from './infrastructure/persistence/relational/notification.repository';
import { NotificationTypeController } from './notification-type.controller';
import { NotificationTypeService } from './notification-type.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ShipNotificationSchedulerController } from './ship-notification-scheduler.controller';
import { ShipNotificationSchedulerService } from './ship-notification-scheduler.service';
import { ShipNotificationTaskExecutorService } from './ship-notification-task-executor.service';
import { ShipNotificationTaskService } from './ship-notification-task.service';
import { ShipNotificationController } from './ship-notification.controller';
import { ShipNotificationService } from './ship-notification.service';
import { ShipNotificationImportController } from './ship-notification.import.controller';
import { ShipNotificationEventsService } from './ship-notification-events.service';
import { ShipNotificationEventsController } from './ship-notification-events.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      NotificationTypeEntity,
      ShipNotificationEntity,
      ShipNotificationLogEntity,
      ShipNotificationEventEntity,
      ShipEntity,
      UserEntity,
      Report,
    ]),
    FirebaseModule,
    SessionModule,
    UserPushTokensModule,
    UsersModule,
  ],
  controllers: [
    NotificationsController,
    ShipNotificationController,
    ShipNotificationSchedulerController,
    NotificationTypeController,
    ShipNotificationImportController,
    ShipNotificationEventsController,
  ],
  providers: [
    NotificationsService,
    NotificationRepository,
    NotificationMapper,
    ShipNotificationService,
    ShipNotificationTaskService,
    ShipNotificationTaskExecutorService,
    ShipNotificationSchedulerService,
    NotificationTypeService,
    ShipNotificationEventsService,
  ],
  exports: [
    NotificationsService,
    NotificationRepository,
    NotificationMapper,
    ShipNotificationService,
    ShipNotificationTaskService,
    ShipNotificationTaskExecutorService,
    ShipNotificationSchedulerService,
  ],
})
export class NotificationsModule {}

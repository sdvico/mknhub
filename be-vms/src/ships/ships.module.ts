import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipEntity } from './infrastructure/persistence/relational/entities/ship.entity';
import { ShipMapper } from './infrastructure/persistence/relational/mappers/ship.mapper';
import { ShipRepository } from './infrastructure/persistence/relational/repositories/ship.repository';
import { ShipsService } from './ships.service';
import { ShipsController } from './ships.controller';
import { SessionModule } from '../session/session.module';
import { ShipNotificationEntity } from '../notifications/infrastructure/persistence/relational/entities/ship-notification.entity';
import { ShipNotificationEventEntity } from '../notifications/infrastructure/persistence/relational/entities/ship-notification-event.entity';
import { Report } from '../reports/entities/report.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShipEntity,
      ShipNotificationEntity,
      ShipNotificationEventEntity,
      Report,
      UserEntity,
    ]),
    SessionModule,
  ],
  controllers: [ShipsController],
  providers: [ShipsService, ShipRepository, ShipMapper],
  exports: [ShipsService],
})
export class ShipsModule {}

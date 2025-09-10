import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';
import { Port } from './entities/port.entity';
import { ShipNotificationEventEntity } from '../notifications/infrastructure/persistence/relational/entities/ship-notification-event.entity';
import { SessionModule } from '../session/session.module';
import { GroupsModule } from '../groups/groups.module';
import { ShipNotificationUpdateService } from './ship-notification-update.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Port, ShipNotificationEventEntity]),
    SessionModule,
    GroupsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ShipNotificationUpdateService],
  exports: [ReportsService],
})
export class ReportsModule {}

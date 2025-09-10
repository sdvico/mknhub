import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FishingZonesService } from './fishing-zones.service';
import { FishingZonesController } from './fishing-zones.controller';
import { FishingZone } from './entities/fishing-zone.entity';
import { SessionModule } from '../session/session.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FishingZone]),
    SessionModule,
    GroupsModule,
  ],
  controllers: [FishingZonesController],
  providers: [FishingZonesService],
  exports: [FishingZonesService],
})
export class FishingZonesModule {}

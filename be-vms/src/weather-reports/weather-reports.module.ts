import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherReportsService } from './weather-reports.service';
import { WeatherReportsController } from './weather-reports.controller';
import { WeatherReport } from './entities/weather-report.entity';
import { SessionModule } from '../session/session.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeatherReport]),
    SessionModule,
    GroupsModule,
  ],
  controllers: [WeatherReportsController],
  providers: [WeatherReportsService],
  exports: [WeatherReportsService],
})
export class WeatherReportsModule {}

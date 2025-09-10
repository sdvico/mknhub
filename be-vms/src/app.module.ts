import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { BackupModule } from './backup/backup.module';
import appConfig from './config/app.config';
import databaseConfig from './database/config/database.config';
import { DatabaseModule } from './database/database.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { FirebaseModule } from './firebase/firebase.module';
import { FishingZonesModule } from './fishing-zones/fishing-zones.module';
import { GroupsModule } from './groups/groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { SessionModule } from './session/session.module';
import { ShipsModule } from './ships/ships.module';
// import { SobaServicesModule } from './soba-services/soba-services.module';
// import { UserPushTokensModule } from './user-push-tokens/user-push-tokens.module';
import { UsersModule } from './users/users.module';
import { WeatherReportsModule } from './weather-reports/weather-reports.module';
import { AgenciesModule } from './agencies/agencies.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { AppController } from './app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'client'),
      exclude: ['/api'],
      serveStaticOptions: {
        index: false, // Disable automatic index serving so AppController can handle it
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    SessionModule,
    UsersModule,
    ShipsModule,
    GroupsModule,
    // UserPushTokensModule,
    BackupModule,
    FirebaseModule,
    //
    // SobaServicesModule,
    NotificationsModule,
    ReportsModule,
    FeedbacksModule,
    FishingZonesModule,
    WeatherReportsModule,
    AgenciesModule,
    // AuthModule được import sau để tránh circular dependency
    AuthModule,
  ],
  // controllers: [AppController],
})
export class AppModule {}

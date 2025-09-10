import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPushTokenEntity } from './infrastructure/persistence/relational/entities/user-push-token.entity';
import { NotificationEntity } from '../notifications/infrastructure/persistence/relational/entities/notification.entity';
import { UserPushTokenRepository } from './infrastructure/persistence/relational/repositories/user-push-token.repository';
import { UserPushTokenMapper } from './infrastructure/persistence/relational/mappers/user-push-token.mapper';
import { UserPushTokensService } from './user-push-tokens.service';
import { UserPushTokensController } from './controllers/user-push-tokens.controller';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPushTokenEntity, NotificationEntity]),
    SessionModule,
  ],
  providers: [
    UserPushTokensService,
    UserPushTokenRepository,
    UserPushTokenMapper,
  ],
  controllers: [UserPushTokensController],
  exports: [UserPushTokensService, UserPushTokenRepository],
})
export class UserPushTokensModule {}

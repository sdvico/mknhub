import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './controllers/users.controller';
import { UsersApiController } from './controllers/users-api.controller';
import { UserRepository } from './infrastructure/persistence/relational/repositories/user.repository';
import { UserEntity } from './infrastructure/persistence/relational/entities/user.entity';
import { GroupsService } from './groups.service';
import { UserMapper } from './infrastructure/persistence/relational/mappers/user.mapper';
import { SessionModule } from '../session/session.module';
import { GroupEntity } from '../groups/infrastructure/persistence/relational/entities/group.entity';
import { AgencyEntity } from '../agencies/infrastructure/persistence/relational/entities/agency.entity';
import { Report } from '../reports/entities/report.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { UserPushTokenEntity } from '../user-push-tokens/infrastructure/persistence/relational/entities/user-push-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GroupEntity,
      AgencyEntity,
      Report,
      Feedback,
      UserPushTokenEntity,
    ]),
    SessionModule,
  ],
  controllers: [UsersController, UsersApiController],
  providers: [UsersService, GroupsService, UserRepository, UserMapper],
  exports: [UsersService],
})
export class UsersModule {}

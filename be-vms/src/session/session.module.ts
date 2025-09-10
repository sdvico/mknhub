import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionRepository } from './infrastructure/persistence/relational/repositories/session.repository';
import { SessionEntity } from './infrastructure/persistence/relational/entities/session.entity';
import { SessionMapper } from './infrastructure/persistence/relational/mappers/session.mapper';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity, UserEntity])],
  providers: [SessionService, SessionRepository, SessionMapper],
  exports: [SessionService],
})
export class SessionModule {}

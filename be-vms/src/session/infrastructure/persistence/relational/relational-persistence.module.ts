import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionRepository } from './repositories/session.repository';
import { SessionMapper } from './mappers/session.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionRepository, SessionMapper],
  exports: [SessionRepository],
})
export class RelationalSessionPersistenceModule {}

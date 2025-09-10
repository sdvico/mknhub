import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from '../groups/groups.module';
import { SessionModule } from '../session/session.module';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';
import { AgencyEntity } from './infrastructure/persistence/relational/entities/agency.entity';
import { AgencyRepository } from './infrastructure/persistence/relational/repositories/agency.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgencyEntity]),
    SessionModule,
    GroupsModule,
  ],
  controllers: [AgenciesController],
  providers: [AgenciesService, AgencyRepository],
  exports: [AgenciesService, TypeOrmModule],
})
export class AgenciesModule {}

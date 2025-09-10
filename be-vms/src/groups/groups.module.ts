import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupUserEntity } from './infrastructure/persistence/relational/entities/group-user.entity';
import { GroupEntity } from './infrastructure/persistence/relational/entities/group.entity';
import { GroupUserMapper } from './infrastructure/persistence/relational/mappers/group-user.mapper';
import { GroupMapper } from './infrastructure/persistence/relational/mappers/group.mapper';
import { GroupUserRepository } from './infrastructure/persistence/relational/repositories/group-user.repository';
import { GroupRepository } from './infrastructure/persistence/relational/repositories/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, GroupUserEntity])],
  providers: [
    GroupsService,
    GroupRepository,
    GroupUserRepository,
    GroupMapper,
    GroupUserMapper,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}

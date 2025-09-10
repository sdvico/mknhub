import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { BackupLogEntity } from './infrastructure/persistence/relational/entities/backup-log.entity';
import { BackupRepository } from './infrastructure/persistence/relational/repositories/backup.repository';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackupLogEntity, UserEntity]),
    SessionModule,
  ],
  controllers: [BackupController],
  providers: [BackupService, BackupRepository],
  exports: [BackupService],
})
export class BackupModule {}

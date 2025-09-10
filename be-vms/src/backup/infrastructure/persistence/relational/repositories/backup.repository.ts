import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupLogEntity } from '../entities/backup-log.entity';

@Injectable()
export class BackupRepository {
  constructor(
    @InjectRepository(BackupLogEntity)
    private readonly backupRepository: Repository<BackupLogEntity>,
  ) {}

  async create(backupLog: BackupLogEntity): Promise<BackupLogEntity> {
    return await this.backupRepository.save(backupLog);
  }

  async findById(id: string): Promise<BackupLogEntity | null> {
    return await this.backupRepository.findOne({
      where: { id },
    });
  }

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'backupDate',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ data: BackupLogEntity[]; total: number }> {
    const queryBuilder = this.backupRepository.createQueryBuilder('backup');

    queryBuilder.where(
      'backup.userid = :userId AND backup.isActive = :isActive',
      {
        userId,
        isActive: true,
      },
    );

    // Sorting với validation
    const allowedSortFields = [
      'id',
      'filename',
      'backupDate',
      'description',
      'isActive',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'backupDate';

    queryBuilder.orderBy(`backup.${safeSortBy}`, sortOrder);

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Execute queries
    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findByUserIdLegacy(userId: string): Promise<BackupLogEntity[]> {
    return await this.backupRepository.find({
      where: { userid: userId },
      order: { backupDate: 'DESC' },
    });
  }

  async findByUserIdAndId(
    userId: string,
    id: string,
  ): Promise<BackupLogEntity | null> {
    return await this.backupRepository.findOne({
      where: { userid: userId, id },
    });
  }

  async update(backupLog: BackupLogEntity): Promise<BackupLogEntity> {
    return await this.backupRepository.save(backupLog);
  }

  async delete(id: string): Promise<void> {
    await this.backupRepository.delete(id);
  }
}

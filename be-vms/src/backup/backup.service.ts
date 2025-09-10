import { Injectable } from '@nestjs/common';
import { BackupLogEntity } from './infrastructure/persistence/relational/entities/backup-log.entity';
import { BackupRepository } from './infrastructure/persistence/relational/repositories/backup.repository';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BackupService {
  private backupDir = path.join(process.cwd(), 'backup');

  constructor(private readonly backupRepository: BackupRepository) {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup(backupData: any, userId: string): Promise<any> {
    try {
      // Generate unique filename
      const filename = `${uuidv4()}.json`;
      const filepath = path.join(this.backupDir, filename);

      // Save backup data to file
      fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

      // Create backup log
      const backupLog = new BackupLogEntity();
      backupLog.filename = filename;
      backupLog.userid = userId;
      backupLog.description = backupData.description;

      const savedBackup = await this.backupRepository.create(backupLog);

      return {
        success: true,
        message: 'Backup created successfully',
        backupId: savedBackup.id,
        filename: filename,
        backupDate: savedBackup.backupDate,
      };
    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  async getBackupHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'backupDate',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<any> {
    try {
      const result = await this.backupRepository.findByUserId(
        userId,
        page,
        limit,
        sortBy,
        sortOrder,
      );

      return {
        data: result.data.map((backup) => ({
          id: backup.id,
          filename: backup.filename,
          backupDate: backup.backupDate,
          description: backup.description,
          isActive: backup.isActive,
          userid: backup.userid,
        })),
        total: result.total,
      };
    } catch (error) {
      throw new Error(`Failed to get backup history: ${error.message}`);
    }
  }

  async getBackup(id: string, userId: string): Promise<any> {
    try {
      const backup = await this.backupRepository.findByUserIdAndId(userId, id);

      if (!backup) {
        throw new Error('Backup not found');
      }

      // Check if file exists
      const filepath = path.join(this.backupDir, backup.filename);
      if (!fs.existsSync(filepath)) {
        throw new Error('Backup file not found');
      }

      // Read and parse backup data
      const backupData = fs.readFileSync(filepath, 'utf8');
      const parsedData = JSON.parse(backupData);

      return {
        success: true,
        backupData: parsedData,
        backupInfo: {
          id: backup.id,
          filename: backup.filename,
          backupDate: backup.backupDate,
          description: backup.description,
          isActive: backup.isActive,
          userid: backup.userid,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get backup: ${error.message}`);
    }
  }

  async deleteBackup(id: string, userId: string): Promise<any> {
    try {
      const backup = await this.backupRepository.findByUserIdAndId(userId, id);

      if (!backup) {
        throw new Error('Backup not found');
      }

      // Delete file
      const filepath = path.join(this.backupDir, backup.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      // Mark as inactive in database
      backup.isActive = false;
      await this.backupRepository.update(backup);

      return {
        success: true,
        message: 'Backup deleted successfully',
      };
    } catch (error) {
      throw new Error(`Failed to delete backup: ${error.message}`);
    }
  }
}

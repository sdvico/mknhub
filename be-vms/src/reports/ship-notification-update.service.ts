import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ShipNotificationUpdateService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async updateReportId(
    shipNotificationId: string,
    reportId: string,
  ): Promise<void> {
    // Use raw query to update ship notification without importing the entity
    await this.reportRepository.query(
      `UPDATE "ShipNotifications" SET "reports_id" = @0 WHERE "id" = @1`,
      [reportId, shipNotificationId],
    );
  }

  async getShipCodeFromNotification(
    shipNotificationId: string,
  ): Promise<string | null> {
    // Get ship_code from ship notification
    const result = await this.reportRepository.query(
      `SELECT "ship_code" FROM "ShipNotifications" WHERE "id" = @0`,
      [shipNotificationId],
    );

    return result.length > 0 ? result[0].ship_code : null;
  }

  async updateShipLastReportId(
    shipCode: string,
    reportId: string,
  ): Promise<void> {
    // Update ship's last_report_id using ship_code (plate_number)
    await this.reportRepository.query(
      `UPDATE "Ships" SET "last_report_id" = @0 WHERE "plate_number" = @1`,
      [reportId, shipCode],
    );
  }
}

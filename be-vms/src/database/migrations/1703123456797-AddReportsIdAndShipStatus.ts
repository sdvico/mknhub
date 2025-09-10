import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportsIdAndShipStatus1703123456797
  implements MigrationInterface
{
  name = 'AddReportsIdAndShipStatus1703123456797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm cột reports_id vào ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "reports_id" uniqueidentifier NULL DEFAULT NULL
    `);

    // Thêm cột port_code vào Reports
    await queryRunner.query(`
      ALTER TABLE "Reports" 
      ADD "port_code" nvarchar(100) NULL DEFAULT NULL
    `);

    // Thêm cột description vào Reports
    await queryRunner.query(`
      ALTER TABLE "Reports" 
      ADD "description" nvarchar(1000) NULL DEFAULT NULL
    `);

    // Thêm cột status vào Ships
    await queryRunner.query(`
      ALTER TABLE "Ships" 
      ADD "status" nvarchar(20) NOT NULL DEFAULT 'DISCONNECTED'
    `);

    // Thêm cột last_ship_notification_id vào Ships
    await queryRunner.query(`
      ALTER TABLE "Ships" 
      ADD "last_ship_notification_id" uniqueidentifier NULL DEFAULT NULL
    `);

    // Thêm constraint cho status enum của Ships
    await queryRunner.query(`
      ALTER TABLE "Ships" 
      ADD CONSTRAINT "CHK_Ships_status" 
      CHECK ("status" IN ('DISCONNECTED', 'CONNECTED', 'POSITION_DECLARED', 'ACTIVE', 'INACTIVE'))
    `);

    // Tạo index cho reports_id để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_reports_id" 
      ON "ShipNotifications" ("reports_id")
    `);

    // Tạo index cho port_code để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_Reports_port_code" 
      ON "Reports" ("port_code")
    `);

    // Tạo index cho status của Ships để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_Ships_status" 
      ON "Ships" ("status")
    `);

    // Tạo index cho last_ship_notification_id để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_Ships_last_notification" 
      ON "Ships" ("last_ship_notification_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa indexes
    await queryRunner.query(`
      DROP INDEX "IDX_Ships_last_notification"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_Ships_status"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_Reports_port_code"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_reports_id"
    `);

    // Xóa constraint
    await queryRunner.query(`
      ALTER TABLE "Ships" 
      DROP CONSTRAINT "CHK_Ships_status"
    `);

    // Xóa các cột
    await queryRunner.query(`
      ALTER TABLE "Ships" 
      DROP COLUMN "last_ship_notification_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "Ships" 
      DROP COLUMN "status"
    `);

    await queryRunner.query(`
      ALTER TABLE "Reports" 
      DROP COLUMN "description"
    `);

    await queryRunner.query(`
      ALTER TABLE "Reports" 
      DROP COLUMN "port_code"
    `);

    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      DROP COLUMN "reports_id"
    `);
  }
}

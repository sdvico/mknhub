import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRetryColumnsToShipNotifications1703123456795
  implements MigrationInterface
{
  name = 'AddRetryColumnsToShipNotifications1703123456795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm cột retry_number
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "retry_number" int NOT NULL DEFAULT 0
    `);

    // Thêm cột max_retry
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "max_retry" int NOT NULL DEFAULT 0
    `);

    // Thêm cột next_retry
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "next_retry" datetime NULL DEFAULT NULL
    `);

    // Thêm cột reason
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "reason" nvarchar(1024) NULL DEFAULT NULL
    `);

    // Thêm constraint cho reason enum
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD CONSTRAINT "CHK_ShipNotifications_reason" 
      CHECK ("reason" IS NULL OR "reason" IN ('USER_NOT_FOUND', 'NO_DEVICE_FOUND', 'FIREBASE_ERROR', 'NETWORK_ERROR', 'UNKNOWN_ERROR'))
    `);

    // Tạo index cho next_retry để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_next_retry" 
      ON "ShipNotifications" ("next_retry")
    `);

    // Tạo index cho retry_number và status để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_retry_status" 
      ON "ShipNotifications" ("retry_number", "status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa indexes
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_retry_status"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_next_retry"
    `);

    // Xóa constraint
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      DROP CONSTRAINT "CHK_ShipNotifications_reason"
    `);

    // Xóa các cột
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      DROP COLUMN "reason"
    `);

    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      DROP COLUMN "next_retry"
    `);

    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      DROP COLUMN "max_retry"
    `);

    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      DROP COLUMN "retry_number"
    `);
  }
}

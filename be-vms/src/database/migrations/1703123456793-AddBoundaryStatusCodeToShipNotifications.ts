import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBoundaryStatusCodeToShipNotifications1703123456793
  implements MigrationInterface
{
  name = 'AddBoundaryStatusCodeToShipNotifications1703123456793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm cột boundary_status_code
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "boundary_status_code" nvarchar(50) NULL
    `);

    // Tạo index cho cột mới để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_boundary_status_code" ON "ShipNotifications" ("boundary_status_code")
    `);

    // Tạo composite index với các cột boundary khác
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_boundary_complete" ON "ShipNotifications" ("boundary_crossed", "boundary_near_warning", "boundary_status_code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa composite index
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_boundary_complete" ON "ShipNotifications"
    `);

    // Xóa individual index
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_boundary_status_code" ON "ShipNotifications"
    `);

    // Xóa cột boundary_status_code
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "boundary_status_code"
    `);
  }
}

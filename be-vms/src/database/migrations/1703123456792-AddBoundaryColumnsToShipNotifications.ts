import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBoundaryColumnsToShipNotifications1703123456792
  implements MigrationInterface
{
  name = 'AddBoundaryColumnsToShipNotifications1703123456792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm cột boundary_crossed
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "boundary_crossed" bit NOT NULL DEFAULT 0
    `);

    // Thêm cột boundary_near_warning
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" 
      ADD "boundary_near_warning" bit NOT NULL DEFAULT 0
    `);

    // Tạo index cho 2 cột mới để tối ưu query
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_boundary_crossed" ON "ShipNotifications" ("boundary_crossed")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_boundary_near_warning" ON "ShipNotifications" ("boundary_near_warning")
    `);

    // Tạo composite index cho cả 2 cột
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_boundary_flags" ON "ShipNotifications" ("boundary_crossed", "boundary_near_warning")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa composite index
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_boundary_flags" ON "ShipNotifications"
    `);

    // Xóa individual indexes
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_boundary_near_warning" ON "ShipNotifications"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_boundary_crossed" ON "ShipNotifications"
    `);

    // Xóa cột boundary_near_warning
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "boundary_near_warning"
    `);

    // Xóa cột boundary_crossed
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "boundary_crossed"
    `);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCoordinatesPrecision1710925800000
  implements MigrationInterface
{
  name = 'UpdateCoordinatesPrecision1710925800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update lat column precision in Reports table
    await queryRunner.query(`
      ALTER TABLE "Reports"
      ALTER COLUMN "lat" decimal(12,8) NOT NULL
    `);

    // Update lng column precision in Reports table
    await queryRunner.query(`
      ALTER TABLE "Reports"
      ALTER COLUMN "lng" decimal(12,8) NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert lat column precision in Reports table
    await queryRunner.query(`
      ALTER TABLE "Reports"
      ALTER COLUMN "lat" decimal(10,6) NOT NULL
    `);

    // Revert lng column precision in Reports table
    await queryRunner.query(`
      ALTER TABLE "Reports"
      ALTER COLUMN "lng" decimal(10,6) NOT NULL
    `);
  }
}

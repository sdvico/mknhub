import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOwnerPhoneToShips1710925500000 implements MigrationInterface {
  name = 'AddOwnerPhoneToShips1710925500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Ships" 
      ADD "ownerphone" nvarchar(20) NULL
    `);

    // Create index on ownerphone for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_Ships_ownerphone" 
      ON "Ships" ("ownerphone")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_Ships_ownerphone" ON "Ships"
    `);

    await queryRunner.query(`
      ALTER TABLE "Ships" 
      DROP COLUMN "ownerphone"
    `);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserVerificationAndEnableFields1710925200000
  implements MigrationInterface
{
  name = 'AddUserVerificationAndEnableFields1710925200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add verified column with default 0 (false)
    await queryRunner.query(`
      ALTER TABLE "Users"
      ADD "verified" bit NOT NULL DEFAULT 0
    `);

    // Add enable column with default 1 (true)
    await queryRunner.query(`
      ALTER TABLE "Users"
      ADD "enable" bit NOT NULL DEFAULT 1
    `);

    // Add index for enable column since we'll use it in login queries
    await queryRunner.query(`
      CREATE INDEX "IDX_Users_enable" ON "Users" ("enable")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.query(`
      DROP INDEX "IDX_Users_enable" ON "Users"
    `);

    // Drop enable column
    await queryRunner.query(`
      ALTER TABLE "Users"
      DROP COLUMN "enable"
    `);

    // Drop verified column
    await queryRunner.query(`
      ALTER TABLE "Users"
      DROP COLUMN "verified"
    `);
  }
}

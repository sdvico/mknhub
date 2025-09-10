import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgencyTableAndUserAgencyId1710925600000
  implements MigrationInterface
{
  name = 'AddAgencyTableAndUserAgencyId1710925600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Agencies table
    await queryRunner.query(`
      CREATE TABLE "Agencies" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "name" nvarchar(255) NOT NULL,
        "code" nvarchar(50) NOT NULL,
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_Agencies" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_Agencies_code" UNIQUE ("code")
      )
    `);

    // Add agency_id column to Users table
    await queryRunner.query(`
      ALTER TABLE "Users"
      ADD "agency_id" uniqueidentifier NULL
    `);

    // Create foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "Users"
      ADD CONSTRAINT "FK_Users_Agencies"
      FOREIGN KEY ("agency_id") REFERENCES "Agencies"("id")
      ON DELETE SET NULL
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_Agencies_code" ON "Agencies" ("code")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_Users_agency_id" ON "Users" ("agency_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX "IDX_Users_agency_id" ON "Users"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_Agencies_code" ON "Agencies"
    `);

    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "Users"
      DROP CONSTRAINT "FK_Users_Agencies"
    `);

    // Drop agency_id column from Users
    await queryRunner.query(`
      ALTER TABLE "Users"
      DROP COLUMN "agency_id"
    `);

    // Drop Agencies table
    await queryRunner.query(`
      DROP TABLE "Agencies"
    `);
  }
}

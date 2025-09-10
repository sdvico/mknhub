import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortsAndFkToReports1712000000000
  implements MigrationInterface
{
  name = 'CreatePortsAndFkToReports1712000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Ports table
    await queryRunner.query(`
      CREATE TABLE "Ports" (
        "code" nvarchar(100) NOT NULL,
        "name" nvarchar(255) NOT NULL,
        "loCode" nvarchar(255) NOT NULL,
        "lat" float NULL,
        "lng" float NULL,
        "TCTS_Code" nvarchar(255) NULL,
        "address" ntext NULL,
        "phone" nvarchar(255) NULL,
        "fax" nvarchar(255) NULL,
        "email" nvarchar(255) NULL,
        "contact" nvarchar(50) NULL,
        "contactPhone" nvarchar(255) NULL,
        "description" nvarchar(150) NULL,
        CONSTRAINT "PK_Ports" PRIMARY KEY ("code")
      )
    `);

    // Ensure existing Reports rows do not violate the upcoming FK
    // Since Ports is a new table and may be empty, null-out any existing values first
    await queryRunner.query(`
      UPDATE "Reports" SET "port_code" = NULL WHERE "port_code" IS NOT NULL
    `);

    // Add FK from Reports.port_code to Ports.code (nullable)
    await queryRunner.query(`
      ALTER TABLE "Reports"
      ADD CONSTRAINT "FK_Reports_Ports" FOREIGN KEY ("port_code")
      REFERENCES "Ports"("code") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Indexes
    await queryRunner.query(`
      CREATE INDEX "IX_Ports_Code" ON "Ports" ("code")
    `);
    await queryRunner.query(`
      CREATE INDEX "IX_Ports_Name" ON "Ports" ("name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Reports" DROP CONSTRAINT "FK_Reports_Ports"`,
    );
    await queryRunner.query(`DROP INDEX "IX_Ports_Name" ON "Ports"`);
    await queryRunner.query(`DROP INDEX "IX_Ports_Code" ON "Ports"`);
    await queryRunner.query(`DROP TABLE "Ports"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoordinatesSourceLastReportAndMessageTemplate1710925700000
  implements MigrationInterface
{
  name = 'AddCoordinatesSourceLastReportAndMessageTemplate1710925700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add source column to Reports table
    await queryRunner.query(`
      ALTER TABLE "Reports"
      ADD "source" nvarchar(10) NULL
    `);

    // Add last_report_id column to Ships table
    await queryRunner.query(`
      ALTER TABLE "Ships"
      ADD "last_report_id" uniqueidentifier NULL
    `);

    // Add foreign key constraint for Ships.last_report_id
    await queryRunner.query(`
      ALTER TABLE "Ships"
      ADD CONSTRAINT "FK_Ships_LastReport"
      FOREIGN KEY ("last_report_id") REFERENCES "Reports"("id")
      ON DELETE SET NULL
    `);

    // Add title column to NotificationTypes table
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      ADD "title" nvarchar(255) NULL
    `);

    // Add template_message column to NotificationTypes table
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      ADD "template_message" ntext NULL
    `);

    // Add lat column to ShipNotifications table
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "lat" decimal(12,8) NULL
    `);

    // Add lng column to ShipNotifications table
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "lng" decimal(12,8) NULL
    `);

    // Add agent_code column to ShipNotifications table
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "agent_code" nvarchar(50) NULL
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_Reports_source" ON "Reports" ("source")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_Ships_last_report_id" ON "Ships" ("last_report_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_NotificationTypes_title" ON "NotificationTypes" ("title")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_agent_code" ON "ShipNotifications" ("agent_code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_agent_code" ON "ShipNotifications"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_NotificationTypes_title" ON "NotificationTypes"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_Ships_last_report_id" ON "Ships"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_Reports_source" ON "Reports"
    `);

    // Drop template_message column from NotificationTypes
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      DROP COLUMN "template_message"
    `);

    // Drop title column from NotificationTypes
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      DROP COLUMN "title"
    `);

    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "Ships"
      DROP CONSTRAINT "FK_Ships_LastReport"
    `);

    // Drop last_report_id column from Ships
    await queryRunner.query(`
      ALTER TABLE "Ships"
      DROP COLUMN "last_report_id"
    `);

    // Drop agent_code column from ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      DROP COLUMN "agent_code"
    `);

    // Drop lng column from ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      DROP COLUMN "lng"
    `);

    // Drop lat column from ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      DROP COLUMN "lat"
    `);

    // Drop source column from Reports
    await queryRunner.query(`
      ALTER TABLE "Reports"
      DROP COLUMN "source"
    `);
  }
}

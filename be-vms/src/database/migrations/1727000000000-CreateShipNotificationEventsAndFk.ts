import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShipNotificationEventsAndFk1727000000000
  implements MigrationInterface
{
  name = 'CreateShipNotificationEventsAndFk1727000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create table ShipNotificationEvents with final columns
    await queryRunner.query(`
      CREATE TABLE "ShipNotificationEvents" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "ship_code" nvarchar(255) NOT NULL,
        "user_report_time" datetime NULL DEFAULT NULL,
        "type" nvarchar(20) NULL DEFAULT NULL,
        "started_at" datetime NULL DEFAULT NULL,
        "resolved_at" datetime NULL DEFAULT NULL,
        "response_minutes_from_6h" int NULL DEFAULT NULL,
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_ShipNotificationEvents" PRIMARY KEY ("id")
      )
    `);

    // Indexes for ShipNotificationEvents
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotificationEvents_ship_code" ON "ShipNotificationEvents" ("ship_code")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotificationEvents_user_report_time" ON "ShipNotificationEvents" ("user_report_time")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotificationEvents_event_type" ON "ShipNotificationEvents" ("type")
    `);

    // Add event_id, boundary_event_id and viewed_at columns to ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "event_id" uniqueidentifier NULL DEFAULT NULL,
          "boundary_event_id" uniqueidentifier NULL DEFAULT NULL,
          "viewed_at" datetime NULL DEFAULT NULL
    `);

    // Index for event_id
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_event_id" ON "ShipNotifications" ("event_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_boundary_event_id" ON "ShipNotifications" ("boundary_event_id")
    `);

    // Optional FK (no cascade to keep history if event removed)
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD CONSTRAINT "FK_ShipNotifications_Events" FOREIGN KEY ("event_id")
      REFERENCES "ShipNotificationEvents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD CONSTRAINT "FK_ShipNotifications_BoundaryEvents" FOREIGN KEY ("boundary_event_id")
      REFERENCES "ShipNotificationEvents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK and indexes, then columns and table
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP CONSTRAINT "FK_ShipNotifications_Events"
    `);
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotifications_event_id" ON "ShipNotifications"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "viewed_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "event_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "boundary_event_id"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotificationEvents_ship_code" ON "ShipNotificationEvents"
    `);
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotificationEvents_user_report_time" ON "ShipNotificationEvents"
    `);
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotificationEvents_event_type" ON "ShipNotificationEvents"
    `);
    await queryRunner.query(`
      DROP TABLE "ShipNotificationEvents"
    `);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationTypeAndShipNotificationIsViewed1710925000000
  implements MigrationInterface
{
  name = 'AddNotificationTypeAndShipNotificationIsViewed1710925000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create NotificationTypes table
    await queryRunner.query(`
      CREATE TABLE "NotificationTypes" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "code" nvarchar(50) NOT NULL,
        "name" nvarchar(255) NOT NULL,
        "form_type" nvarchar(50) NULL,
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_NotificationTypes" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_NotificationTypes_code" UNIQUE ("code")
      )
    `);

    // Add is_viewed column to ShipNotifications table
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "is_viewed" bit NOT NULL DEFAULT 0
    `);

    // Create index for code
    await queryRunner.query(`
      CREATE INDEX "IDX_NotificationTypes_code" ON "NotificationTypes" ("code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX "IDX_NotificationTypes_code" ON "NotificationTypes"
    `);

    // Drop is_viewed column from ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      DROP COLUMN "is_viewed"
    `);

    // Drop NotificationTypes table
    await queryRunner.query(`
      DROP TABLE "NotificationTypes"
    `);
  }
}

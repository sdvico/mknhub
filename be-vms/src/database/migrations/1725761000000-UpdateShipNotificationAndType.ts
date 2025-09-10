import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateShipNotificationAndType1725761000000
  implements MigrationInterface
{
  name = 'UpdateShipNotificationAndType1725761000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ShipNotifications new columns (all nullable)
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "next_notification_id" uniqueidentifier NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "next_notification_type_id" uniqueidentifier NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "resolved_at" datetime NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "active" bit NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "repeat_daily" bit NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "repeat_until_resolved" bit NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "priority" int NULL
    `);

    // NotificationTypes new column priority (nullable)
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      ADD "priority" int NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes" DROP COLUMN "priority"
    `);

    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "priority"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "repeat_until_resolved"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "repeat_daily"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "active"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "resolved_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "next_notification_type_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" DROP COLUMN "next_notification_id"
    `);
  }
}

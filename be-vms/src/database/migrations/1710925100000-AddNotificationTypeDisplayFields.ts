import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationTypeDisplayFields1710925100000
  implements MigrationInterface
{
  name = 'AddNotificationTypeDisplayFields1710925100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns one by one for MSSQL compatibility
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      ADD "icon" nvarchar(50) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      ADD "color" nvarchar(20) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      ADD "background_color" nvarchar(20) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop columns one by one for MSSQL compatibility
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      DROP COLUMN "background_color"
    `);

    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      DROP COLUMN "color"
    `);

    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      DROP COLUMN "icon"
    `);
  }
}

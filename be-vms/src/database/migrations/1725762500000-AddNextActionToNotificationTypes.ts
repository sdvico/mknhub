import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNextActionToNotificationTypes1725762500000
  implements MigrationInterface
{
  name = 'AddNextActionToNotificationTypes1725762500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes"
      ADD "next_action" nvarchar(255) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "NotificationTypes" DROP COLUMN "next_action"
    `);
  }
}

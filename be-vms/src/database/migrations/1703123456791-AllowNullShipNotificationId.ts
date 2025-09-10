import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullShipNotificationId1703123456791
  implements MigrationInterface
{
  name = 'AllowNullShipNotificationId1703123456791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cho phép cột shipNotificationId có thể NULL
    await queryRunner.query(`
      ALTER TABLE "ShipNotificationLogs" 
      ALTER COLUMN "shipNotificationId" uniqueidentifier NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Khôi phục lại NOT NULL constraint
    await queryRunner.query(`
      ALTER TABLE "ShipNotificationLogs" 
      ALTER COLUMN "shipNotificationId" uniqueidentifier NOT NULL
    `);
  }
}

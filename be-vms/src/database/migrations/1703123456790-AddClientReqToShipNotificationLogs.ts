import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientReqToShipNotificationLogs1703123456790
  implements MigrationInterface
{
  name = 'AddClientReqToShipNotificationLogs1703123456790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm cột clientReq vào bảng ShipNotificationLogs
    await queryRunner.query(`
      ALTER TABLE "ShipNotificationLogs" 
      ADD "clientReq" nvarchar(255) NOT NULL DEFAULT ''
    `);

    // Cập nhật giá trị clientReq từ bảng ShipNotifications (nếu có shipNotificationId)
    await queryRunner.query(`
      UPDATE "ShipNotificationLogs" 
      SET "clientReq" = (
        SELECT sn."clientReq" 
        FROM "ShipNotifications" sn 
        WHERE sn."id" = "ShipNotificationLogs"."shipNotificationId"
      )
      WHERE "shipNotificationId" IS NOT NULL
    `);

    // Tạo index cho clientReq để tìm kiếm nhanh hơn
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotificationLogs_clientReq" ON "ShipNotificationLogs" ("clientReq")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX "IDX_ShipNotificationLogs_clientReq" ON "ShipNotificationLogs"
    `);

    // Drop cột clientReq
    await queryRunner.query(`
      ALTER TABLE "ShipNotificationLogs" DROP COLUMN "clientReq"
    `);
  }
}

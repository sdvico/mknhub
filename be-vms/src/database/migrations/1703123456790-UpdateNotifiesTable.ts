import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNotifiesTable1703123456790 implements MigrationInterface {
  name = 'UpdateNotifiesTable1703123456790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Xóa bảng NotificationDevices nếu tồn tại
    await queryRunner.query(`
      IF OBJECT_ID('NotificationDevices', 'U') IS NOT NULL
        DROP TABLE NotificationDevices
    `);

    // Thêm cột push_token_id vào bảng Notifies
    await queryRunner.query(`
      ALTER TABLE "Notifies" 
      ADD "push_token_id" uniqueidentifier NULL
    `);

    // Thêm cột ShipNotifications_id nếu chưa có
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Notifies' AND COLUMN_NAME = 'ShipNotifications_id'
      )
      BEGIN
        ALTER TABLE "Notifies" 
        ADD "ShipNotifications_id" uniqueidentifier NULL
      END
    `);

    // Thêm cột plateNumber nếu chưa có
    await queryRunner.query(`
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Notifies' AND COLUMN_NAME = 'plateNumber'
      )
      BEGIN
        ALTER TABLE "Notifies" 
        ADD "plateNumber" nvarchar(255) NULL
      END
    `);

    // Thêm foreign key cho push_token_id
    await queryRunner.query(`
      ALTER TABLE "Notifies" 
      ADD CONSTRAINT "FK_Notifies_UserPushTokens" 
      FOREIGN KEY ("push_token_id") 
      REFERENCES "UserPushTokens"("id") 
      ON DELETE SET NULL
    `);

    // Thêm foreign key cho ShipNotifications_id
    await queryRunner.query(`
      ALTER TABLE "Notifies" 
      ADD CONSTRAINT "FK_Notifies_ShipNotifications" 
      FOREIGN KEY ("ShipNotifications_id") 
      REFERENCES "ShipNotifications"("id") 
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa foreign keys
    await queryRunner.query(`
      IF OBJECT_ID('FK_Notifies_UserPushTokens', 'F') IS NOT NULL
        ALTER TABLE "Notifies" DROP CONSTRAINT "FK_Notifies_UserPushTokens"
    `);

    await queryRunner.query(`
      IF OBJECT_ID('FK_Notifies_ShipNotifications', 'F') IS NOT NULL
        ALTER TABLE "Notifies" DROP CONSTRAINT "FK_Notifies_ShipNotifications"
    `);

    // Xóa cột push_token_id
    await queryRunner.query(`
      IF EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Notifies' AND COLUMN_NAME = 'push_token_id'
      )
      BEGIN
        ALTER TABLE "Notifies" DROP COLUMN "push_token_id"
      END
    `);

    // Xóa cột ShipNotifications_id
    await queryRunner.query(`
      IF EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Notifies' AND COLUMN_NAME = 'ShipNotifications_id'
      )
      BEGIN
        ALTER TABLE "Notifies" DROP COLUMN "ShipNotifications_id"
      END
    `);

    // Xóa cột plateNumber
    await queryRunner.query(`
      IF EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Notifies' AND COLUMN_NAME = 'plateNumber'
      )
      BEGIN
        ALTER TABLE "Notifies" DROP COLUMN "plateNumber"
      END
    `);
  }
}

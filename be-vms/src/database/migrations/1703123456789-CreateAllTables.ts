import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1703123456789 implements MigrationInterface {
  name = 'CreateAllTables1703123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng Users
    await queryRunner.query(`
      CREATE TABLE "Users" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "username" nvarchar(255) NOT NULL,
        "password" nvarchar(255) NOT NULL,
        "state" int NOT NULL DEFAULT 0,
        "fullname" nvarchar(255) NOT NULL,
        "phone" nvarchar(255) NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng Groups
    await queryRunner.query(`
      CREATE TABLE "Groups" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "name" nvarchar(255) NOT NULL,
        CONSTRAINT "PK_Groups" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng Ships
    await queryRunner.query(`
      CREATE TABLE "Ships" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "plate_number" nvarchar(255) NOT NULL,
        "locationcode" nvarchar(255) NULL,
        "trackingid" nvarchar(255) NULL,
        "nkkt" nvarchar(255) NULL,
        "ownercode" uniqueidentifier NULL,
        "captioncode" uniqueidentifier NULL,
        "businesscode" nvarchar(255) NULL,
        "business2code" nvarchar(255) NULL,
        "business3code" ntext NULL,
        "business4code" ntext NULL,
        "licenseid" ntext NULL,
        "length" float NULL,
        "congsuat" float NULL,
        "state" int NOT NULL,
        "HoHieu" nvarchar(255) NULL,
        "CoHieu" nvarchar(255) NULL,
        "IMO" nvarchar(255) NULL,
        "CangCaDangKyCode" nvarchar(255) NULL,
        "CangCaPhuCode" nvarchar(255) NULL,
        "TongTaiTrong" float NULL,
        "ChieuRongLonNhat" float NULL,
        "MonNuoc" float NULL,
        "SoThuyenVien" int NULL,
        "NgaySanXuat" datetime NULL,
        "NgayHetHan" datetime NULL,
        "DungTichHamCa" float NULL,
        "VanTocDanhBat" float NULL,
        "VanTocHanhTrinh" float NULL,
        "name" nvarchar(255) NULL,
        CONSTRAINT "PK_Ships" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng UserPushTokens
    await queryRunner.query(`
      CREATE TABLE "UserPushTokens" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "userid" uniqueidentifier NOT NULL,
        "device_os" nvarchar(255) NULL,
        "push_token" nvarchar(255) NULL,
        "registered_date" datetime NOT NULL DEFAULT GETDATE(),
        "app_ver" nvarchar(255) NULL,
        "module" nvarchar(255) NULL,
        CONSTRAINT "PK_UserPushTokens" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng UserLoginTokens
    await queryRunner.query(`
      CREATE TABLE "UserLoginTokens" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "userid" uniqueidentifier NOT NULL,
        "token" nvarchar(255) NOT NULL,
        "created_date" datetime NOT NULL,
        "expired_date" datetime NOT NULL,
        CONSTRAINT "PK_UserLoginTokens" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng Notifies
    await queryRunner.query(`
      CREATE TABLE "Notifies" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "plateNumber" nvarchar(255) NULL,
        "user" nvarchar(255) NULL,
        "title" nvarchar(255) NULL,
        "content" nvarchar(255) NULL,
        "type" nvarchar(255) NULL,
        "created_at" datetime NOT NULL,
        "create_by" nvarchar(255) NOT NULL,
        "update_at" datetime NOT NULL,
        "update_by" nvarchar(255) NOT NULL,
        "status" int NOT NULL,
        "stype" nvarchar(255) NULL,
        "data" nvarchar(255) NULL,
        CONSTRAINT "PK_Notifies" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng GroupUsers
    await queryRunner.query(`
      CREATE TABLE "GroupUsers" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "userid" uniqueidentifier NOT NULL,
        "groupid" uniqueidentifier NOT NULL,
        CONSTRAINT "PK_GroupUsers" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng ShipNotifications
    await queryRunner.query(`
      CREATE TABLE "ShipNotifications" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "clientReq" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "requestId" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "ship_code" nvarchar(255) NOT NULL,
        "occurred_at" datetime NOT NULL,
        "content" nvarchar(500) NOT NULL,
        "owner_name" nvarchar(255) NOT NULL,
        "owner_phone" nvarchar(255) NOT NULL,
        "type" nvarchar(20) NOT NULL,
        "status" nvarchar(20) NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SENDING', 'SENT', 'DELIVERED', 'FAILED')),
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_ShipNotifications" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_ShipNotifications_clientReq" UNIQUE ("clientReq"),
        CONSTRAINT "UQ_ShipNotifications_requestId" UNIQUE ("requestId")
      )
    `);

    // Tạo bảng ShipNotificationLogs
    await queryRunner.query(`
      CREATE TABLE "ShipNotificationLogs" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "shipNotificationId" uniqueidentifier NOT NULL,
        "logType" nvarchar(20) NOT NULL CHECK (logType IN ('REQUEST', 'RESPONSE', 'ERROR')),
        "endpoint" nvarchar(50) NOT NULL,
        "method" nvarchar(10) NOT NULL,
        "statusCode" nvarchar(50) NULL,
        "requestBody" ntext NULL,
        "responseBody" ntext NULL,
        "errorMessage" ntext NULL,
        "userAgent" nvarchar(255) NULL,
        "ipAddress" nvarchar(45) NULL,
        "responseTime" int NOT NULL,
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_ShipNotificationLogs" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng trung gian NotificationDevices
    await queryRunner.query(`
      CREATE TABLE "NotificationDevices" (
        "notificationId" uniqueidentifier NOT NULL,
        "deviceId" uniqueidentifier NOT NULL,
        CONSTRAINT "PK_NotificationDevices" PRIMARY KEY ("notificationId", "deviceId")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "UserPushTokens" 
      ADD CONSTRAINT "FK_UserPushTokens_Users" 
      FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "UserLoginTokens" 
      ADD CONSTRAINT "FK_UserLoginTokens_Users" 
      FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "GroupUsers" 
      ADD CONSTRAINT "FK_GroupUsers_Users" 
      FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "GroupUsers" 
      ADD CONSTRAINT "FK_GroupUsers_Groups" 
      FOREIGN KEY ("groupid") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Tạo Foreign Key constraints cho ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotificationLogs" 
      ADD CONSTRAINT "FK_ShipNotificationLogs_ShipNotifications" 
      FOREIGN KEY ("shipNotificationId") REFERENCES "ShipNotifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "NotificationDevices" 
      ADD CONSTRAINT "FK_NotificationDevices_Notifies" 
      FOREIGN KEY ("notificationId") REFERENCES "Notifies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "NotificationDevices" 
      ADD CONSTRAINT "FK_NotificationDevices_UserPushTokens" 
      FOREIGN KEY ("deviceId") REFERENCES "UserPushTokens"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Tạo indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_Users_username" ON "Users" ("username")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_Users_phone" ON "Users" ("phone")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_Ships_plate_number" ON "Ships" ("plate_number")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_UserPushTokens_userid" ON "UserPushTokens" ("userid")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_UserLoginTokens_userid" ON "UserLoginTokens" ("userid")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_GroupUsers_userid" ON "GroupUsers" ("userid")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_GroupUsers_groupid" ON "GroupUsers" ("groupid")
    `);

    // Tạo indexes cho ShipNotifications
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_ship_code" ON "ShipNotifications" ("ship_code")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_type" ON "ShipNotifications" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_status" ON "ShipNotifications" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotifications_created_at" ON "ShipNotifications" ("created_at")
    `);

    // Tạo indexes cho ShipNotificationLogs
    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotificationLogs_shipNotificationId" ON "ShipNotificationLogs" ("shipNotificationId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotificationLogs_logType" ON "ShipNotificationLogs" ("logType")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ShipNotificationLogs_created_at" ON "ShipNotificationLogs" ("created_at")
    `);

    // Tạo indexes cho NotificationDevices
    await queryRunner.query(`
      CREATE INDEX "IDX_NotificationDevices_notificationId" ON "NotificationDevices" ("notificationId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_NotificationDevices_deviceId" ON "NotificationDevices" ("deviceId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop Foreign Keys first
    await queryRunner.query(
      `ALTER TABLE "NotificationDevices" DROP CONSTRAINT "FK_NotificationDevices_UserPushTokens"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NotificationDevices" DROP CONSTRAINT "FK_NotificationDevices_Notifies"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ShipNotificationLogs" DROP CONSTRAINT "FK_ShipNotificationLogs_ShipNotifications"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GroupUsers" DROP CONSTRAINT "FK_GroupUsers_Groups"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GroupUsers" DROP CONSTRAINT "FK_GroupUsers_Users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserLoginTokens" DROP CONSTRAINT "FK_UserLoginTokens_Users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserPushTokens" DROP CONSTRAINT "FK_UserPushTokens_Users"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "NotificationDevices"`);
    await queryRunner.query(`DROP TABLE "ShipNotificationLogs"`);
    await queryRunner.query(`DROP TABLE "ShipNotifications"`);
    await queryRunner.query(`DROP TABLE "GroupUsers"`);
    await queryRunner.query(`DROP TABLE "Notifies"`);
    await queryRunner.query(`DROP TABLE "UserLoginTokens"`);
    await queryRunner.query(`DROP TABLE "UserPushTokens"`);

    await queryRunner.query(`DROP TABLE "Ships"`);
    await queryRunner.query(`DROP TABLE "Groups"`);
    await queryRunner.query(`DROP TABLE "Users"`);
  }
}

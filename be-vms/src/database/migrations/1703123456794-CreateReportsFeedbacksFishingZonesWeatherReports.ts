import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportsFeedbacksFishingZonesWeatherReports1703123456794
  implements MigrationInterface
{
  name = 'CreateReportsFeedbacksFishingZonesWeatherReports1703123456794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng reports (Báo cáo vị trí thủ công)
    await queryRunner.query(`
      CREATE TABLE "Reports" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "lat" decimal(10,6) NOT NULL,
        "lng" decimal(10,6) NOT NULL,
        "reported_at" datetime NOT NULL,
        "status" nvarchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        "reporter_user_id" uniqueidentifier NULL,
        "reporter_ship_id" uniqueidentifier NULL,
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_Reports" PRIMARY KEY ("id"),
        CONSTRAINT "CK_Reports_AtLeastOneReporter" CHECK (reporter_user_id IS NOT NULL OR reporter_ship_id IS NOT NULL)
      )
    `);

    // Tạo bảng feedbacks (Phản ánh khó khăn)
    await queryRunner.query(`
      CREATE TABLE "Feedbacks" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "content" ntext NOT NULL,
        "reporter_id" uniqueidentifier NOT NULL,
        "status" nvarchar(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_Feedbacks" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng fishing_zones (Ngư trường)
    await queryRunner.query(`
      CREATE TABLE "FishingZones" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "title" nvarchar(255) NOT NULL,
        "description" ntext NULL,
        "link" nvarchar(500) NULL,
        "total_views" int NOT NULL DEFAULT 0,
        "total_clicks" int NOT NULL DEFAULT 0,
        "enable" bit NOT NULL DEFAULT 1,
        "published_at" datetime NULL,
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL DEFAULT GETDATE(),
        CONSTRAINT "PK_FishingZones" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng weather_reports (Thời tiết biển)
    await queryRunner.query(`
      CREATE TABLE "WeatherReports" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "region" nvarchar(255) NOT NULL,
        "summary" ntext NOT NULL,
        "advice" ntext NULL,
        "link" nvarchar(500) NULL,
        "total_views" int NOT NULL DEFAULT 0,
        "total_clicks" int NOT NULL DEFAULT 0,
        "enable" bit NOT NULL DEFAULT 1,
        "published_at" datetime NULL,
        "created_at" datetime NOT NULL DEFAULT GETDATE(),
        "updated_at" datetime NOT NULL,
        CONSTRAINT "PK_WeatherReports" PRIMARY KEY ("id")
      )
    `);

    // Tạo Foreign Key constraints
    await queryRunner.query(`
      ALTER TABLE "Reports" 
      ADD CONSTRAINT "FK_Reports_Users" 
      FOREIGN KEY ("reporter_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "Reports" 
      ADD CONSTRAINT "FK_Reports_Ships" 
      FOREIGN KEY ("reporter_ship_id") REFERENCES "Ships"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "Feedbacks" 
      ADD CONSTRAINT "FK_Feedbacks_Users" 
      FOREIGN KEY ("reporter_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Tạo indexes để tối ưu hiệu suất truy vấn
    await queryRunner.query(`
      CREATE INDEX "IX_Reports_Status" ON "Reports" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_Reports_ReportedAt" ON "Reports" ("reported_at")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_Reports_ReporterUser" ON "Reports" ("reporter_user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_Reports_ReporterShip" ON "Reports" ("reporter_ship_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_Feedbacks_Status" ON "Feedbacks" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_Feedbacks_Reporter" ON "Feedbacks" ("reporter_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_FishingZones_Enable" ON "FishingZones" ("enable")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_FishingZones_PublishedAt" ON "FishingZones" ("published_at")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_WeatherReports_Enable" ON "WeatherReports" ("enable")
    `);

    await queryRunner.query(`
      CREATE INDEX "IX_WeatherReports_PublishedAt" ON "WeatherReports" ("published_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa Foreign Key constraints
    await queryRunner.query(`
      ALTER TABLE "Reports" DROP CONSTRAINT "FK_Reports_Ships"
    `);

    await queryRunner.query(`
      ALTER TABLE "Reports" DROP CONSTRAINT "FK_Reports_Users"
    `);

    await queryRunner.query(`
      ALTER TABLE "Feedbacks" DROP CONSTRAINT "FK_Feedbacks_Users"
    `);

    // Xóa bảng
    await queryRunner.query(`DROP TABLE "WeatherReports"`);
    await queryRunner.query(`DROP TABLE "FishingZones"`);
    await queryRunner.query(`DROP TABLE "Feedbacks"`);
    await queryRunner.query(`DROP TABLE "Reports"`);
  }
}

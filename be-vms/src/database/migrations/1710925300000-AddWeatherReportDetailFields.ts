import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeatherReportDetailFields1710925300000
  implements MigrationInterface
{
  name = 'AddWeatherReportDetailFields1710925300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm các cột chi tiết thời tiết biển
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" ADD "cloud" nvarchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" ADD "rain" nvarchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" ADD "wind" nvarchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" ADD "wave" nvarchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" ADD "visibility" nvarchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" ADD "recommendation" ntext NULL`,
    );

    // Tạo index cho các trường thường được tìm kiếm
    await queryRunner.query(
      `CREATE INDEX "IDX_WeatherReports_cloud" ON "WeatherReports" ("cloud")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_WeatherReports_wind" ON "WeatherReports" ("wind")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa index trước
    await queryRunner.query(
      `DROP INDEX "IDX_WeatherReports_wind" ON "WeatherReports"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_WeatherReports_cloud" ON "WeatherReports"`,
    );

    // Xóa các cột
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" DROP COLUMN "recommendation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WeatherReports" DROP COLUMN "visibility"`,
    );
    await queryRunner.query(`ALTER TABLE "WeatherReports" DROP COLUMN "wave"`);
    await queryRunner.query(`ALTER TABLE "WeatherReports" DROP COLUMN "wind"`);
    await queryRunner.query(`ALTER TABLE "WeatherReports" DROP COLUMN "rain"`);
    await queryRunner.query(`ALTER TABLE "WeatherReports" DROP COLUMN "cloud"`);
  }
}

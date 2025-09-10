import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBorderPoints1725760000001 implements MigrationInterface {
  name = 'CreateBorderPoints1725760000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "BorderPoints" (
        "id" uniqueidentifier NOT NULL DEFAULT NEWID(),
        "lat" float NOT NULL,
        "lng" float NOT NULL,
        "note" nvarchar(255) NULL,
        CONSTRAINT "PK_BorderPoints" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_BorderPoints_lat_lng" ON "BorderPoints" ("lat", "lng")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_BorderPoints_lat_lng" ON "BorderPoints"`,
    );
    await queryRunner.query(`DROP TABLE "BorderPoints"`);
  }
}

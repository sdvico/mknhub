import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFormattedMessageToShipNotifications1710925900000
  implements MigrationInterface
{
  name = 'AddFormattedMessageToShipNotifications1710925900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add formatted_message column to ShipNotifications table
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      ADD "formatted_message" ntext NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop formatted_message column from ShipNotifications
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications"
      DROP COLUMN "formatted_message"
    `);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDuplicateStatusToShipNotifications1725762000000
  implements MigrationInterface
{
  name = 'AddDuplicateStatusToShipNotifications1725762000000';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async up(queryRunner: QueryRunner): Promise<void> {
    // No column changes needed; status is an NVARCHAR with enum at code-level.
    // This migration exists to bump version and document the new enum value.
    await Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.resolve();
  }
}

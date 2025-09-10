import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateShipNotificationStatusCheck1727000001000
  implements MigrationInterface
{
  name = 'UpdateShipNotificationStatusCheck1727000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing CHECK constraint on ShipNotifications.status (name is system-generated)
    await queryRunner.query(`
      DECLARE @ConstraintName NVARCHAR(128);
      SELECT TOP 1 @ConstraintName = c.name
      FROM sys.check_constraints c
      WHERE c.parent_object_id = OBJECT_ID('ShipNotifications')
        AND c.definition LIKE '%status%';
      IF @ConstraintName IS NOT NULL
      BEGIN
        EXEC('ALTER TABLE "ShipNotifications" DROP CONSTRAINT [' + @ConstraintName + ']');
      END
    `);

    // Recreate CHECK constraint including DUPLICATE status
    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" WITH CHECK
      ADD CONSTRAINT "CK_ShipNotifications_Status"
      CHECK ("status" IN ('QUEUED','SENDING','SENT','DELIVERED','FAILED','DUPLICATE'));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop our named constraint and try to restore the previous set without DUPLICATE
    await queryRunner.query(`
      IF EXISTS (
        SELECT 1 FROM sys.check_constraints
        WHERE name = 'CK_ShipNotifications_Status'
          AND parent_object_id = OBJECT_ID('ShipNotifications')
      )
      BEGIN
        ALTER TABLE "ShipNotifications" DROP CONSTRAINT "CK_ShipNotifications_Status";
      END
    `);

    await queryRunner.query(`
      ALTER TABLE "ShipNotifications" WITH CHECK
      ADD CONSTRAINT "CK_ShipNotifications_Status"
      CHECK ("status" IN ('QUEUED','SENDING','SENT','DELIVERED','FAILED'));
    `);
  }
}

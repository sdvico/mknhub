import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToPushToken1703123456794
  implements MigrationInterface
{
  name = 'AddUniqueConstraintToPushToken1703123456794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique constraint to push_token column
    await queryRunner.query(`
      ALTER TABLE UserPushTokens 
      ADD CONSTRAINT UQ_UserPushTokens_push_token 
      UNIQUE (push_token)
    `);

    // Add index for better performance
    await queryRunner.query(`
      CREATE UNIQUE INDEX IDX_UserPushTokens_push_token 
      ON UserPushTokens (push_token)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove index
    await queryRunner.query(`
      DROP INDEX IDX_UserPushTokens_push_token ON UserPushTokens
    `);

    // Remove unique constraint
    await queryRunner.query(`
      ALTER TABLE UserPushTokens 
      DROP CONSTRAINT UQ_UserPushTokens_push_token
    `);
  }
}

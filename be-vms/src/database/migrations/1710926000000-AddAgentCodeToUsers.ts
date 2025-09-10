import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgentCodeToUsers1710926000000 implements MigrationInterface {
  name = 'AddAgentCodeToUsers1710926000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add agent_code column to Users table
    await queryRunner.query(`
      ALTER TABLE "Users"
      ADD "agent_code" nvarchar(50) NULL
    `);

    // Create index for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_Users_agent_code" ON "Users" ("agent_code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX "IDX_Users_agent_code" ON "Users"
    `);

    // Drop agent_code column from Users
    await queryRunner.query(`
      ALTER TABLE "Users"
      DROP COLUMN "agent_code"
    `);
  }
}

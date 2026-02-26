import type { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769619663420 implements MigrationInterface {
    name = 'Migration1769619663420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}

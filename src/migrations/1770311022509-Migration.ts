import type { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770311022509 implements MigrationInterface {
    name = 'Migration1770311022509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "price"`);
    }

}

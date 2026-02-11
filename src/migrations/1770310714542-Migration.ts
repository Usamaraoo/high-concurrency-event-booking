import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770310714542 implements MigrationInterface {
    name = 'Migration1770310714542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "price_cents" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "price_cents"`);
    }

}

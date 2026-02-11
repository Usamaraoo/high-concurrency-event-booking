import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770731031926 implements MigrationInterface {
    name = 'Migration1770731031926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "payment_intent_client_secret" character varying(512)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "payment_intent_client_secret"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769427144598 implements MigrationInterface {
    name = 'Migration1769427144598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "user_id" uuid NOT NULL, "seats" integer NOT NULL, "available_seats" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_dfa3d03bef3f90f650fd138fb38" UNIQUE ("name"), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_09f256fb7f9a05f0ed9927f406" ON "events" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('RESERVED', 'CONFIRMED', 'FAILED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" SERIAL NOT NULL, "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "seats" integer NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'RESERVED', "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "payment_intent_id" character varying(255), "payment_id" character varying(255), "reservation_token" character varying(64) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "confirmed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_0ffb06dff3c804308691acb105c" UNIQUE ("reservation_token"), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7b928aa63e2e16861f47f75cbc" ON "bookings" ("payment_id") WHERE "payment_id" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1a854260a9759f424f91dec5f8" ON "bookings" ("payment_intent_id") WHERE "payment_intent_id" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0ffb06dff3c804308691acb105" ON "bookings" ("reservation_token") `);
        await queryRunner.query(`CREATE INDEX "IDX_e009408c3343ee5e7426462264" ON "bookings" ("expires_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_48b267d894e32a25ebde4b207a" ON "bookings" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_976c0fe23c870f914acd2378e4" ON "bookings" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_64cd97487c5c42806458ab5520" ON "bookings" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_64cd97487c5c42806458ab5520c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_976c0fe23c870f914acd2378e4e" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_976c0fe23c870f914acd2378e4e"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_64cd97487c5c42806458ab5520c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64cd97487c5c42806458ab5520"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_976c0fe23c870f914acd2378e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48b267d894e32a25ebde4b207a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e009408c3343ee5e7426462264"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ffb06dff3c804308691acb105"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a854260a9759f424f91dec5f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b928aa63e2e16861f47f75cbc"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_09f256fb7f9a05f0ed9927f406"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}

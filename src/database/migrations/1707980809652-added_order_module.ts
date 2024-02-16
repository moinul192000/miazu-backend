import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOrderModule1707980809652 implements MigrationInterface {
    name = 'AddedOrderModule1707980809652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."returns_reason_enum" AS ENUM('FAULTY', 'WRONG_PRODUCT', 'USER_DID_NOT_LIKE', 'DAMAGED', 'COURIER_ISSUE', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "returns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "quantity_returned" integer NOT NULL DEFAULT '1', "reason" "public"."returns_reason_enum" NOT NULL DEFAULT 'OTHER', "restocking_fee" double precision, "is_returned" boolean NOT NULL DEFAULT false, "is_exchange" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_27a2f1895a71519ebfec7850361" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "quantity" integer NOT NULL DEFAULT '1', "price" double precision NOT NULL, "order_id" uuid, "product_variant_id" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "order_id" uuid, CONSTRAINT "PK_98b207341585da2a0faa9b841ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_order_channel_enum" AS ENUM('FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'WEBSITE', 'PHONE', 'DIRECT', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'ON_HOLD', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'EXCHANGED', 'REFUNDED', 'ISSUE_RAISED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" integer NOT NULL DEFAULT nextval('order_id_seq'), "order_channel" "public"."orders_order_channel_enum" NOT NULL DEFAULT 'OTHER', "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING', "phone_number" character varying(16) NOT NULL, "alternate_phone_number" character varying(16), "address" character varying(255) NOT NULL, "user_id" uuid, CONSTRAINT "UQ_cad55b3cb25b38be94d2ce831db" UNIQUE ("order_id"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(
          `ALTER SEQUENCE order_id_seq START WITH 1000 INCREMENT BY 1 OWNED BY orders.order_id;`,
        );
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_19fe8036263238b4fb3866243bf" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_notes" ADD CONSTRAINT "FK_2c241096df74dd0d8e1fc16ed63" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_notes" DROP CONSTRAINT "FK_2c241096df74dd0d8e1fc16ed63"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_19fe8036263238b4fb3866243bf"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER SEQUENCE order_id_seq OWNED BY NONE;`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_order_channel_enum"`);
        await queryRunner.query(`DROP TABLE "order_notes"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "returns"`);
        await queryRunner.query(`DROP TYPE "public"."returns_reason_enum"`);
    }

}

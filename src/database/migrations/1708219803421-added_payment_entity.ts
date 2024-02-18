import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPaymentEntity1708219803421 implements MigrationInterface {
    name = 'AddedPaymentEntity1708219803421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "customer_id" TO "payment_status"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_method_enum" AS ENUM('CASH', 'BKASH', 'NAGAD', 'ROCKET', 'BANK_TRANSFER', 'DISCOUNT_COUPON', 'SPECIAL_EXCEPTION', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "method" "public"."payments_method_enum" NOT NULL, "transaction_date" TIMESTAMP WITH TIME ZONE, "transaction_id" character varying(255), "note" text, "order_id" uuid, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_status"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('PENDING', 'UNPAID', 'PAID', 'PARTIALLY_PAID', 'REFUNDED')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "payment_status" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "payment_status" uuid`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "payment_status" TO "customer_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

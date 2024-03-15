import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedReturnItem1710501516963 implements MigrationInterface {
    name = 'AddedReturnItem1710501516963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "returns" RENAME COLUMN "quantity_returned" TO "order_id"`);
        await queryRunner.query(`CREATE TABLE "order_item_return" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "return_quantity" integer NOT NULL DEFAULT '0', "order_item_id" uuid, "return_order_id" uuid, CONSTRAINT "PK_76a83e7ffe45380fb87b4c063e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "order_id" uuid`);
        await queryRunner.query(`ALTER TABLE "returns" ADD CONSTRAINT "UQ_7c0b171a97595625487728ddb3e" UNIQUE ("order_id")`);
        await queryRunner.query(`ALTER TABLE "returns" ADD CONSTRAINT "FK_7c0b171a97595625487728ddb3e" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_return" ADD CONSTRAINT "FK_a68a2a100f20ae235201a3ea0b2" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_return" ADD CONSTRAINT "FK_a3cce8a816164c83238bf3dee0f" FOREIGN KEY ("return_order_id") REFERENCES "returns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_return" DROP CONSTRAINT "FK_a3cce8a816164c83238bf3dee0f"`);
        await queryRunner.query(`ALTER TABLE "order_item_return" DROP CONSTRAINT "FK_a68a2a100f20ae235201a3ea0b2"`);
        await queryRunner.query(`ALTER TABLE "returns" DROP CONSTRAINT "FK_7c0b171a97595625487728ddb3e"`);
        await queryRunner.query(`ALTER TABLE "returns" DROP CONSTRAINT "UQ_7c0b171a97595625487728ddb3e"`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "order_id" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`DROP TABLE "order_item_return"`);
        await queryRunner.query(`ALTER TABLE "returns" RENAME COLUMN "order_id" TO "quantity_returned"`);
    }

}

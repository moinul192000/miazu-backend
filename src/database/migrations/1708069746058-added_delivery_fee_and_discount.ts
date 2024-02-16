import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDeliveryFeeAndDiscount1708069746058 implements MigrationInterface {
    name = 'AddedDeliveryFeeAndDiscount1708069746058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "discount" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_fee" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_fee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "discount"`);
    }

}

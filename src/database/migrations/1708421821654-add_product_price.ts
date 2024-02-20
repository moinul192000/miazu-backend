import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductPrice1708421821654 implements MigrationInterface {
    name = 'AddProductPrice1708421821654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "price" numeric(5,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
    }

}

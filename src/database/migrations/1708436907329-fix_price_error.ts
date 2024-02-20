import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPriceError1708436907329 implements MigrationInterface {
    name = 'FixPriceError1708436907329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" SET DEFAULT 0.00`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric(5,2)`);
    }

}

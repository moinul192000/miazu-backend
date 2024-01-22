import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactoredProductTable1704015464216 implements MigrationInterface {
    name = 'RefactoredProductTable1704015464216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sku"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "barcode"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "product_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_70b3f77ca8de13149b7f08d725c" UNIQUE ("product_code")`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "sku" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "UQ_46f236f21640f9da218a063a866" UNIQUE ("sku")`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "barcode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "barcode"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "UQ_46f236f21640f9da218a063a866"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "sku"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_70b3f77ca8de13149b7f08d725c"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "product_code"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "barcode" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sku" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku")`);
    }

}

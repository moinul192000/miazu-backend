import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProductEntity1703313494896 implements MigrationInterface {
    name = 'AddedProductEntity1703313494896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."products_fit_enum" AS ENUM('REGULAR_FIT', 'SLIM_FIT', 'LOOSE_FIT')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sku" character varying NOT NULL, "barcode" character varying, "name" character varying NOT NULL, "brand" character varying NOT NULL, "material" character varying NOT NULL, "fit" "public"."products_fit_enum" NOT NULL DEFAULT 'REGULAR_FIT', "description" character varying NOT NULL, CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "size" character varying NOT NULL, "color" character varying NOT NULL, "stock_level" integer NOT NULL, "product_id" uuid, CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_46737aaee612228b83e0313e1c" ON "product_variants" ("size") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_676ce18681ec0d2f3fd3edc9b1" ON "product_variants" ("color") `);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_676ce18681ec0d2f3fd3edc9b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46737aaee612228b83e0313e1c"`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_fit_enum"`);
    }

}

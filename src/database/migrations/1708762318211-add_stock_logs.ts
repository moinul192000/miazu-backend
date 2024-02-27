import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStockLogs1708762318211 implements MigrationInterface {
    name = 'AddStockLogs1708762318211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_adjustment_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "previous_stock_level" integer NOT NULL, "adjustment_amount" integer NOT NULL, "adjustment_date" TIMESTAMP NOT NULL, "adjusted_by" character varying(255) NOT NULL, "reason" text, "product_variant_id" uuid, CONSTRAINT "PK_6202c11abd8034e69a37cc9000c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_adjustment_logs" ADD CONSTRAINT "FK_ecb1907caa3d4ba9fc0b16adf83" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_adjustment_logs" DROP CONSTRAINT "FK_ecb1907caa3d4ba9fc0b16adf83"`);
        await queryRunner.query(`DROP TABLE "stock_adjustment_logs"`);
    }

}

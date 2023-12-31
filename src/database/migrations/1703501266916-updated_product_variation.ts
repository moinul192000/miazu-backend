import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedProductVariation1703501266916 implements MigrationInterface {
    name = 'UpdatedProductVariation1703501266916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_46737aaee612228b83e0313e1c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_676ce18681ec0d2f3fd3edc9b1"`);
        await queryRunner.query(`CREATE TABLE "promotional_flags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "featured" boolean NOT NULL DEFAULT false, "new_arrival" boolean NOT NULL DEFAULT false, "sale" boolean NOT NULL DEFAULT false, "sale_price" integer NOT NULL, CONSTRAINT "PK_d15b96ab0ef5f4e9ce189dfebb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN', 'MODERATOR')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "UQ_d13671f99779f6bb0c2cd9023fd" UNIQUE ("product_id", "size", "color")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "UQ_d13671f99779f6bb0c2cd9023fd"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`DROP TABLE "promotional_flags"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_676ce18681ec0d2f3fd3edc9b1" ON "product_variants" ("color") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_46737aaee612228b83e0313e1c" ON "product_variants" ("size") `);
    }

}

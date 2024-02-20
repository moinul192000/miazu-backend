import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductImage1708417743816 implements MigrationInterface {
    name = 'AddProductImage1708417743816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "thumbnail_image_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "thumbnail_image_url"`);
    }

}

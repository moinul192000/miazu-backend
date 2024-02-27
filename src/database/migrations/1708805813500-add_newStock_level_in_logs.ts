import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewStockLevelInLogs1708805813500 implements MigrationInterface {
    name = 'AddNewStockLevelInLogs1708805813500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_adjustment_logs" ADD "new_stock_level" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_adjustment_logs" DROP COLUMN "new_stock_level"`);
    }

}

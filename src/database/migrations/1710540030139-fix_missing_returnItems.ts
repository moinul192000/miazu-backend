import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMissingReturnItems1710540030139 implements MigrationInterface {
    name = 'FixMissingReturnItems1710540030139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_return" DROP CONSTRAINT "FK_a68a2a100f20ae235201a3ea0b2"`);
        await queryRunner.query(`ALTER TABLE "order_item_return" RENAME COLUMN "order_item_id" TO "orderItemId"`);
        await queryRunner.query(`ALTER TABLE "order_item_return" ADD CONSTRAINT "FK_154960fd931059fba6ac0c1fd58" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_return" DROP CONSTRAINT "FK_154960fd931059fba6ac0c1fd58"`);
        await queryRunner.query(`ALTER TABLE "order_item_return" RENAME COLUMN "orderItemId" TO "order_item_id"`);
        await queryRunner.query(`ALTER TABLE "order_item_return" ADD CONSTRAINT "FK_a68a2a100f20ae235201a3ea0b2" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSeq1705970809652 implements MigrationInterface {
  name = 'CreateSeq1705970809652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE order_id_seq;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SEQUENCE order_id_seq;`);
  }
}

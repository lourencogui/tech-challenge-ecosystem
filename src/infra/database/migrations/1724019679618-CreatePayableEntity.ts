import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePayableEntity1724019679618 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		const query = `CREATE TABLE "payables" (
				"id" serial PRIMARY KEY NOT NULL,
				"merchant_id" integer NOT NULL,
				"status" character varying(15) NOT NULL,
				"sub_total" decimal NOT NULL,
				"discount" decimal NOT NULL,
				"total" decimal NOT NULL,
				"due_date" timestamp without time zone NOT NULL,
				"created_at" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updated_at" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP)`;
		
		await queryRunner.query(query);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const query = `DROP TABLE IF EXISTS "payables"`;

		await queryRunner.query(query);
	}

}

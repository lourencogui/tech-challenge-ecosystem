import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionEntity1724018516770 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		const query = `CREATE TABLE "transactions" (
				"id" serial PRIMARY KEY NOT NULL,
				"merchant_id" integer NOT NULL,
				"amount" decimal NOT NULL,
				"description" character varying,
				"payment_method" character varying(15) NOT NULL,
				"card_number" character varying(4) NOT NULL,
				"card_holder_name" character varying NOT NULL,
				"card_expiration_date" character varying(5) NOT NULL,
				"card_cvv" character varying(3) NOT NULL,
				"created_at" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updated_at" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP)`;
		
		await queryRunner.query(query);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const query = `DROP TABLE IF EXISTS "transactions"`;

		await queryRunner.query(query);
	}

}
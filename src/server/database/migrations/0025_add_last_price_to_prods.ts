import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Adiciona a coluna last_price na tabela Products
        await trx.schema.alterTable(ETableNames.products, table => {
            table.decimal('last_price_purchased', 14, 2).nullable().defaultTo(null);
        });

        // 🔹 2. DROP trigger (se existir)
        await trx.raw(`
            DROP TRIGGER IF EXISTS trg_update_last_price_purchased
            ON ${ETableNames.purchase_details};
        `);

        // 🔹 3. DROP function (se existir)
        await trx.raw(`
            DROP FUNCTION IF EXISTS update_last_price_purchased();
        `);

        // 🔹 4. Cria ou substitui function
        await trx.raw(`
            CREATE OR REPLACE FUNCTION update_last_price_purchased()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE ${ETableNames.products}
                SET last_price_purchased = NEW.price
                WHERE id = NEW.prod_id;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 🔹 5. Cria trigger quando ocorre um INSERT ou UPDATE
        await trx.raw(`
            CREATE TRIGGER trg_update_last_price_purchased
            AFTER INSERT OR UPDATE ON ${ETableNames.purchase_details}
            FOR EACH ROW
            EXECUTE FUNCTION update_last_price_purchased();
        `);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {

        // 🔹 1. Remove trigger
        await trx.raw(`
            DROP TRIGGER IF EXISTS trg_update_last_price_purchased
            ON ${ETableNames.purchase_details};
        `);

        // 🔹 2. Remove function
        await trx.raw(`
            DROP FUNCTION IF EXISTS update_last_price_purchased();
        `);

        // 🔹 3. Remove column
        await trx.schema.alterTable(ETableNames.products, table => {
            table.dropColumn('last_price_purchased');
        });
    });
}
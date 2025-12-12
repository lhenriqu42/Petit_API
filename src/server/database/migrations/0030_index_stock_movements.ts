import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Cria indice
        await trx.raw(`
            CREATE INDEX idx_stock_mov_prod_date 
            ON ${ETableNames.stock_movements} (prod_id, created_at);
        `);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Remove o indice
        await trx.raw(`
            DROP INDEX IF EXISTS idx_stock_mov_prod_date;
        `);
    });
}

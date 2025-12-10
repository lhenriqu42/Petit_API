import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 1. Tabela product_costs
        await trx.schema.createTable(ETableNames.product_costs, table => {
            table.bigInteger('prod_id').primary().references('id').inTable(ETableNames.products);
            table.decimal('avg_cost', 14, 4).notNullable();
            table.decimal('last_cost', 14, 4).notNullable();
            table.integer('stock_quantity').notNullable();
            table.timestamp('updated_at').defaultTo(trx.fn.now()).notNullable();
        });
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 1. Remove a tabela product_costs
        await trx.schema.dropTableIfExists(ETableNames.product_costs);
    });
}

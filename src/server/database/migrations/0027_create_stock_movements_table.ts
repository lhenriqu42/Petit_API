import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Cria a tabela stock_moviments
        await trx.schema.createTable(ETableNames.stock_movements, table => {
            table.bigIncrements('id').primary().notNullable().unsigned().index();
            table.bigInteger('prod_id').notNullable().unsigned().references('id').inTable(ETableNames.products).index();
            table.enum('direction', ['in', 'out']).notNullable().index();
            table.integer('quantity').notNullable().unsigned(); // sempre positivo
            table.decimal('unit_cost', 14, 4).nullable().defaultTo(null); // pode ser null em movimentos que não têm custo explícito
            table.decimal('total_cost', 14, 4).nullable().defaultTo(null);
            table.string('origin_type', 30).nullable().defaultTo(null).index();
            table.bigInteger('origin_id').nullable().defaultTo(null).index();
            table.string('notes', 255).nullable().defaultTo(null);
            table.timestamp('created_at').defaultTo(trx.fn.now()).notNullable();
            table.boolean('affect_wac').notNullable().index();
        });
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Remove a tabela stock_movements
        await trx.schema.dropTableIfExists(ETableNames.stock_movements);
    });
}
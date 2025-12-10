import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('stocks', table => {
        table.bigIncrements('id').primary().index();
        table.bigInteger('prod_id').index().notNullable().references('id').inTable(ETableNames.products).onUpdate('CASCADE').onDelete('RESTRICT');
        table.integer('stock').notNullable().defaultTo(0);
        table.timestamps(true, true);
        
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('stocks');
}
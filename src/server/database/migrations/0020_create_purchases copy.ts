import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(ETableNames.purchases, table => {
        table.bigIncrements('id').primary().index();
        table.bigInteger('supplier_id').index().notNullable().references('id').inTable(ETableNames.suppliers).onUpdate('CASCADE').onDelete('RESTRICT').unsigned();
        table.decimal('total_value').notNullable();
        table.boolean('effected').notNullable().defaultTo(false);
        table.timestamps(true, true);

    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(ETableNames.purchases);
}
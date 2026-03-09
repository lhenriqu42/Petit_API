import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(ETableNames.packs, table => {
        table.bigIncrements('id').primary().index();
        table.string('description').notNullable();
        table.integer('prod_qnt').notNullable().unsigned().unique();
        table.timestamps(true, true);

    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(ETableNames.packs);
}
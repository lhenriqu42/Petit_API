import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('stocks', table => {
        table.unique(['prod_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('stocks', table => {
        table.dropUnique(['prod_id']);
    });
}

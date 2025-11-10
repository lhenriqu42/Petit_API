import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(ETableNames.packs, table => {
        table.bigIncrements('id').primary().index();
        table.string('description').notNullable();
        table.integer('prod_qnt').notNullable().unsigned();
        table.timestamps(true, true);
        table.dateTime('deleted_at');
    });

    // índice único apenas para registros não deletados
    await knex.raw(`
        CREATE UNIQUE INDEX packs_prod_qnt_unique_not_deleted
        ON ${ETableNames.packs} (prod_qnt)
        WHERE deleted_at IS NULL
    `);
}

export async function down(knex: Knex): Promise<void> {
    // remove o índice antes de dropar a tabela (boa prática)
    await knex.raw('DROP INDEX IF EXISTS packs_prod_qnt_unique_not_deleted;');
    await knex.schema.dropTableIfExists(ETableNames.packs);
}

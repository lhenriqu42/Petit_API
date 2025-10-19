import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(ETableNames.prod_packs, table => {
        table.bigInteger('pack_id').notNullable().references('id').inTable(ETableNames.packs).onUpdate('CASCADE').onDelete('RESTRICT').unsigned();
        table.bigInteger('prod_id').notNullable().references('id').inTable(ETableNames.products).onUpdate('CASCADE').onDelete('RESTRICT').unsigned();
        table.string('identification').nullable();
        table.string('name').nullable();
        table.timestamps(true, true);

        // chave primária composta
        table.primary(['pack_id', 'prod_id']);
        table.index(['pack_id', 'prod_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(ETableNames.prod_packs);
}
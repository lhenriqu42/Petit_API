import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(ETableNames.prod_packs, table => {
        table.bigIncrements('id').primary().index();
        table.bigInteger('pack_id').index().notNullable().references('id').inTable(ETableNames.packs).onUpdate('CASCADE').onDelete('RESTRICT').unsigned();
        table.bigInteger('prod_id').index().notNullable().references('id').inTable(ETableNames.products).onUpdate('CASCADE').onDelete('RESTRICT').unsigned();
        table.string('identification').nullable();
        table.string('name').notNullable();
        table.timestamps(true, true);
 
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(ETableNames.prod_packs);
}
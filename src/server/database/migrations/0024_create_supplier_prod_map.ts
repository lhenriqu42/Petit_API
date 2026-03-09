import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';




export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(ETableNames.supplier_prod_map, table => {
        table.increments('id').primary().index().unsigned();
        table.string('supplier_prod_code').notNullable();
        table.string('supplier_prod_name').notNullable();


        table.string('supplier_prod_id').notNullable();
        table.integer('supplier_id').notNullable().references('id').inTable(ETableNames.suppliers).onDelete('CASCADE').unsigned().index();

        table.integer('prod_id').notNullable().references('id').inTable(ETableNames.products).onDelete('CASCADE').unsigned().index();
        table.integer('pack_id').nullable().references('id').inTable(ETableNames.packs).onDelete('CASCADE').unsigned().index();

        table.timestamps(true, true);
        table.unique(['supplier_id', 'supplier_prod_id'], { indexName: 'uq_supplier_prod_map' });
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(ETableNames.supplier_prod_map);
}
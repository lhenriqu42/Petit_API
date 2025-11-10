import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(ETableNames.purchase_details, table => {
        table.bigIncrements('id').primary().index();
        table.enum('type', ['PACK', 'PRODUCT']).notNullable();
        table.bigInteger('purchase_id').index().notNullable().references('id').inTable(ETableNames.purchases).onUpdate('CASCADE').onDelete('CASCADE').unsigned();
        table.bigInteger('pack_id').index().nullable().references('id').inTable(ETableNames.packs).onUpdate('CASCADE').onDelete('RESTRICT').unsigned();
        table.integer('pack_deleted_qnt').nullable().unsigned();    // Will be inserted when the pack in pack_id is deleted
        table.bigInteger('prod_id').index().notNullable().references('id').inTable(ETableNames.products).onUpdate('CASCADE').onDelete('RESTRICT').unsigned();
        table.integer('quantity').notNullable().unsigned();
        table.decimal('price').notNullable();
        table.decimal('pricetotal').notNullable();
        table.timestamps(true, true);

    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(ETableNames.purchase_details);
}
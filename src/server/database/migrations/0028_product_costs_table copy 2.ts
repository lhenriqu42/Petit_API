import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {

        // 1. Tabela product_costs
        await trx.schema.createTable(ETableNames.product_costs, table => {
            table.bigInteger('prod_id').primary().references('id').inTable(ETableNames.products);
            table.decimal('avg_cost', 14, 4).notNullable();
            table.decimal('last_cost', 14, 4).notNullable();
            table.integer('stock_quantity').notNullable();
            table.timestamp('updated_at').defaultTo(trx.fn.now()).notNullable();
        });

        // 2. Função
        await trx.raw(`
            CREATE OR REPLACE FUNCTION recalc_product_costs()
            RETURNS TRIGGER AS $$
            DECLARE
                v_old_stock INT := 0;
                v_old_wac DECIMAL(14,4) := 0;
                v_new_stock INT;
                v_new_wac DECIMAL(14,4);
            BEGIN
                -- Tenta buscar custos atuais
                SELECT stock_quantity, avg_cost
                INTO v_old_stock, v_old_wac
                FROM product_costs
                WHERE prod_id = NEW.prod_id
                FOR UPDATE;

                -- Se não existir ainda → insere linha base
                IF NOT FOUND THEN
                    INSERT INTO product_costs (prod_id, avg_cost, last_cost, stock_quantity)
                    VALUES (NEW.prod_id, 0, 0, 0);

                    v_old_stock := 0;
                    v_old_wac := 0;
                END IF;


                ---------------------------------------------------------------------
                -- ENTRADA: recalcula WAC
                ---------------------------------------------------------------------
                IF NEW.direction = 'in' THEN
                    v_new_stock := v_old_stock + NEW.quantity;

                    v_new_wac := (
                        (v_old_stock * v_old_wac) +
                        (NEW.quantity * COALESCE(NEW.unit_cost, 0))
                    ) / NULLIF(v_new_stock, 0);

                    UPDATE product_costs
                    SET 
                        stock_quantity = v_new_stock,
                        avg_cost = v_new_wac,
                        last_cost = COALESCE(NEW.unit_cost, last_cost),
                        updated_at = NOW()
                    WHERE prod_id = NEW.prod_id;

                ---------------------------------------------------------------------
                -- SAÍDA: não recalcula WAC
                ---------------------------------------------------------------------
                ELSE
                    v_new_stock := v_old_stock - NEW.quantity;

                    UPDATE product_costs
                    SET 
                        stock_quantity = v_new_stock,
                        updated_at = NOW()
                    WHERE prod_id = NEW.prod_id;
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 3. Trigger
        await trx.raw(`
            CREATE TRIGGER trg_recalc_product_costs
            AFTER INSERT ON ${ETableNames.stock_movements}
            FOR EACH ROW
            EXECUTE FUNCTION recalc_product_costs();
        `);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {

        await trx.raw(`
            DROP TRIGGER IF EXISTS trg_recalc_product_costs ON ${ETableNames.stock_movements};
        `);

        await trx.raw(`
            DROP FUNCTION IF EXISTS recalc_product_costs();
        `);

        await trx.schema.dropTableIfExists(ETableNames.product_costs);
    });
}

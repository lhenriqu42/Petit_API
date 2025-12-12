import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Cria funcao para atualizar total de stock_moviments
        await trx.raw(`
            CREATE OR REPLACE FUNCTION recalc_stock_movements(
                m ${ETableNames.stock_movements},
                old_wac DECIMAL(14,4)
            )
            RETURNS ${ETableNames.stock_movements} AS $$
            BEGIN
                IF m.direction = 'out' THEN
                    -- Saída → usa WAC antigo
                    m.unit_cost := old_wac;
                END IF;
                m.total_cost := ROUND(m.quantity * m.unit_cost, 4);        
                RETURN m;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 🔹 2. Cria funcao para atualizar product_costs
        await trx.raw(`
            CREATE OR REPLACE FUNCTION recalc_product_costs(
                m ${ETableNames.stock_movements}, 
                old_stock INT,
                old_wac DECIMAL(14,4)
            )
            RETURNS VOID AS $$
            DECLARE
                v_new_stock INT;
                v_new_wac DECIMAL(14,4);
            BEGIN
                -- Calcula novo stock
                IF m.direction = 'in' THEN
                    v_new_stock := old_stock + m.quantity;
                ELSE
                    v_new_stock := old_stock - m.quantity;
                END IF;

                ---------------------------------------------------------------------
                -- recalcula WAC
                ---------------------------------------------------------------------
                IF m.affect_wac = true THEN

                    IF old_stock <= 0 THEN
                        -- estamos "normalizando" um estoque negativo
                        -- usa APENAS o custo da compra
                        v_new_wac := m.unit_cost;
                    ELSE
                        v_new_wac := ((old_stock * old_wac) + (m.quantity * COALESCE(m.unit_cost, 0))) / NULLIF(v_new_stock, 0);
                    END IF;

                    UPDATE ${ETableNames.product_costs}
                    SET 
                        stock_quantity = v_new_stock,
                        avg_cost = v_new_wac,
                        last_cost = COALESCE(m.unit_cost, last_cost),
                        updated_at = NOW()
                    WHERE prod_id = m.prod_id;

                ---------------------------------------------------------------------
                -- não recalcula WAC
                ---------------------------------------------------------------------
                ELSE

                    UPDATE ${ETableNames.product_costs}
                    SET 
                        stock_quantity = v_new_stock,
                        updated_at = NOW()
                    WHERE prod_id = m.prod_id;
                END IF;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 🔹 3. Cria funcao trigger para atualizar stock_moviments e product_costs
        await trx.raw(`
            CREATE OR REPLACE FUNCTION trg_stock_movements_before_insert()
            RETURNS trigger AS $$
            DECLARE
                v_old_stock INT := 0;
                v_old_wac DECIMAL(14,4) := 0;
            BEGIN
                -- Caso affect_wac não tenha sido passado
                IF NEW.affect_wac IS NULL THEN 
                    NEW.affect_wac := CASE
                        WHEN NEW.direction = 'in' THEN true
                        ELSE false
                    END;
                END IF;

                -- Busca custos atuais com FOR UPDATE (para lock)
                SELECT stock_quantity, avg_cost
                INTO v_old_stock, v_old_wac
                FROM ${ETableNames.product_costs}
                WHERE prod_id = NEW.prod_id
                FOR UPDATE;

                -- Caso não exista custos ainda — cria linha base
                IF NOT FOUND THEN
                    INSERT INTO ${ETableNames.product_costs} (prod_id, avg_cost, last_cost, stock_quantity)
                    VALUES (NEW.prod_id, 0, 0, 0)
                    ON CONFLICT (prod_id) DO NOTHING;

                    v_old_stock := 0;
                    v_old_wac := 0;
                END IF;

                -- 🔹 Recalcula movimentação → MODIFICA NEW
                NEW := recalc_stock_movements(NEW, v_old_wac);

                -- 🔹 Agora recalcula os custos → usa os campos já modificados
                PERFORM recalc_product_costs(NEW, v_old_stock, v_old_wac);

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 🔹 4. Cria trigger para executar a função antes de inserir em stock_movements
        await trx.raw(`
            CREATE TRIGGER trg_recalc_product_costs
            BEFORE INSERT ON ${ETableNames.stock_movements} 
            FOR EACH ROW
            EXECUTE FUNCTION trg_stock_movements_before_insert();
        `);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Remove o trigger
        await trx.raw(`
            DROP TRIGGER IF EXISTS trg_recalc_product_costs ON ${ETableNames.stock_movements};
        `);
        // 🔹 2. Remove a função trigger
        await trx.raw(`
            DROP FUNCTION IF EXISTS trg_stock_movements_before_insert();
        `);
        // 🔹 3. Remove a função de recalculo de product_costs
        await trx.raw(`
            DROP FUNCTION IF EXISTS recalc_product_costs(stock_movements, INT, DECIMAL);
        `);
        // 🔹 4. Remove a função de recalculo de stock_movements
        await trx.raw(`
            DROP FUNCTION IF EXISTS recalc_stock_movements(stock_movements, DECIMAL);
        `);
    });
}

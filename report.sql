WITH
-- Último movimento ANTES da data_inicio (estoque inicial)
ini AS (
    SELECT DISTINCT ON (prod_id)
        prod_id,
        stock_after_movement AS estoque_inicial,
        wac_after_movement AS wac_inicial,
        stock_cost_after_movement AS custo_inicial
    FROM stock_movements
    WHERE created_at < :data_inicio
    ORDER BY prod_id, created_at DESC
),

-- Último movimento ATÉ data_fim (estoque final real)
fim AS (
    SELECT DISTINCT ON (prod_id)
        prod_id,
        stock_after_movement AS estoque_final,
        wac_after_movement AS wac_final,
        stock_cost_after_movement AS custo_final
    FROM stock_movements
    WHERE created_at <= :data_fim
    ORDER BY prod_id, created_at DESC
),

-- Movimentos dentro do período
movs_periodo AS (
    SELECT *
    FROM stock_movements
    WHERE created_at >= :data_inicio
      AND created_at <= :data_fim
),

entradas AS (
    SELECT 
        prod_id,
        SUM(quantity) AS qty,
        SUM(total_cost) AS cost
    FROM movs_periodo
    WHERE direction = 'in'
    GROUP BY prod_id
),

saidas AS (
    SELECT 
        prod_id,
        SUM(quantity) AS qty,
        SUM(total_cost) AS cost
    FROM movs_periodo
    WHERE direction = 'out'
    GROUP BY prod_id
)

SELECT
    p.id AS prod_id,

    COALESCE(i.estoque_inicial, 0) AS estoque_inicial,
    COALESCE(i.wac_inicial, 0) AS wac_inicial,
    COALESCE(i.custo_inicial, 0) AS custo_inicial,

    COALESCE(ent.qty, 0) AS entradas,
    COALESCE(ent.cost, 0) AS entradas_custo,

    COALESCE(sai.qty, 0) AS saídas,
    COALESCE(sai.cost, 0) AS cpv,

    COALESCE(f.estoque_final, 0) AS estoque_final,
    COALESCE(f.wac_final, 0) AS wac_final,
    COALESCE(f.custo_final, 0) AS custo_final

FROM products p
LEFT JOIN ini i  ON i.prod_id = p.id
LEFT JOIN fim f  ON f.prod_id = p.id
LEFT JOIN entradas ent ON ent.prod_id = p.id
LEFT JOIN saidas sai   ON sai.prod_id = p.id

ORDER BY p.id;

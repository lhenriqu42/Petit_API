WITH movs AS (
    SELECT 
        prod_id,
        direction,
        quantity,
        total_cost,
        created_at
    FROM stock_movements
    WHERE created_at <= :data_fim
),
-- estoque inicial por produto
estoque_inicial AS (
    SELECT 
        prod_id,
        SUM(
            CASE 
                WHEN direction = 'in'  THEN quantity
                WHEN direction = 'out' THEN -quantity
            END
        ) AS qty
    FROM movs
    WHERE created_at < :data_inicio
    GROUP BY prod_id
),
-- movimentos dentro do período
movs_periodo AS (
    SELECT *
    FROM movs
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

    COALESCE(ei.qty, 0) AS estoque_inicial,

    COALESCE(ent.qty, 0) AS entradas,
    COALESCE(ent.cost, 0) AS entradas_custo,

    COALESCE(sai.qty, 0) AS saídas,
    COALESCE(sai.cost, 0) AS cpv,

    -- estoque final = inicial + entradas - saídas
    COALESCE(ei.qty, 0)
        + COALESCE(ent.qty, 0)
        - COALESCE(sai.qty, 0) AS estoque_final

FROM products p
LEFT JOIN estoque_inicial ei ON ei.prod_id = p.id
LEFT JOIN entradas ent        ON ent.prod_id = p.id
LEFT JOIN saidas sai          ON sai.prod_id = p.id

ORDER BY p.id;

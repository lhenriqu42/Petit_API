WITH movs AS (
    SELECT *
    FROM stock_movements
    WHERE prod_id = :prodId
),
-- estoque inicial = soma das quantidades antes da data_inicio
estoque_inicial AS (
    SELECT 
        COALESCE(SUM(
            CASE 
                WHEN direction = 'in' THEN quantity
                ELSE -quantity
            END
        ), 0) AS qty
    FROM movs
    WHERE created_at < :data_inicio
),
-- movimentos no período
movs_periodo AS (
    SELECT *
    FROM movs
    WHERE created_at >= :data_inicio
      AND created_at <= :data_fim
),
entradas AS (
    SELECT 
        COALESCE(SUM(quantity), 0) AS qty,
        COALESCE(SUM(total_cost), 0) AS cost
    FROM movs_periodo
    WHERE direction = 'in'
),
saidas AS (
    SELECT 
        COALESCE(SUM(quantity), 0) AS qty,
        COALESCE(SUM(total_cost), 0) AS cost
    FROM movs_periodo
    WHERE direction = 'out'
),
-- estoque final = inicial + entradas – saídas
estoque_final AS (
    SELECT 
        (SELECT qty FROM estoque_inicial) +
        (SELECT qty FROM entradas) -
        (SELECT qty FROM saidas) AS qty
)
SELECT 
    (SELECT qty FROM estoque_inicial) AS estoque_inicial,
    (SELECT qty FROM entradas) AS entradas,
    (SELECT qty FROM saidas) AS saidas,
    (SELECT cost FROM saidas) AS cpv,
    (SELECT qty FROM estoque_final) AS estoque_final
;

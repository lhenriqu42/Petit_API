INSERT INTO stock_movements (prod_id, direction, quantity, unit_cost, total_cost, created_at, affect_wac)
SELECT s.prod_id,
       'in' AS direction,
       s.stock AS quantity,
       COALESCE(p.last_price_purchased, 0) AS unit_cost,
       s.stock * COALESCE(p.last_price_purchased, 0) AS total_cost,
       NOW(),
       TRUE
FROM stocks s
LEFT JOIN products p ON p.id = s.prod_id;



=============================================

-- SOLUCAO 2
WITH LastPurchase AS (
    SELECT DISTINCT ON (prod_id)
        prod_id,
        price,
        type,
        pack_id
    FROM purchase_details
    ORDER BY prod_id, created_at DESC
),
CalculatedPackSize AS (
    SELECT
        s.prod_id,
        s.stock,
        lp.price,
        lp.type,
        pk.prod_qnt,
        CASE
            WHEN lp.type = 'PACK' THEN COALESCE(pk.prod_qnt, 1)
            ELSE 1
        END AS packSize
    FROM stocks s
    LEFT JOIN LastPurchase lp ON lp.prod_id = s.prod_id
    LEFT JOIN packs pk ON pk.id = lp.pack_id
)
SELECT
    c.prod_id,
    'in' AS direction,
    c.stock AS quantity,
    c.price / c.packSize AS unit_cost,
    c.stock * c.price / c.packSize AS total_cost,
    NOW() AS created_at,
    TRUE AS affect_wac
FROM CalculatedPackSize c;

=============================================



-- SOLUCAO 3
WITH LastPurchase AS (
    SELECT DISTINCT ON (prod_id)
        prod_id,
        price,
        type,
        pack_id
    FROM purchase_details
    ORDER BY prod_id, created_at DESC
),
CalculatedPackSize AS (
    SELECT
        s.prod_id,
        s.stock,
        lp.price,
        lp.type,
        pk.prod_qnt,
        CASE
            WHEN lp.type = 'PACK' THEN COALESCE(pk.prod_qnt, 1)
            ELSE 1
        END AS packSize
    FROM stocks s
    -- LEFT JOIN LastPurchase lp ON lp.prod_id = s.prod_id -- COM NULOS
    JOIN LastPurchase lp ON lp.prod_id = s.prod_id -- COM NULOS
    LEFT JOIN packs pk ON pk.id = lp.pack_id
)
-- INSERT INTO product_costs (
--     prod_id,
--     avg_cost,
--     last_cost,
--     stock_quantity,
--     updated_at
-- )
SELECT
    c.prod_id,
    c.price / c.packSize AS avg_cost,
    c.price / c.packSize AS last_cost,
    c.stock AS stock_quantity,
    NOW() AS updated_at
FROM CalculatedPackSize c
-- ON CONFLICT (prod_id)
-- DO UPDATE SET
--     avg_cost      = EXCLUDED.avg_cost,
--     last_cost     = EXCLUDED.last_cost,
--     stock_quantity = EXCLUDED.stock_quantity,
--     updated_at     = EXCLUDED.updated_at;
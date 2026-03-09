import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError from '../../../server/shared/Errors';
import { IProdInfoDTO, IProdUtilsDTO } from './Types/DTOs';

const prodInfoQuery = `
    WITH
    -- Último movimento ANTES da data_inicio (estoque inicial)
    ini AS (
        SELECT DISTINCT ON (prod_id)
            prod_id,
            stock_after_movement AS estoque_inicial,
            wac_after_movement AS wac_inicial,
            stock_cost_after_movement AS custo_inicial
        FROM ${ETableNames.stock_movements}
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
        FROM ${ETableNames.stock_movements}
        WHERE created_at <= :data_fim
        ORDER BY prod_id, created_at DESC
    ),

    -- Movimentos dentro do período
    movs_periodo AS (
        SELECT *
        FROM ${ETableNames.stock_movements}
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
    ),

    sales AS (
        SELECT 
            sm.prod_id,
            SUM(sd.pricetotal) AS revenue,
            SUM(sd.quantity) AS number_of_sales
        FROM movs_periodo sm
        LEFT JOIN ${ETableNames.saleDetails} sd ON sd.sale_id = sm.origin_id AND sm.origin_type = 'sale'
        GROUP BY sm.prod_id
    ),

    base AS (
        SELECT
            p.id AS prod_id,

            COALESCE(i.estoque_inicial, 0) AS initial_stock,
            COALESCE(f.estoque_final, 0) AS final_stock,

            COALESCE(ent.qty, 0) AS entries_qty,
            COALESCE(sai.qty, 0) AS exits_qty,

            COALESCE(sai.cost, 0) AS CPV,
            COALESCE(s.revenue, 0) AS revenue,
            COALESCE(s.number_of_sales, 0) AS number_of_sales,

            COALESCE(s.revenue, 0) - COALESCE(sai.cost, 0) AS profit,
            COALESCE(
                CASE 
                    WHEN COALESCE(s.revenue, 0) = 0 THEN 0
                    ELSE (COALESCE(s.revenue, 0) - COALESCE(sai.cost, 0)) / COALESCE(s.revenue, 0) * 100
                END, 0) AS margin_perc
        FROM products p
        LEFT JOIN ini i ON i.prod_id = p.id
        LEFT JOIN fim f ON f.prod_id = p.id
        LEFT JOIN entradas ent ON ent.prod_id = p.id
        LEFT JOIN saidas sai ON sai.prod_id = p.id
        LEFT JOIN sales s ON s.prod_id = p.id
        WHERE sai.cost IS NOT NULL
    ),

    totals AS (
        SELECT
            SUM(profit) AS total_profit
        FROM base
    ),

    abc AS (
        SELECT
            b.*,
            (b.profit / t.total_profit) AS individual_participation,
            SUM(b.profit) OVER(ORDER BY b.profit DESC) / t.total_profit AS cumulative_participation,
            CASE
                WHEN SUM(b.profit) OVER(ORDER BY b.profit DESC) / t.total_profit <= :abc_a_threshold THEN 'A'
                WHEN SUM(b.profit) OVER(ORDER BY b.profit DESC) / t.total_profit <= :abc_b_threshold THEN 'B'
                ELSE 'C'
            END AS profit_group
            
        FROM base b CROSS JOIN totals t
    )

    SELECT *
    FROM abc
    ORDER BY revenue DESC;

`;



export interface IReportDataDTO {
    revenue: number;
    profit: number;
    liquidProfit: number;
    MB: number;
    ML: number;
    ticketAverage: number;
    details: IProdUtilsDTO[];
}

export const getReportData = async (range: { start: Date, end: Date }): Promise<IReportDataDTO> => {
    try {
        const trx_res = await Knex.transaction(async trx => {
            const data = await trx.raw<IProdInfoDTO[]>(prodInfoQuery, {
                data_inicio: range.start,
                data_fim: range.end,
                abc_a_threshold: 0.8,
                abc_b_threshold: 0.95
            });

            const utils: IProdUtilsDTO[] = data.map(info => {
                const profit = info.profit;
                const MB = (info.profit / info.revenue) * 100 || 0;
                const AvarageStock = (info.initial_stock + info.final_stock) / 2 || 0;
                const GE = info.CPV / AvarageStock || 0;
                const diasDeEstoque = (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24) / GE || 0;
                return {
                    prod_id: info.prod_id,
                    revenue: info.revenue,
                    number_of_sales: info.number_of_sales,
                    CPV: info.CPV,
                    profit,
                    MB,
                    liquidProfit: profit,                   // Subtrair despesas operacionais
                    ML: MB,                                 // Considerar despesas operacionais
                    ticketAverage: info.revenue / info.number_of_sales || 0,
                    GE,
                    diasDeEstoque,
                    idadeMediaEstoque: 365 / GE || 0,
                    CurvaABC: {
                        group: info.profit_group,
                        percentage: info.individual_participation,
                        acumulatedPercentage: info.cumulative_participation,
                    },
                };
            });

            const { revenue, profit, liquidProfit, number_of_sales } = utils.reduce((acc, curr) => ({
                revenue: acc.revenue + curr.revenue,
                profit: acc.profit + curr.profit,
                liquidProfit: acc.liquidProfit + curr.liquidProfit,
                number_of_sales: acc.number_of_sales + curr.number_of_sales,
            }), { revenue: 0, profit: 0, liquidProfit: 0, number_of_sales: 0 });
            const MB = (profit / revenue) * 100 || 0;
            const ML = (liquidProfit / revenue) * 100 || 0;

            return {
                revenue,
                profit,
                liquidProfit,
                MB,
                ML,
                ticketAverage: revenue / number_of_sales || 0,
                details: utils,
            };
        });
        return trx_res;
    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        console.error(e);
        throw new AppError('Error getting report data');
    }
};
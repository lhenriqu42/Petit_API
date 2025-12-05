import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError from '../../../server/shared/Errors';
import { IUtilsDTO } from './Types/DTOs';

// export interface IUtilsDTO {
//     revenue: number;            // Faturamento = soma(valor_total_das_vendas)
//     CPV: number;                // CPV = Estoque Inicial + Compras – Estoque Final
//     profit: number;             // Lucro Bruto = Faturamento - CPV
//     MB: number;                 // Margem Bruta (MB) = Lucro Bruto / Faturamento
//     liquidProfit: number;       // Lucro Líquido = Lucro Bruto - Despesas Operacionais
//     ML: number;                 // Margem Líquida (ML) = Lucro Líquido / Faturamento
//     ticketAverage: number;      // Ticket Médio = Faturamento / Número de Vendas
//     GE: number;                 // Giro de Estoque (GE) = CPV / Estoque Médio
//     CoberturaDeEstoque: number; // Cobertura de Estoque (DE) = Estoque Atual / ((CPV / Número de dias do período))
//     idadeMediaEstoque: number;  // Idade Média do Estoque = 365 / GE
//     inventario: number;         // Inventário = soma(quantidade * custo_unitário)
//     CurvaABC: {
//         A: number; // Percentual de produtos na categoria A
//         B: number; // Percentual de produtos na categoria B
//         C: number; // Percentual de produtos na categoria C
//     };
// }
export const getReportData = async (range: { start: Date, end: Date }): Promise<undefined> => {
    try {
        const trx_res = await Knex.transaction(async trx => {
            // 🔹 1. Faturamento
            const revenueResult = await trx(ETableNames.sales)
                .join(ETableNames.saleDetails, 'sales.id', 'sale_details.sale_id')
                .whereBetween(`${ETableNames.sales}.created_at`, [range.start, range.end])
                .sum(`${ETableNames.saleDetails}.total_value as revenue`)
                .first();
            const revenue = Number(revenueResult);



            // 🔹 2. CPV
            const initialStock = 0;                // Mudar assim que implementar estoque diario, pegar tanto a data inicial quanto a final da tabela stock_history
            const finalStockResult = await trx(ETableNames.stocks)
                .sum('stock as finalStock')
                .first();
            const finalStock = Number(finalStockResult);
            const purchasesResult = await trx(ETableNames.purchases)
                .whereBetween('created_at', [range.start, range.end])
                .sum('total_value as purchases')
                .first();
            const purchases = Number(purchasesResult);
            const CPV = initialStock + purchases - finalStock;



            // 🔹 3. Lucro Bruto

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
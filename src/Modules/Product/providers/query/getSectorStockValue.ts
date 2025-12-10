import { Knex } from '../../../../server/database/knex';
import { ETableNames } from '../../../../server/database/ETableNames';

export interface IResponse {
    sector: number;
    value: number;
}

export const getSectorStockValue = async (sectors = [1, 2, 3, 4]): Promise<IResponse[] | Error> => {
    try {
        const result = await Knex<IResponse[]>(ETableNames.products)
            .join(ETableNames.product_costs, `${ETableNames.product_costs}.prod_id`, `${ETableNames.products}.id`)
            .select(`${ETableNames.products}.sector`, Knex.raw(`sum(${ETableNames.product_costs}.stock_quantity * ${ETableNames.products}.price) as value`))
            .whereIn(`${ETableNames.products}.sector`, sectors)
            .andWhere(`${ETableNames.product_costs}.stock_quantity`, '>', 0)
            .groupBy(`${ETableNames.products}.sector`)
            .orderBy('sector');

        return result;
    } catch (error) {
        console.error(error);
        return new Error(`Failed to fetch data: ${error}`);
    }
};
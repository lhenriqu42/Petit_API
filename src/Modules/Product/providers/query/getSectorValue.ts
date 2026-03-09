import { Knex } from '../../../../server/database/knex';
import { ETableNames } from '../../../../server/database/ETableNames';

export interface IResponse {
    sector: number;
    quantity: number;
}

export const getSectorValue = async (init: Date, end: Date): Promise<IResponse[] | Error> => {
    try {
        const result = await Knex(ETableNames.saleDetails)
            .join(ETableNames.sales, `${ETableNames.sales}.id`, `${ETableNames.saleDetails}.sale_id`)
            .join(ETableNames.fincashs, `${ETableNames.fincashs}.id`, `${ETableNames.sales}.fincash_id`)
            .join(ETableNames.products, `${ETableNames.products}.id`, `${ETableNames.saleDetails}.prod_id`)
            .select(
                `${ETableNames.products}.sector as sector`,
                Knex.raw('SUM(sale_details.pricetotal) as value')
            )
            .where(`${ETableNames.sales}.deleted_at`, null)
            .whereIn(`${ETableNames.products}.sector`, [1, 2, 3, 4])
            .whereBetween(`${ETableNames.fincashs}.created_at`, [init, end])
            .groupBy('sector')
            .orderBy('sector');

        return result;
    } catch (error) {
        console.error(error);
        return new Error(`Failed to fetch data: ${error}`);
    }
};
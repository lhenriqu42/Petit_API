
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

interface IGetSales {
    sale_id: number,
    obs: string,
    created_at: Date,
    deleted_at: Date,
    total_value: number,
}

export const getSales = async (page: number, limit: number): Promise<IGetSales[] | Error> => {
    try {

        const result = await Knex<IGetSales>(ETableNames.sales)
            .join(ETableNames.saleDetails, `${ETableNames.sales}.id`, `${ETableNames.saleDetails}.sale_id`)
            .select(
                `${ETableNames.sales}.id as sale_id`,
                `${ETableNames.sales}.obs`,
                `${ETableNames.sales}.created_at`,
                `${ETableNames.sales}.deleted_at`,
                Knex.raw('SUM(sale_details.pricetotal) as total_value')
            )
            .groupBy(`${ETableNames.sales}.id`)
            .orderBy(`${ETableNames.sales}.id`, 'desc')
            .offset((page - 1) * limit)
            .limit(limit);

        return result;

    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

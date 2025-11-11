import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const countSales = async (): Promise<number | Error> => {
    try {
        const countQuery: { count: number }[] = await Knex(ETableNames.saleDetails)
            .countDistinct('sale_id as count');


        if (Number.isInteger(countQuery[0].count)) return Number(countQuery[0].count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};
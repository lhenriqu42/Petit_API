import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const countSaleDetails = async (sale_id: number): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.saleDetails)
            .where('sale_id', sale_id)
            .count<[{ count: number }]>('* as count');

        if (Number.isInteger(count)) return Number(count);
        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const getTotalByFincash = async (fincash_id: number): Promise<number | Error> => {
    try {
        const response: { sum: number }[] = await Knex(ETableNames.sales)
            .join(ETableNames.saleDetails, `${ETableNames.sales}.id`, `${ETableNames.saleDetails}.sale_id`)
            .where(`${ETableNames.sales}.fincash_id`, fincash_id)
            .andWhere(`${ETableNames.sales}.deleted_at`, null)
            .sum(`${ETableNames.saleDetails}.pricetotal`);
        
        return response[0].sum ?? 0;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
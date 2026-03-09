import { Knex } from '../../../server/database/knex';
import { ETableNames } from '../../../server/database/ETableNames';


export const getDataByDate = async (init: Date, end: Date): Promise<number | Error> => {
    try {
        const result = await Knex(ETableNames.payments)
            .sum('value')
            .whereBetween('expiration', [init, end]);

        return result[0].sum;
    } catch (e) {
        console.error(e); // Logue o erro para depuração
        return new Error('Get Failed');
    }
};

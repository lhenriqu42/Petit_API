import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISale } from '../../../server/database/models';

export const getById = async (id: number): Promise<ISale | Error> => {
    try {
        const result = await Knex(ETableNames.sales)
            .select('*')
            .where('id', '=', id)
            .first();

        if (result) return result;
        return new Error('Get By ID Failed NUM TA');
    } catch (e) {
        console.log(e);
        return new Error('Get By ID Failed NUM TA');
    }
};
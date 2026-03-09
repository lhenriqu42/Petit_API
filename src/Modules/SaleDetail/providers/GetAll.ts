import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISaleDetails } from '../../../server/database/models';

export const getAll = async (page: number, limit: number): Promise<ISaleDetails[] | Error> => {
    try {
        const result = await Knex(ETableNames.saleDetails)
            .select('*')
            .offset((page - 1) * limit)
            .limit(limit);

        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
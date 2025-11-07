import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISupplier } from '../../../server/database/models';

export const getAll = async (page: number, limit: number, filter: string): Promise<ISupplier[] | Error> => {
    try {
        const result = await Knex(ETableNames.suppliers)
            .select('*')
            .where('name', 'ilike', `%${filter}%`)
            .andWhere('deleted_at', null)
            .offset((page - 1) * limit)
            .limit(limit)
            .orderBy('id', 'desc');

        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get All Failed');
    }
};
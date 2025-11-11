import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IGroup } from '../../../server/database/models';

export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<IGroup[] | Error> => {
    try {
        const result = await Knex(ETableNames.groups)
            .select('*')
            .where('id', '=', id)
            .orWhere('name', 'ilike', `%${filter}%`)
            .offset((page - 1) * limit)
            .limit(limit)
            .orderBy('id', 'desc');

        if (id > 0 && result.every(item => item.id !== id)) {
            const resultById = await Knex(ETableNames.groups)
                .select('*')
                .where('id', '=', id)
                .first();

            if (resultById) return [...result, resultById];
        }
        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
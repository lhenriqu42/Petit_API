import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';

export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<IFincash[] | Error> => {
    try {
        const result: IFincash[] = await Knex(ETableNames.fincashs)
            .select('*')
            .where('opener', 'ilike', `%${filter}%`)
            .andWhere('deleted_at', null)
            .offset((page - 1) * limit)
            .limit(limit)
            .orderBy('created_at', 'desc');

        if (id > 0 && result.every(item => item.id !== id)) {
            const resultById = await Knex(ETableNames.fincashs)
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
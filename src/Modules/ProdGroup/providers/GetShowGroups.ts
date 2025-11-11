import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IGroup } from '../../../server/database/models';

export const getShowGroups = async (): Promise<IGroup[] | Error> => {
    try {
        const result = await Knex(ETableNames.groups)
            .select('*')
            .where('show', true)
            .orderBy('id', 'desc');

        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
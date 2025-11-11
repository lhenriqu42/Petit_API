import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IGroup } from '../../../server/database/models';

export const create = async (group: Omit<IGroup, 'id' | 'show'>): Promise<number | Error> => {
    try {
        const [result] = await Knex(ETableNames.groups)
            .insert(group)
            .returning('id');

        if (typeof result === 'object') {
            return result.id;

        } else if (typeof result === 'number') {
            return result;
        }
        
        return new Error('Register Failed');
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
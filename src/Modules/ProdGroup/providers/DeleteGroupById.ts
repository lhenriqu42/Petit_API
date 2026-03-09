import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const deleteGroupById = async (id: number): Promise<void | Error> => {
    try {
        const deleted = await Knex(ETableNames.groups).select('id').where('id', id).first();
        if (deleted) {
            await Knex(ETableNames.groups)
                .where('id', '=', id)
                .del();

            return;
        } else {
            return new Error('This Object has already been deleted');
        }
    } catch (e) {
        console.log(e);
        return new Error('Delete Failed');
    }
};
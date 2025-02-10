import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const deleteById = async (user_id: number): Promise<void | Error> => {
    try {
        const deleted = await Knex(ETableNames.users).select('id').where('id', user_id).first();
        if (deleted) {
            await Knex(ETableNames.users)
                .where('id', user_id)
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
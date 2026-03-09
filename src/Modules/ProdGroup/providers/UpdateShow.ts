import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const updateShow = async (group_id: number, show: boolean): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.groups)
            .update({ show })
            .where('id', group_id);

        if (result > 0) {
            return;
        }

    }
    catch (e) {
        console.log(e);
        return new Error('Update Failed');
    }
};

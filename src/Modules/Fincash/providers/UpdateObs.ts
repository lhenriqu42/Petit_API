import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const updateObs = async (id: number, data: { obs: string }): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.fincashs)
            .update({
                ...data,
                updated_at: Knex.fn.now(),
            })
            .where('id', '=', id);

        if (result > 0) {
            return;
        }

        return new Error('Update Failed');
    } catch (e) {
        console.log(e);
        return new Error('Update Failed');
    }
};

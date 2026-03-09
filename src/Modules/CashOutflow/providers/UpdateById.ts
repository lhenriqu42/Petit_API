import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ICashOutflow } from '../../../server/database/models';

export const updateById = async (id: number, outflow: Omit<ICashOutflow, 'id' | 'created_at' | 'updated_at' | 'type' | 'fincash_id' | 'value'>): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.cashOutflows)
            .update({
                ...outflow,
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

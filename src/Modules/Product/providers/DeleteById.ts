import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { randNumber } from '../../../server/shared/services';

export const deleteById = async (id: number): Promise<void | Error> => {
    try {
        const deleted = await Knex(ETableNames.products).select('id', 'code').where('id', id).andWhere('deleted_at', null).first();
        if (!deleted) return new Error('This Object has already been deleted');

        const result = await Knex(ETableNames.products)
            .update({
                code: deleted.code + 'D' + randNumber(20),
                deleted_at: Knex.fn.now(),
            })
            .where('id', '=', id);

        if (result > 0) return;

        return new Error('Delete Failed');
    } catch (e) {
        console.log(e);
        return new Error('Delete Failed');
    }
};
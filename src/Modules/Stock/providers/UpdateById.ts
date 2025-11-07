import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const updateById = async (id: number, stock: number): Promise<number | Error> => {
    try {
        const result = await Knex(ETableNames.stocks)
            .update({
                stock,
                updated_at: Knex.fn.now(),
            })
            .where('id', id);

        return result;

    } catch (e) {
        console.log(e);
        return new Error('Update Failed');
    }
};

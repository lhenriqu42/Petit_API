import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const deleteProductById = async (group_id: number, prod_id: number): Promise<void | Error> => {
    try {
        const deleted = await Knex(ETableNames.product_groups).select('id').where('group_id', group_id).andWhere('prod_id', prod_id).first();
        if (deleted) {
            await Knex(ETableNames.product_groups)
                .where('group_id', group_id)
                .andWhere('prod_id', prod_id)
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
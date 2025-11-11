import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';

export const updateById = async (id: number, product: Omit<IProduct, 'id' | 'created_at' | 'updated_at' | 'code'>): Promise<void | Error> => {
    try {
        const deleted = await Knex(ETableNames.products).select('id', 'code').where('id', id).andWhere('deleted_at', null).first();
        if (deleted) {
            const result = await Knex(ETableNames.products)
                .update({
                    ...product,
                    updated_at: Knex.fn.now(),
                })
                .where('id', '=', id);

            if (result > 0) {
                return;
            }

        } else {
            return new Error('This Object has been deleted');
        }
    } catch (e) {
        console.log(e);
        return new Error('Update Failed');
    }
};

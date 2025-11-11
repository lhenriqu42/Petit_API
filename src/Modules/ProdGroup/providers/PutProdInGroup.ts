import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const putProdInGroup = async (product: number, group: number): Promise<number | Error> => {
    try {
        const existGroup = await Knex(ETableNames.groups).select('id').where('id', group).first();
        if (existGroup) {
            const prodExists = await Knex(ETableNames.products).select('id').where('id', product).andWhere('deleted_at', null).first();
            if (prodExists) {
                const prodAlreadyInGroup = await Knex(ETableNames.product_groups).select('id').where('group_id', group).andWhere('prod_id', product).first();
                if (!prodAlreadyInGroup) {

                    const [result] = await Knex(ETableNames.product_groups)
                        .insert({ prod_id: product, group_id: group, created_at: Knex.fn.now()})
                        .returning('id');

                    if (typeof result === 'object') {
                        return result.id;

                    } else if (typeof result === 'number') {
                        return result;
                    }

                    return new Error('Register Failed');
                } else {
                    return new Error('Product is already in the group');
                }
            } else {
                return new Error('Product not found or deleted');
            }
        } else {
            return new Error('Group not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IValidity } from '../../../server/database/models';

export const create = async (validity: Omit<IValidity, 'id' | 'created_at' | 'updated_at'>): Promise<number | Error> => {
    try {
        const product = await Knex(ETableNames.products).select('id').where('id', validity.prod_id).andWhere('deleted_at', null).first();
        if (product) {
            const already = await Knex(ETableNames.validities).select('*').where('prod_id', validity.prod_id).andWhere('validity', validity.validity).first();
            if (!already) {
                const [result] = await Knex(ETableNames.validities)
                    .insert(validity)
                    .returning('id');

                if (typeof result === 'object') {
                    return result.id;

                } else if (typeof result === 'number') {
                    return result;
                }
            } else {
                return Error('Validity already exists');
            }
        } else {
            return new Error('Product not found');
        }
        return new Error('Register Failed');
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
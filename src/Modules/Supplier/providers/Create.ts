import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISupplier } from '../../../server/database/models';

export const create = async (supplier: Omit<ISupplier, 'id' | 'created_at' | 'updated_at'>): Promise<number | Error> => {
    try {
        const [result] = await Knex(ETableNames.suppliers)
            .insert(supplier)
            .returning('id');

        if (typeof result === 'object') {
            return result.id;

        } else if (typeof result === 'number') {
            return result;
        }
        
        return new Error('Register Failed');
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
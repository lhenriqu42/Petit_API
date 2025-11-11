import { ETableNames } from '../../../server/database/ETableNames';
import { ICashOutflow } from '../../../server/database/models';
import { Knex } from '../../../server/database/knex';

export const getAllById = async (page: number, limit: number, fincash_id: number): Promise<ICashOutflow[] | Error> => {
    try {
        const fincash = await Knex(ETableNames.fincashs).select('*').where('id', fincash_id).first();
        if (fincash) {
            const result = await Knex(ETableNames.cashOutflows)
                .select('*')
                .where('fincash_id', fincash_id).andWhere('deleted_at', null)
                .offset((page - 1) * limit)
                .limit(limit)
                .orderBy('created_at', 'desc');
            return result;
        } else {
            return Error('Fincash not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
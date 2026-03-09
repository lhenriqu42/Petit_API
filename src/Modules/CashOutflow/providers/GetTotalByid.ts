import { Knex as def_knex } from 'knex';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const getTotalById = async (fincash_id: number, trx?: def_knex.Transaction): Promise<number | Error> => {
    try {
        const usedTrx = trx || Knex;
        const fincash = await usedTrx(ETableNames.fincashs).select('*').where('id', fincash_id).first();
        if (fincash) {
            const result = await usedTrx(ETableNames.cashOutflows)
                .where('fincash_id', fincash_id).andWhere('deleted_at', null)
                .sum('value');
            return result[0].sum ?? 0;
        } else {
            return new Error('Fincash not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
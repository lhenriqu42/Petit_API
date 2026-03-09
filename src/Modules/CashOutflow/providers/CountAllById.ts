import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const countAllById = async (fincash_id: number): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.cashOutflows)
            .where('fincash_id', fincash_id)
            .andWhere('deleted_at', null)
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};
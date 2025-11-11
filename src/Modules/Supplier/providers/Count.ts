import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const count = async (filter = ''): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.suppliers)
            .where('name', 'ilike', `%${filter}%`)
            .andWhere('deleted_at', null)
            .count<[{ count: number }]>('* as count');
            
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};
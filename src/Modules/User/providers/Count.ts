import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const count = async (): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.users)
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) 
            return Number(count);
        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};
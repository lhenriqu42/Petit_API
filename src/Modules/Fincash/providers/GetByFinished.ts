import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';

export const getByFinished = async (): Promise<IFincash | Error> => {
    try {
        const result = await Knex(ETableNames.fincashs)
            .select('*')
            .where('isFinished', false)
            .first();

        if (result) return result;

        return new Error('Fincash not found');
    } catch (e) {
        console.log(e);
        return new Error('Get By Finished Failed');
    }
};
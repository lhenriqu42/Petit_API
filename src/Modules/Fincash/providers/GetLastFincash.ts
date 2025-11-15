import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';

export const getLastFincash = async (): Promise<IFincash | Error> => {
    try {
        const result = await Knex(ETableNames.fincashs)
            .select('*')
            .where('isFinished', true)
            .orderBy('id', 'desc')
            .first();
        // console.log(result)
        if (result) return result;

        return new Error('Get Failed');
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
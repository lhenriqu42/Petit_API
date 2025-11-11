import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';
import { getLastFincash } from './GetLastFincash';

export const create = async (fincash: Omit<IFincash, 'id' | 'created_at' | 'updated_at' | 'isFinished'>): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.fincashs).where('isFinished', false).andWhere('deleted_at', null).count<[{ count: number }]>('* as count');

        if (!count) {
            const lastFincash = await getLastFincash();

            if (!(lastFincash instanceof Error) && lastFincash && lastFincash.finalValue) {
                const r = fincash.value - lastFincash.finalValue;
                if (r !== 0) {
                    fincash.diferenceLastFincash = fincash.value - lastFincash.finalValue;
                }
            }

            const [result] = await Knex(ETableNames.fincashs)
                .insert(fincash)
                .returning('id');

            if (typeof result === 'object') {
                return result.id;

            } else if (typeof result === 'number') {
                return result;
            }
        } else {
            return new Error('There is still an open fincash, close it before opening a new one');
        }
        return new Error('Register Failed');
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
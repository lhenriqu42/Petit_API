import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IUser } from '../../../server/database/models';

export const getByEmail = async (email: string): Promise<IUser | Error> => {
    try {
        const result = await Knex(ETableNames.users)
            .select('*')
            .where('email', email)
            .first();

        if (result) return result;

        return new Error('Get By ID Failed');
    } catch (e) {
        console.log(e);
        return new Error('Get By ID Failed');
    }
};
import { PasswordCrypto } from '../../../server/shared/services';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IUser } from '../../../server/database/models';

export const create = async (user: Omit<IUser, 'id'>): Promise<number | Error> => {
    try {
        const exists = await Knex(ETableNames.users).select('id').where('email', user.email).first();

        if (!exists) {
            const hashedPassword = await PasswordCrypto.hashPassword(user.password);

            const [result] = await Knex(ETableNames.users)
                .insert({ ...user, password: hashedPassword })
                .returning('id');

            if (typeof result === 'object') {
                return result.id;

            } else if (typeof result === 'number') {
                return result;
            }

            return new Error('Register Failed');
        } else {
            return Error('An account with this Email already exists');
        }
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
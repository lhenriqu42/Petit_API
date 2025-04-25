import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IUser } from '../../models';

export const getAll = async (page: number, limit: number): Promise<IUser[] | Error> => {
    try {
        const result = await Knex(ETableNames.users)
            .select('*')
            .offset((page - 1) * limit)
            .limit(limit);
                        
        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
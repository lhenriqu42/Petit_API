import { ETableNames } from '../../../server/database/ETableNames';
import { Knex as def_knex } from 'knex';
import { IStockMovements } from '../../../server/database/models';

type IFilterDTO = Partial<IStockMovements>;
type ISelectDTO<T extends keyof IStockMovements> = T[] | '*';
export const getMovements = async <T extends keyof IStockMovements>(trx: def_knex.Transaction, select: ISelectDTO<T>, filters: IFilterDTO) : Promise<Pick<IStockMovements, T>[] | null> => {
    const query = trx(ETableNames.stock_movements).select(select);

    const filterKeys = Object.keys(filters) as (keyof typeof filters)[];
    filterKeys.forEach(key => {
        const value = filters[key];
        if (value !== undefined) {
            query.andWhere(key, value);
        }
    });
    return await query;
};
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';


interface IProductWithStock extends IProduct {
    stock: number;
    prod_id: number;
}

export const getAll = async (page: number, limit: number, filter: string, orderBy = 'updated_at'): Promise<IProductWithStock[] | Error> => {
    try {
        const result = await Knex(ETableNames.products)
            .select('*')
            .join(ETableNames.stocks, `${ETableNames.products}.id`, '=', `${ETableNames.stocks}.prod_id`)
            .where(`${ETableNames.products}.deleted_at`, null)
            .andWhere((builder) => {
                if (filter) {
                    builder.where(function () {
                        this.where(`${ETableNames.products}.name`, 'ilike', `%${filter}%`)
                            .orWhere(`${ETableNames.products}.code`, 'ilike', `%${filter}%`);
                    });
                }
            })
            .offset((page - 1) * limit)
            .limit(limit)
            .orderBy(`${ETableNames.stocks}.${orderBy}`, 'desc');

        return result;

    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

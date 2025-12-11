import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';

export const getAll = async (page: number, limit: number, filter: string, orderByStock: boolean = false): Promise<(IProduct & { stock: number })[] | Error> => {
    try {
        const query = Knex(ETableNames.products)
            .select(
                `${ETableNames.products}.*`,
                Knex.raw(`COALESCE(${ETableNames.product_costs}.stock_quantity, 0) as stock`)
            )
            .leftJoin(ETableNames.product_costs, `${ETableNames.product_costs}.prod_id`, `${ETableNames.products}.id`)
            .where(function () {
                this.where(`${ETableNames.products}.name`, 'ilike', `%${filter}%`).andWhere(`${ETableNames.products}.deleted_at`, null)
                    .orWhere(`${ETableNames.products}.code`, 'like', `%${filter}%`).andWhere(`${ETableNames.products}.deleted_at`, null);
            })
            .offset((page - 1) * limit)
            .limit(limit);
        if (orderByStock) {
            query.orderByRaw(`COALESCE(${ETableNames.product_costs}.stock_quantity, 0) DESC`);
        }
        const result = await query;
        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
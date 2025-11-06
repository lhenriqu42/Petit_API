import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IProduct } from '../../models';

export const getAll = async (page: number, limit: number, filter: string, id = 0, orderByStock: boolean = false): Promise<(IProduct & { stock: number })[] | Error> => {
    try {
        const query = Knex(ETableNames.products)
            .select(
                `${ETableNames.products}.*`,
                Knex.raw(`COALESCE(${ETableNames.stocks}.stock, 0) as stock`)
            )
            .leftJoin(ETableNames.stocks, `${ETableNames.stocks}.prod_id`, `${ETableNames.products}.id`)
            .where(function () {
                this.where(`${ETableNames.products}.name`, 'ilike', `%${filter}%`).andWhere(`${ETableNames.products}.deleted_at`, null)
                    .orWhere(`${ETableNames.products}.code`, 'like', `%${filter}%`).andWhere(`${ETableNames.products}.deleted_at`, null);
            })
            .offset((page - 1) * limit)
            .limit(limit);

        if (orderByStock) {
            query.orderByRaw(`COALESCE(${ETableNames.stocks}.stock, 0) ASC`);
        }
        query.orderBy(`${ETableNames.products}.updated_at`, 'desc');
        const result = await query;

        if (id > 0 && result.every(item => item.id !== id)) {
            const resultById = await Knex(ETableNames.products)
                .select(
                    `${ETableNames.products}.*`,
                    Knex.raw(`COALESCE(${ETableNames.stocks}.stock, 0) as stock`)
                )
                .leftJoin(
                    ETableNames.stocks,
                    `${ETableNames.stocks}.prod_id`,
                    `${ETableNames.products}.id`
                )
                .where(`${ETableNames.products}.id`, '=', id)
                .first();

            if (resultById) return [...result, resultById];
        }

        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
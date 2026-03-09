import { Knex } from '../../../../server/database/knex';
import { ETableNames } from '../../../../server/database/ETableNames';

export interface IResponse {
    prod_id: number,
    prod_code: number,
    prod_name: string,
    prod_price: number,
    prod_sector: number,
    quantity: number,
    solded_price: number,
    total_value: number
}

export enum EColumnsOrderBy {
    prod_id = 'prod_id',
    quantity = 'quantity',
    prod_code = 'prod_code',
    prod_name = 'prod_name',
    prod_price = 'prod_price',
    prod_sector = 'prod_sector',
    total_value = 'total_value',
    solded_price = 'solded_price',
}

export interface OrderByObj {
    column: EColumnsOrderBy;
    order: 'asc' | 'desc';
    sectors: number[];
    group_id?: number;
}

export const getDataById = async (id: number, orderBy: OrderByObj, page: number, limit: number, filter = ''): Promise<IResponse[] | Error> => {
    try {
        const result = await Knex(ETableNames.sales)
            .join(ETableNames.saleDetails, `${ETableNames.sales}.id`, `${ETableNames.saleDetails}.sale_id`)
            .join(ETableNames.products, `${ETableNames.products}.id`, `${ETableNames.saleDetails}.prod_id`)
            .leftJoin(ETableNames.product_groups, `${ETableNames.products}.id`, `${ETableNames.product_groups}.prod_id`)
            .select(
                `${ETableNames.products}.id as prod_id`,
                `${ETableNames.products}.code as prod_code`,
                `${ETableNames.products}.name as prod_name`,
                `${ETableNames.products}.price as prod_price`,
                `${ETableNames.products}.sector as prod_sector`,
                `${ETableNames.products}.deleted_at as prod_deleted`,
                Knex.raw('SUM(sale_details.quantity) as Quantity'),
                `${ETableNames.saleDetails}.price as solded_price`,
                Knex.raw('SUM(sale_details.pricetotal) as total_value')
            )
            .where(`${ETableNames.sales}.fincash_id`, id)
            .andWhere(`${ETableNames.sales}.deleted_at`, null)
            .andWhere(`${ETableNames.products}.name`, 'ilike', `%${filter}%`)
            .andWhere(function () {
                if (orderBy.group_id) {
                    this.where(`${ETableNames.product_groups}.group_id`, orderBy.group_id);
                }
            })
            .whereIn(`${ETableNames.products}.sector`, orderBy.sectors)
            .groupBy(`${ETableNames.products}.id`, `${ETableNames.saleDetails}.price`)
            .orderBy(orderBy.column, orderBy.order)
            .offset((page - 1) * limit)
            .limit(limit);

        return result;
    } catch (error) {
        console.error(error);
        return new Error(`Failed to fetch data: ${error}`);
    }
};

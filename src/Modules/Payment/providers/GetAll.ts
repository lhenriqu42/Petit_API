import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IPayment } from '../../../server/database/models';

interface IResponse extends IPayment {
    name: string,
}

type TColumnsOrderBy = 'expiration' | 'created_at';

export interface OrderByObj {
    column: TColumnsOrderBy;
    order: 'asc' | 'desc';
    supplier_id?: number;
    show?: {
        PAID?: boolean,
        EXPIRED?: boolean,
    };
}

export const getAll = async (page: number, limit: number, orderBy: OrderByObj): Promise<IResponse[] | Error> => {
    try {
        const result = await Knex(ETableNames.payments)
            .join(ETableNames.suppliers, `${ETableNames.payments}.supplier_id`, `${ETableNames.suppliers}.id`)
            .select(
                `${ETableNames.suppliers}.name`,
                `${ETableNames.payments}.*`,
            )
            .where((builder) => {
                if (orderBy.supplier_id) {
                    builder.where(`${ETableNames.payments}.supplier_id`, orderBy.supplier_id);
                }
                if (!orderBy.show) {
                    builder.where(`${ETableNames.payments}.paid`, null);
                    builder.where(`${ETableNames.payments}.expiration`, '>=', new Date());
                }
                else {
                    if (!orderBy.show.PAID) {
                        builder.where(`${ETableNames.payments}.paid`, null);
                    }
                    if (!orderBy.show.EXPIRED) {
                        builder.where(`${ETableNames.payments}.expiration`, '>=', new Date());
                    }
                }
            })
            .orderBy([
                { column: orderBy.column, order: orderBy.order },
                { column: `${ETableNames.payments}.id`, order: 'asc' } // Secondary sort by ID
            ])
            .offset((page - 1) * limit)
            .limit(limit);

        return result;
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
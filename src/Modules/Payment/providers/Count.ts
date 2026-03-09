import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { OrderByObj } from './GetAll';

export const count = async (orderBy: OrderByObj): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.payments)
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
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};
import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPack } from '../../models';

interface IResponse {
    totalCount: number;
    packs: (IPack & {
        products_count: number;
    })[];
}

interface IFilter {
    excludeProdId?: number;
}

const count = async (filter?: IFilter): Promise<number | Error> => {
    try {
        const query = Knex(ETableNames.packs).count<[{ count: number }]>('* as count');

        if (filter?.excludeProdId) {
            query.whereNotExists(function () {
                this.select('*')
                    .from(ETableNames.prod_packs)
                    .whereRaw(`${ETableNames.prod_packs}.pack_id = ${ETableNames.packs}.id`)
                    .andWhere(`${ETableNames.prod_packs}.prod_id`, filter.excludeProdId!);
            });
        }

        const [{ count }] = await query;
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};

export const getPacks = async (page: number, limit: number, filter?: IFilter): Promise<IResponse | Error> => {
    try {
        const query = Knex<IPack>(ETableNames.packs)
            .select(
                `${ETableNames.packs}.id`,
                `${ETableNames.packs}.description`,
                `${ETableNames.packs}.prod_qnt`,
                `${ETableNames.packs}.created_at`,
                `${ETableNames.packs}.updated_at`,
                Knex.raw(`
                    (
                        SELECT COUNT(*)
                        FROM ${ETableNames.prod_packs}
                        WHERE ${ETableNames.prod_packs}.pack_id = ${ETableNames.packs}.id
                    ) AS products_count
                `)
            );

        if (filter?.excludeProdId) {
            query.whereNotExists(function () {
                this.select('*')
                    .from(ETableNames.prod_packs)
                    .whereRaw(`${ETableNames.prod_packs}.pack_id = ${ETableNames.packs}.id`)
                    .andWhere(`${ETableNames.prod_packs}.prod_id`, filter.excludeProdId!);
            });
        }

        const result = await query
            .orderBy(`${ETableNames.packs}.id`, 'desc')
            .offset((page - 1) * limit)
            .limit(limit);

        const total = await count(filter);
        if (total instanceof Error) return total;

        return { totalCount: total, packs: result };
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

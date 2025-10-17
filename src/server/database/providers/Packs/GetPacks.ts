import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPack } from '../../models';

interface IResponse {
    totalCount: number,
    packs: (IPack & {
        products_count: number;
    })[]
}

const count = async (): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.packs)
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};

export const getPacks = async (page: number, limit: number): Promise<IResponse | Error> => {
    try {

        const result = await Knex<IPack>(ETableNames.packs)
            .select(
                `${ETableNames.packs}.id`,
                `${ETableNames.packs}.description`,
                `${ETableNames.packs}.prod_qnt`,
                `${ETableNames.packs}.created_at`,
                `${ETableNames.packs}.updated_at`,
                Knex.raw(
                    `(
                    SELECT COUNT(*)
                    FROM ${ETableNames.prod_packs}
                    WHERE ${ETableNames.prod_packs}.pack_id = ${ETableNames.packs}.id
                    ) AS products_count`
                )
            )
            .orderBy(`${ETableNames.packs}.id`, 'desc')
            .offset((page - 1) * limit)
            .limit(limit);

        const total = await count();
        if (total instanceof Error) return total;
        return { totalCount: total, packs: result };
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

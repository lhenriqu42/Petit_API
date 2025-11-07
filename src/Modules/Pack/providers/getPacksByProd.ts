import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IPack } from '../../../server/database/models';

interface IResponse {
    totalCount: number,
    packs: (IPack & { name: string, identifier: string })[]
}

const count = async (prodId: number): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.prod_packs)
            .where('prod_id', prodId)
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};

export const getPacksByProd = async (page: number, limit: number, prodId: number): Promise<IResponse | Error> => {
    try {
        const result = await Knex(ETableNames.packs)
            .select(
                `${ETableNames.packs}.*`,
                `${ETableNames.prod_packs}.name`,
                `${ETableNames.prod_packs}.identifier`
            )
            .join(
                ETableNames.prod_packs,
                `${ETableNames.prod_packs}.pack_id`,
                `${ETableNames.packs}.id`
            )
            .where(`${ETableNames.prod_packs}.prod_id`, prodId)
            .orderBy(`${ETableNames.packs}.id`, 'desc')
            .offset((page - 1) * limit)
            .limit(limit);
        const total = await count(prodId);
        if (total instanceof Error) return total;
        return { totalCount: total, packs: result };
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

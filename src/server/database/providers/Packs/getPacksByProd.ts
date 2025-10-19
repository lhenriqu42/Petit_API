import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPack } from '../../models';

interface IResponse {
    totalCount: number,
    packs: IPack[]
}

const count = async (pack_ids: number[]): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.packs)
            .count<[{ count: number }]>('* as count')
            .whereIn('id', pack_ids);
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};

export const getPacksByProd = async (page: number, limit: number, prodId: number): Promise<IResponse | Error> => {
    try {

        const packIds = await Knex(ETableNames.prod_packs)
            .select('pack_id')
            .where('prod_id', prodId).then(rows => rows.map(r => r.pack_id));

        if (packIds.length === 0) {
            return { totalCount: 0, packs: [] };
        }
        const result = await Knex(ETableNames.packs)
            .select(
                '*'
            )
            .whereIn('id', packIds)
            .orderBy(`${ETableNames.packs}.id`, 'desc')
            .offset((page - 1) * limit)
            .limit(limit);
        const total = await count(packIds);
        if (total instanceof Error) return total;
        return { totalCount: total, packs: result };
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

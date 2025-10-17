import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPack } from '../../models';

interface IResponse {
    totalCount: number,
    packs: (IPack & { prod_code: string, prod_name: string })[]

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

export const getPacksByProd = async (page: number, limit: number, prodId: number): Promise<IResponse | Error> => {
    try {

        const result = await Knex<IPack>(ETableNames.packs)
            .select(
                `${ETableNames.packs}.id`,
                `${ETableNames.packs}.prod_id`,
                `${ETableNames.packs}.description`,
                `${ETableNames.packs}.prod_qnt`,
                `${ETableNames.packs}.created_at`,
                `${ETableNames.packs}.updated_at`,
                `${ETableNames.products}.code as prod_code`,
                `${ETableNames.products}.name as prod_name`,
            )
            .join(ETableNames.products, `${ETableNames.products}.id`, `${ETableNames.packs}.prod_id`)
            .where(`${ETableNames.packs}.prod_id`, prodId)
            .orderBy(`${ETableNames.products}.id`, 'desc')
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

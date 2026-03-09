import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export interface IRequestBody {
    prod_id: number;
    packs: number[];
}

interface PostgresError extends Error {
    code?: string;
    detail?: string;
    constraint?: string;
}

export const putPacksInProd = async (request: IRequestBody): Promise<number | Error> => {
    try {
        if (request.packs.length === 0) {
            return new Error('No packs provided');
        }
        const allPackExists = await Knex(ETableNames.packs)
            .whereIn('id', request.packs)
            .count<{ count: string }[]>('* as count')
            .then(result => {
                const count = Number(result[0]?.count ?? 0);
                return count === request.packs.length;
            });
        if (!allPackExists) return new Error('One or more packs not found');

        const prodExists = await Knex(ETableNames.products).where('id', request.prod_id).first();
        if (!prodExists) return new Error('Product not found');

        const insertData = request.packs.map(packId => ({
            pack_id: packId,
            prod_id: request.prod_id,
        }));

        await Knex(ETableNames.prod_packs).insert(insertData);
        return request.prod_id;
    } catch (e: unknown) {
        const err = e as PostgresError;
        if (err.code === '23505') {
            return new Error('One or more packs are already associated with this product');
        }
        console.error(e);
        return new Error('Register Failed');
    }
};

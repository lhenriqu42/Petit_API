import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export interface IRequestBody {
    prod_id: number;
    packs: number[];
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
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};

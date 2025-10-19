import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export interface IRequestBody {
    pack_id: number;
    prods: number[];
}

export const putProdsInPack = async (request: IRequestBody): Promise<number | Error> => {
    try {
        if (request.prods.length === 0) {
            return new Error('No products provided');
        }
        const allProdsExist = await Knex(ETableNames.products)
            .whereIn('id', request.prods)
            .count<{ count: string }[]>('* as count')
            .then(result => {
                const count = Number(result[0]?.count ?? 0);
                return count === request.prods.length;
            });
        if (!allProdsExist) return new Error('One or more products not found');

        const packExist = await Knex(ETableNames.packs).where('id', request.pack_id).first();
        if (!packExist) return new Error('Pack not found');

        const insertData = request.prods.map(prodId => ({
            pack_id: request.pack_id,
            prod_id: prodId,
        }));

        await Knex(ETableNames.prod_packs).insert(insertData);
        return request.pack_id;
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};

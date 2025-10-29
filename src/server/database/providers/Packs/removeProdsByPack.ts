import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export interface IRequestBody {
    pack_id: number;
    prods: number[];
}

export const removeProdsByPack = async (request: IRequestBody): Promise<void | Error> => {
    try {
        if (request.prods.length === 0) {
            return new Error('No products provided');
        }
        const alreadyExcluded = await Knex(ETableNames.prod_packs)
            .whereIn('prod_id', request.prods)
            .andWhere('pack_id', request.pack_id)
            .select('prod_id');

        const prodsToRemove = alreadyExcluded.map(row => row.prod_id);
        if (prodsToRemove.length === 0) {
            return new Error('No products found for this pack');
        }

        await Knex(ETableNames.prod_packs)
            .where('pack_id', request.pack_id)
            .whereIn('prod_id', prodsToRemove)
            .del();

        return;
    } catch (e: unknown) {
        console.error(e);
        return new Error('Database operation failed');
    }
};

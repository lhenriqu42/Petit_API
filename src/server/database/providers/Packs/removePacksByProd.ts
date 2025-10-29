import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export interface IRequestBody {
    prod_id: number;
    packs: number[];
}

export const removePacksByProd = async (request: IRequestBody): Promise<void | Error> => {
    try {
        if (request.packs.length === 0) {
            return new Error('No packs provided');
        }
        const alreadyExcluded = await Knex(ETableNames.prod_packs)
            .whereIn('pack_id', request.packs)
            .andWhere('prod_id', request.prod_id)
            .select('pack_id');

        const packsToRemove = alreadyExcluded.map(row => row.pack_id);
        if (packsToRemove.length === 0) {
            return new Error('No packs found for this product');
        }

        await Knex(ETableNames.prod_packs)
            .where('prod_id', request.prod_id)
            .whereIn('pack_id', packsToRemove)
            .del();

        return;
    } catch (e: unknown) {
        console.error(e);
        return new Error('Database operation failed');
    }
};

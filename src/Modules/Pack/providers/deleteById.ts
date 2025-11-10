import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError, { NotFoundError } from '../../../server/shared/Errors';

export const deleteById = async (pack_id: number): Promise<void> => {
    try {
        await Knex.transaction(async trx => {
            const pack = await trx(ETableNames.packs).select('prod_qnt').where('id', pack_id).first();
            if (!pack) throw new NotFoundError('Pack not found');

            await trx(ETableNames.purchase_details)
                .where('pack_id', pack_id)
                .update({ pack_deleted_qnt: pack.prod_qnt, pack_id: null });

            await trx(ETableNames.packs)
                .where('id', pack_id)
                .del();
        });
    } catch (e: unknown) {
        console.error(e);
        throw new AppError('Error deleting pack');
    }
};
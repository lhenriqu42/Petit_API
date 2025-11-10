import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError, { NotFoundError } from '../../../server/shared/Errors';

export const deleteById = async (purchase_id: number): Promise<void> => {
    try {
        await Knex.transaction(async trx => {
            const purchase = await trx(ETableNames.purchases).where('id', purchase_id).first();
            if (!purchase) throw new NotFoundError('Purchase not found');
            await trx(ETableNames.purchases)
                .where('id', purchase_id)
                .del();
        });
    } catch (e: unknown) {
        console.error(e);
        throw new AppError('Error deleting purchase');
    }
};
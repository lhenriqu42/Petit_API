import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError, { ConflictError } from '../../../server/shared/Errors';

export const reOpenFincash = async (fincash_id: number): Promise<void> => {
    try {
        await Knex.transaction(async (trx) => {
            // 🔹 1. Busca caixa aberto
            const opennedFincash = await trx(ETableNames.fincashs).select('id').where({ isFinished: false }).whereNull('deleted_at').first();
            if (opennedFincash) throw new ConflictError('There is already an open fincash');

            // 🔹 2. Busca o caixa a ser reaberto
            const fincash = await trx(ETableNames.fincashs).select('*').where({ id: fincash_id }).whereNull('deleted_at').first();
            if (!fincash) throw new Error('Fincash not found');
            if (!fincash.isFinished) throw new ConflictError('Fincash is already open');

            // 🔹 3. Reabre o caixa
            const result = await trx(ETableNames.fincashs).update({
                isFinished: false,
                // finalValue: null,
                // finalDate: null,
                // invoicing: null,
                // break: null,
                // cardValue: null,
                updated_at: trx.fn.now(),
            }).where({ id: fincash_id });
            if (result === 0) throw new AppError('ReOpen Failed');
        });
    } catch (e) {
        console.log(e);
        if (e instanceof AppError) {
            throw e;
        }
        throw new AppError('ReOpen Failed');
    }
};
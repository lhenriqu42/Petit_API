import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError, { NotFoundError } from '../../../server/shared/Errors';
export const deleteById = async (id: number): Promise<void> => {
    try {
        await Knex.transaction(async trx => {
            // 🔹 1. Verifica se o registro existe e não está deletado
            const deleted = await trx(ETableNames.suppliers).select('id').where('id', id).andWhere('deleted_at', null).first();
            if (!deleted) throw new NotFoundError('Supplier not found or already deleted');

            // 🔹 2. Realiza o delete lógico
            await trx(ETableNames.suppliers)
                .update({
                    deleted_at: trx.fn.now(),
                })
                .where('id', '=', id);

            // 🔹 3. Reseta o registro em NFEmitter
            await trx(ETableNames.nf_emitters)
                .update({
                    supplier_id: null,
                })
                .where('supplier_id', '=', id);
        });
    } catch (e) {
        if (e instanceof AppError) {
            throw e;
        }
        console.log(e);
        throw new AppError('Delete Failed');
    }
};
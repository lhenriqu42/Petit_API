import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError, { NotFoundError } from '../../../server/shared/Errors';

export const linkToSupplier = async (emitter_id: number, supplier_id: number): Promise<boolean> => {
    try {
        const id = await Knex.transaction(async trx => {
            // 🔹 1. Verifica se emitter existe
            const emitterExists = await trx(ETableNames.nf_emitters).where('id', emitter_id).first();
            if (!emitterExists) throw new NotFoundError('NF Emitter does not exist');

            // 🔹 2. Verifica se supplier existe
            const supplierExists = await trx(ETableNames.suppliers).where('id', supplier_id).first();
            if (!supplierExists) throw new NotFoundError('Supplier does not exist');


            // 🔹 3. Faz o link do fornecedor petit
            const [id] = await trx(ETableNames.nf_emitters)
                .update({
                    supplier_id: supplier_id,
                })
                .where('id', emitter_id)
                .returning('id');

            return id;
        });
        return !!id;
    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        console.error(e);
        throw new AppError('Error Linking Supplier to NF Emitter');
    }
};
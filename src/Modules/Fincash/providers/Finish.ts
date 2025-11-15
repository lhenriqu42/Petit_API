import { Knex as def_knex } from 'knex';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError, { ConflictError, NotFoundError } from '../../../server/shared/Errors';

export const finish = async (id: number, finalValue: number): Promise<void> => {
    try {
        await Knex.transaction(async trx => {
            //🔹 1. Busca o caixa
            const fincash = await trx(ETableNames.fincashs).select('id', 'isFinished', 'finalDate').where('id', id).first();
            if (!fincash) throw new NotFoundError('Fincash not found');
            if (fincash.isFinished) throw new ConflictError('Fincash already finished');

            //🔹 2. Calcula o total das vendas
            const totalValue = await getTotalValue(trx, id);

            //🔹 3. Verifica se é retroativo
            const lastFincash = await trx(ETableNames.fincashs).select('id').orderBy('created_at', 'desc').first();
            const retroactive = lastFincash && lastFincash.id !== id;

            //🔹 4. Atualiza
            const updateData: Record<string, unknown> = {
                finalValue,
                isFinished: true,
                totalValue,
            };

            if (!retroactive && !fincash.finalDate) {
                updateData.finalDate = trx.fn.now();
            }

            await trx(ETableNames.fincashs)
                .update(updateData)
                .where('id', id);
        });
    } catch (e) {
        console.error(e);
        if (e instanceof AppError) throw e;
        throw new AppError('Finish Failed');
    }
};

const getTotalValue = async (trx: def_knex.Transaction, fincash_id: number): Promise<number> => {
    const response = await trx(ETableNames.sales)
        .join(
            ETableNames.saleDetails,
            `${ETableNames.sales}.id`,
            `${ETableNames.saleDetails}.sale_id`
        )
        .where(`${ETableNames.sales}.fincash_id`, fincash_id)
        .andWhere(`${ETableNames.sales}.deleted_at`, null)
        .sum<{ sum: number }[]>(`${ETableNames.saleDetails}.pricetotal as sum`);

    return Number(response[0]?.sum) || 0;
};

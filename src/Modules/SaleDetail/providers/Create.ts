import AppError, { NotFoundError, ValidationError } from '../../../server/shared/Errors';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISaleDetails } from '../../../server/database/models';

interface ISaleDetailInput extends Omit<ISaleDetails, 'id' | 'created_at' | 'updated_at' | 'pricetotal' | 'sale_id'> { }

export const create = async (saleDetails: ISaleDetailInput[], obs?: string | null, ): Promise<number> => {
    try {
        return await Knex.transaction(async trx => {
            // 🔹 1. Busca caixa aberto
            const fincash = await trx(ETableNames.fincashs).select('id').where({ isFinished: false }).whereNull('deleted_at').first();
            if (!fincash) throw new NotFoundError('No open fincash found');



            // 🔹 2. Verifica existência de produtos em um único SELECT
            const productIds = [...new Set(saleDetails.map(d => d.prod_id))];
            const products = await trx(ETableNames.products).select('id').whereIn('id', productIds).whereNull('deleted_at');
            if (products.length !== productIds.length) throw new ValidationError('One or more products not found');



            // 🔹 3. Cria a venda
            const [sale] = await trx(ETableNames.sales).insert({ fincash_id: fincash.id, obs: obs ?? null, }).returning('id');
            const sale_id = typeof sale === 'object' ? sale.id : sale;



            // 🔹 4. Prepara detalhes em lote
            const saleDetailsRows = saleDetails.map(item => ({ ...item, sale_id, pricetotal: item.price * item.quantity }));
            await trx(ETableNames.saleDetails).insert(saleDetailsRows);



            // 🔹 5. Atualiza estoque em lote (com UPSERT)
            const stockAdjustments = new Map<number, number>();
            for (const item of saleDetails) {
                const current = stockAdjustments.get(item.prod_id) ?? 0;
                stockAdjustments.set(item.prod_id, current - item.quantity);
            }
            const stockRows = Array.from(stockAdjustments.entries()).map(([prod_id, stockDiff]) => ({
                prod_id,
                stock: stockDiff,
                updated_at: trx.fn.now(),
            }));
            await trx(ETableNames.stocks)
                .insert(stockRows)
                .onConflict('prod_id')
                .merge({
                    stock: trx.raw('?? + EXCLUDED.??', ['stocks.stock', 'stock']),
                    updated_at: trx.fn.now(),
                });

            return sale_id;
        });
    } catch (e: unknown) {
        console.error(e);

        if (e instanceof AppError) throw e;

        const pgErr = e as PostgresError;
        if (pgErr.code === '23503' && pgErr.detail?.includes('prod_id'))
            throw new NotFoundError('Product ID not found');

        throw new AppError('Sale registration failed', 500);
    }
};

interface PostgresError extends Error {
    code?: string;
    detail?: string;
}

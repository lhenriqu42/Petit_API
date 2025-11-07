import { ConflictError, NotFoundError } from '../../../server/shared/Errors';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const completePurchase = async (purchase_id: number): Promise<void> => {
    try {
        const purchase = await Knex(ETableNames.purchases)
            .where({ id: purchase_id })
            .first();

        if (!purchase)
            throw new NotFoundError('Purchase not found');

        if (purchase.effected)
            throw new ConflictError('Purchase already completed');

        await Knex.transaction(async trx => {
            const details = await trx(ETableNames.purchase_details)
                .select(
                    'type',
                    'pack_id',
                    'prod_id',
                    'quantity'
                )
                .where({ purchase_id });

            if (details.length === 0)
                throw new ConflictError('Purchase has no items');

            // Busca tamanhos de packs apenas se houver PACKs
            const packIds = details.filter(d => d.type === 'PACK' && d.pack_id).map(d => d.pack_id!);
            const packSizes = new Map<number, number>();

            if (packIds.length > 0) {
                const packData = await trx(ETableNames.packs)
                    .select('id as pack_id', 'prod_qnt as quantity')
                    .whereIn('id', packIds);

                for (const row of packData) {
                    packSizes.set(row.pack_id, row.quantity);
                }
            }

            // Acumula o total de estoque por produto
            const stockAdjustments = new Map<number, number>();

            for (const item of details) {
                const packSize = item.type === 'PACK' ? (packSizes.get(item.pack_id!) ?? 1) : 1;
                const totalQty = item.quantity * packSize;

                const current = stockAdjustments.get(item.prod_id) ?? 0;
                stockAdjustments.set(item.prod_id, current + totalQty);
            }

            // Converte o mapa em array de objetos pra inserir em lote
            const stockRows = Array.from(stockAdjustments.entries()).map(([prod_id, stockInc]) => ({
                prod_id,
                stock: stockInc,
                updated_at: new Date()
            }));

            // Faz insert em lote com UPSERT (ON CONFLICT)
            await trx(ETableNames.stocks)
                .insert(stockRows)
                .onConflict('prod_id')
                .merge({
                    stock: trx.raw('?? + EXCLUDED.??', ['stocks.stock', 'stock']),
                    updated_at: trx.fn.now()
                });

            // Marca a compra como finalizada
            await trx(ETableNames.purchases).where({ id: purchase_id }).update({ effected: true, updated_at: trx.fn.now() });
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};

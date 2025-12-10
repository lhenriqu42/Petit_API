import { ConflictError, NotFoundError } from '../../../server/shared/Errors';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { movementStockBatch } from '../../Stock/utils/MovementStockBatch';

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
                    'pack_deleted_qnt',
                    'quantity',
                    'price'
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
            const stockAdjustments = new Map<number, { quantity: number; unit_cost: number }>();

            for (const item of details) {
                const packSize = item.type === 'PACK' ? (item.pack_deleted_qnt ?? packSizes.get(item.pack_id!) ?? 1) : 1;
                const totalQty = item.quantity * packSize;
                const unit_cost = item.price / packSize;

                const current = stockAdjustments.get(item.prod_id)?.quantity ?? 0;
                stockAdjustments.set(item.prod_id, { quantity: current + totalQty, unit_cost: unit_cost });
            }

            // Converte o mapa em array de objetos pra inserir em lote
            const stockRows = Array.from(stockAdjustments.entries()).map(([prod_id, { quantity, unit_cost }]) => ({
                prod_id,
                quantity,
                unit_cost
            }));

            // Atualiza o estoque
            await movementStockBatch(trx, {
                direction: 'in',
                origin_type: 'purchase',
                origin_id: purchase_id,
                rows: stockRows.map(r => ({
                    prod_id: r.prod_id,
                    quantity: r.quantity,
                    unit_cost: r.unit_cost,
                    notes: `Compra #${purchase_id}`
                }))
            });

            // Marca a compra como finalizada
            await trx(ETableNames.purchases).where({ id: purchase_id }).update({ effected: true, updated_at: trx.fn.now() });
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};

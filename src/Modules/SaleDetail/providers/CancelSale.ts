import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { getMoviments } from '../../Stock/utils/GetMoviments';
import { movementStockBatch } from '../../Stock/utils/MovementStockBatch';
import AppError, { NotFoundError, ConflictError, BadRequestError } from '../../../server/shared/Errors';

export const cancelSale = async (sale_id: number): Promise<void> => {
    try {
        // VERIFICAR SE A VENDA EXISTE OU JÁ FOI EXCLUÍDA
        const exists = await Knex(ETableNames.sales).select('fincash_id', 'deleted_at').where('id', sale_id).first();
        if (!exists) throw new NotFoundError('Sale not found');
        if (exists.deleted_at) throw new ConflictError('Sale already canceled');

        // VERIFICAR SE O CAIXA EXISTE OU SE ESTÁ ABERTO
        const fincash = await Knex(ETableNames.fincashs).select('*').where('id', exists.fincash_id).first();
        if (!fincash) throw new NotFoundError('Fincash not found');
        if (fincash.isFinished) throw new ConflictError('Fincash is finished');

        // VERIFICAR SE A VENDA ESTÁ VAZIA
        const saleDetails = await Knex(ETableNames.saleDetails)
            .select('id', 'quantity', 'prod_id')
            .where('sale_id', sale_id);
        if (saleDetails.length <= 0) throw new BadRequestError('Sale empty');


        await Knex.transaction(async trx => {
            // BUSCAR MOVIMENTAÇÕES DE ESTOQUE RELACIONADAS À VENDA
            const moviments = await getMoviments(trx, '*', { origin_id: sale_id, origin_type: 'sale' });
            if (!moviments || moviments.length === 0) throw new NotFoundError('Stock movements not found for this sale');
            const stocksValues = new Map<number, number>();
            for (const moviment of moviments) {
                const wac = moviment.unit_cost!;
                stocksValues.set(moviment.prod_id, wac);
            }

            // REABASTECER O ESTOQUE
            await movementStockBatch(
                trx,
                {
                    direction: 'in',
                    origin_type: 'return',
                    origin_id: sale_id,
                    rows: saleDetails.map(item => {
                        const cost = stocksValues.get(item.prod_id);
                        if (cost === undefined) {
                            throw new NotFoundError(`Missing stock movement for product ${item.prod_id}`);
                        }
                        return {
                            prod_id: item.prod_id,
                            quantity: item.quantity,
                            unit_cost: stocksValues.get(item.prod_id)!,
                            notes: 'Reabastecimento automático após cancelamento de venda'
                        };
                    })
                }
            );
            // OPERAÇÃO: MARCAR A VENDA COMO CANCELADA
            await trx(ETableNames.sales)
                .update({
                    deleted_at: Knex.fn.now()
                })
                .where('id', sale_id);
        });
    } catch (e) {
        if (e instanceof AppError) {
            throw e;
        }
        console.log(e);
        throw new AppError('Cancel Failed');
    }
};

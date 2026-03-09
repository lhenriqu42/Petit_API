import { ETableNames } from '../../../server/database/ETableNames';
import { manualAdjustment } from '../utils/ManualAdjustment';
import { Knex } from '../../../server/database/knex';
import AppError from '../../../server/shared/Errors';
import { Knex as knex_def } from 'knex';

const performUpdateStock = async (trx: knex_def.Transaction, prod_id: number, quantity: number, notes?: string): Promise<void> => {
    const unsignedQuantity = Math.abs(quantity);
    const operation = quantity >= 0 ? 'in' : 'out';
    await manualAdjustment(trx, {
        direction: operation,
        prod_id: prod_id,
        quantity: unsignedQuantity,
        notes: notes || null
    });
};

export const updateStock = async (prod_id: number, quantity: number, notes?: string): Promise<void> => {
    const operation = quantity >= 0 ? 'add to' : 'remove from';
    try {
        await Knex.transaction(async trx => performUpdateStock(trx, prod_id, quantity, notes ?? `Manual ${operation} stock`));
    } catch (error) {
        if (!(error instanceof AppError)) {
            console.log(error);
        }
        throw new AppError(`Failed to ${operation} stock for product ID ${prod_id}: ${error}`);
    }
};

export const updateStockRaw = async (prod_id: number, to_be: number, notes?: string) => {
    try {
        await Knex.transaction(async trx => {
            const stock = await trx(`${ETableNames.product_costs}`).select('stock_quantity').where({ prod_id: prod_id }).first();
            if (!stock) {
                await trx(`${ETableNames.product_costs}`).insert({ prod_id: prod_id, stock_quantity: 0, avg_cost: 0, last_cost: 0 });
            }
            const difference = to_be - (stock ? stock.stock_quantity : 0);
            await performUpdateStock(trx, prod_id, difference, notes ?? `Manual adjusting stock to ${to_be}`);
        });
    } catch (error) {
        if (!(error instanceof AppError)) {
            console.log(error);
        }
        throw new AppError(`Failed to update stock to ${to_be} for product ID ${prod_id}: ${error}`);
    }
};
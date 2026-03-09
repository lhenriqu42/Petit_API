import { ETableNames } from '../../../server/database/ETableNames';
import { Knex as def_knex } from 'knex';

interface IStockMovementBase {
    direction: 'in' | 'out';
    prod_id: number;
    quantity: number;
    notes?: string | null;
}

export const manualAdjustment = async (trx: def_knex.Transaction, params: IStockMovementBase) => {
    return await trx(ETableNames.stock_movements).insert({
        prod_id: params.prod_id,
        direction: params.direction,
        quantity: params.quantity,
        unit_cost: null,
        origin_type: 'manual',
        origin_id: null,
        notes: params.notes || null,
        affect_wac: false
    });
};
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex as def_knex } from 'knex';

interface IStockMovementBase {
    direction: 'in' | 'out';
    rows: {
        prod_id: number;
        quantity: number;
        notes?: string | null;
    }[];
}

export const manualAdjustmentBatch = async (trx: def_knex.Transaction, params: IStockMovementBase) => {
    const records = params.rows.map(row => ({
        prod_id: row.prod_id,
        direction: params.direction,
        quantity: row.quantity,
        unit_cost: null,
        origin_type: 'manual' as const,
        origin_id: null,
        notes: row.notes || null,
        affect_wac: false
    }));
    return await trx(ETableNames.stock_movements).insert(records);
};
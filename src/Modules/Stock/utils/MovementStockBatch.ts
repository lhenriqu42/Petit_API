import { TOriginType } from '../../../server/database/models/stock_movements';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex as def_knex } from 'knex';

interface IRowOut {
    prod_id: number;
    quantity: number;
    unit_cost?: never;
    notes?: string | null;
}

interface IRowIN {
    prod_id: number;
    quantity: number;
    unit_cost: number;
    notes?: string | null;
}

interface IStockMovementBatchBase {
    origin_type?: TOriginType;
    origin_id?: number | null;
    affect_wac?: boolean;
}

interface IStockIN  extends IStockMovementBatchBase {
    direction: 'in';
    rows: IRowIN[];
}

interface IStockOUT extends IStockMovementBatchBase {
    direction: 'out';
    rows: IRowOut[];
}

type  RequestParameters = IStockIN | IStockOUT;

export const movementStockBatch = (trx: def_knex.Transaction, params: RequestParameters) => {

    const records = params.rows.map(row => ({
        prod_id: row.prod_id,
        direction: params.direction,
        quantity: row.quantity,
        unit_cost: row.unit_cost || null,
        origin_type: params.origin_type || null,
        origin_id: params.origin_id || null,
        notes: row.notes || null,
        affect_wac: params.affect_wac
    }));


    return trx(ETableNames.stock_movements).insert(records);
};
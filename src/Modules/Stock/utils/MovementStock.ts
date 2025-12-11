import { TOriginType } from '../../../server/database/models/stock_movements';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex as def_knex } from 'knex';

interface IStockMovementBase {
    prod_id: number;
    quantity: number;

    origin_type?: TOriginType;
    origin_id?: number | null;
    notes?: string | null;
    affect_wac?: boolean;
}

interface IStockIN extends IStockMovementBase {
    direction: 'in';
    unit_cost: number;
}

interface IStockOUT extends IStockMovementBase {
    direction: 'out';
    unit_cost?: never;
}

export type RequestParameters = IStockIN | IStockOUT;

export const movementStock = (trx: def_knex.Transaction, params: RequestParameters) => {
    return trx(ETableNames.stock_movements).insert({
        prod_id: params.prod_id,
        direction: params.direction,
        quantity: params.quantity,
        unit_cost: params.unit_cost || null,
        origin_type: params.origin_type || null,
        origin_id: params.origin_id || null,
        notes: params.notes || null,
        affect_wac: params.affect_wac
    });
};
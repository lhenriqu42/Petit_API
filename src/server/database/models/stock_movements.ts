export const  ORIGIN_TYPES = [
    'purchase',     // ENTRADA
    'sale',         // SAÍDA
    'return',       // ENTRADA
    'prod_output',  // SAÍDA
    'manual',       // ENTRADA ou SAÍDA
] as const;

export type TOriginType = typeof ORIGIN_TYPES[number] | null;

export interface IStockMovements {
    id: number;
    prod_id: number;
    direction: 'in' | 'out';
    quantity: number; // sempre positivo

    // pode ser null em movimentos que não têm custo explícito
    unit_cost?: number | null;
    total_cost?: number | null;

    origin_type?: TOriginType;
    origin_id?: number | null;

    notes?: string | null;

    created_at: Date;
    affect_wac: boolean;
}
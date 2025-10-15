import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPurchases } from '../../models';

interface IResponse {
    totalCount: number,
    purchases: {
        id: number,
        supplier_id: number,
        total_value: number,
        created_at: Date,
        updated_at: Date,
        supplier_name: string,
    }[]
}

const count = async (): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.purchases)
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};

export const getPurchases = async (page: number, limit: number): Promise<IResponse | Error> => {
    try {

        const result = await Knex<IPurchases>(ETableNames.purchases)
            .select('*', 'suppliers.name as supplier_name')
            .join(ETableNames.suppliers, 'suppliers.id', 'purchases.supplier_id')
            .orderBy('purchases.id', 'desc')
            .offset((page - 1) * limit)
            .limit(limit);
        const total = await count();
        if (total instanceof Error) return total;
        return { totalCount: total, purchases: result };
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IPurchases } from '../../../server/database/models';

interface IResponse {
    totalCount: number,
    purchases: {
        id: number,
        supplier_id: number,
        total_value: number,
        effected: boolean,
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
            .select(
                `${ETableNames.purchases}.id`,
                `${ETableNames.purchases}.supplier_id`,
                `${ETableNames.purchases}.total_value`,
                `${ETableNames.purchases}.effected`,
                `${ETableNames.purchases}.created_at`,
                `${ETableNames.purchases}.updated_at`,
                `${ETableNames.suppliers}.name as supplier_name`,
            )
            .join(ETableNames.suppliers, 'suppliers.id', 'purchases.supplier_id')
            .orderBy(`${ETableNames.purchases}.id`, 'desc')
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

import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IPurchaseDetails, IPurchases } from '../../../server/database/models';

interface IResponse {
    purchase: {
        id: number;
        supplier_id: number;
        total_value: number;
        effected: boolean;
        created_at: Date;
        updated_at: Date;
        details: {
            total_count: number;
            prod_list: (IPurchaseDetails & { prod_name: string })[];
        };
    };
}

export const getPurchaseDetails = async (purchase_id: number): Promise<IResponse | Error> => {
    try {
        // Busca a compra principal
        const purchase = await Knex<IPurchases>(ETableNames.purchases)
            .select(
                'id',
                'supplier_id',
                'total_value',
                'effected',
                'created_at',
                'updated_at'
            )
            .where('id', purchase_id)
            .first();

        if (!purchase) return new Error('Purchase not found');

        // Consulta de detalhes com total_count em uma única query
        const detailsQuery = Knex(ETableNames.purchase_details)
            .select(
                `${ETableNames.purchase_details}.*`,
                `${ETableNames.products}.name as prod_name`
            )
            .leftJoin(ETableNames.products, `${ETableNames.products}.id`, `${ETableNames.purchase_details}.prod_id`)
            .where('purchase_id', purchase_id)
            .orderBy('id', 'asc');

        const countQuery = Knex(ETableNames.purchase_details)
            .where('purchase_id', purchase_id)
            .count<{ count: number }[]>('* as count')
            .first();

        const [prod_list, total] = await Promise.all([detailsQuery, countQuery]);

        const total_count = Number(total?.count || 0);

        return {
            purchase: {
                ...purchase,
                details: {
                    total_count,
                    prod_list,
                },
            },
        };
    } catch (e) {
        console.error(e);
        return new Error('Get Failed');
    }
};

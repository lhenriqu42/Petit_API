import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IPurchaseDetails, IPurchases } from '../../../server/database/models';

interface IResponse {
    purchase: {
        id: number;
        supplier: {
            id: number;
            name: string;
        };
        total_value: number;
        effected: boolean;
        created_at: Date;
        updated_at: Date;
        items_summary: {
            count: number;
            items: (IPurchaseDetails & {
                name: string;
                price: number;
                pack_quantity?: number | null;
            })[];
        };
    };
}

export const getPurchaseDetails = async (purchase_id: number): Promise<IResponse | Error> => {
    try {
        const purchase = await Knex<IPurchases>(`${ETableNames.purchases} as pur`)
            .select(
                'pur.id',
                'pur.supplier_id',
                'pur.total_value',
                'pur.effected',
                'pur.created_at',
                'pur.updated_at',
                'sup.name as supplier_name',
            )
            .join(`${ETableNames.suppliers} as sup`, 'sup.id', 'pur.supplier_id')
            .where('pur.id', purchase_id)
            .first();

        if (!purchase) return new Error('Purchase not found');

        const items = await Knex(`${ETableNames.purchase_details} as pd`)
            .select(
                'pd.id',
                'pd.type',
                'pd.prod_id',
                'pd.pack_id',
                'pd.quantity',
                'pd.price',
                'p.name as name',
                Knex.raw(`
                    CASE 
                        WHEN pd.pack_id IS NOT NULL THEN pk.prod_qnt 
                        ELSE NULL
                    END as pack_quantity
                `)
            )
            .leftJoin(`${ETableNames.products} as p`, 'p.id', 'pd.prod_id')
            .leftJoin(`${ETableNames.packs} as pk`, 'pk.id', 'pd.pack_id')
            .where('pd.purchase_id', purchase_id)
            .orderBy('pd.id', 'asc');

        const total_count = items.length;

        return {
            purchase: {
                id: purchase.id,
                supplier: {
                    id: purchase.supplier_id,
                    name: purchase.supplier_name,
                },
                total_value: purchase.total_value,
                effected: purchase.effected,
                created_at: purchase.created_at,
                updated_at: purchase.updated_at,
                items_summary: {
                    count: total_count,
                    items: items.map(i => ({
                        ...i,
                        price: Number(i.price),
                        quantity: Number(i.quantity),
                        pack_quantity: i.pack_quantity ? Number(i.pack_quantity) : null,
                    })),
                },
            },
        };
    } catch (e) {
        console.error(e);
        return new Error('Get Failed');
    }
};

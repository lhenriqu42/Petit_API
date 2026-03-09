import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { EPurchaseType, IPurchases } from '../../../server/database/models';


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
            items: {
                id: number;
                type: EPurchaseType;
                quantity: number;
                price: number;
                pricetotal: number;

                prod_id: number;
                prod_name: string;
                prod_price: number;

                pack_id: number | null;
                pack_quantity?: number | null;

                pack_deleted_qnt?: number | null; // Will be present if type is 'PACK' and the pack has been deleted

            }[];
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
                'pd.price',
                'pd.quantity',
                'pd.pricetotal',
                'pd.pack_deleted_qnt',
                'pr.name as prod_name',
                'pr.price as prod_price',
                Knex.raw(`
                    CASE 
                        WHEN pd.pack_id IS NOT NULL THEN pk.prod_qnt 
                        ELSE NULL
                    END as pack_quantity
                `)
            )
            .leftJoin(`${ETableNames.products} as pr`, 'pr.id', 'pd.prod_id')
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
                total_value: Number(purchase.total_value),
                effected: purchase.effected,
                created_at: purchase.created_at,
                updated_at: purchase.updated_at,
                items_summary: {
                    count: total_count,
                    items: items.map(i => ({
                        id: i.id,
                        type: i.type,
                        quantity: i.quantity,
                        price: Number(i.price),
                        pricetotal: Number(i.pricetotal),

                        prod_id: i.prod_id,
                        prod_name: i.prod_name,
                        prod_price: Number(i.prod_price),

                        pack_id: i.pack_id,
                        pack_quantity: i.pack_quantity,

                        pack_deleted_qnt: i.pack_deleted_qnt,
                    })),
                },
            },
        };
    } catch (e) {
        console.error(e);
        return new Error('Get Failed');
    }
};
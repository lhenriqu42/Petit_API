import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { EPurchaseType } from '../../models/Purchase_details';

export interface IRequestBody {
    supplier_id: number,
    purchases: {
        type: EPurchaseType,
        prod_id: number,
        pack_id: number | null, // if type is PRODUCT, this must be null
        quantity: number,
        price: number,
    }[];
}

export const create = async (request: IRequestBody): Promise<number | Error> => {
    try {
        const supplierExists = await Knex(ETableNames.suppliers).where({ id: request.supplier_id }).first();
        if (!supplierExists) {
            return new Error('Supplier not found');
        }


        let total_value = 0;
        for (const item of request.purchases) {
            const pricetotal = item.price * item.quantity;
            total_value += pricetotal;
        }


        const combinations = request.purchases
            .filter(p => p.pack_id != null)
            .map(p => [p.pack_id!, p.prod_id]);

            
        if (combinations.length > 0) {
            const exists = await Knex(ETableNames.prod_packs)
                .whereIn(['pack_id', 'prod_id'], combinations);

            if (exists.length !== combinations.length) {
                return new Error('Invalid product-pack combination');
            }
        }

        const trx = await Knex.transaction();
        const [purchase] = await trx(ETableNames.purchases).insert({
            supplier_id: request.supplier_id,
            total_value,
            effected: false,
        }).returning('id');

        const purchaseDetailsToInsert = request.purchases.map(item => ({
            purchase_id: purchase.id,
            type: item.type,
            prod_id: item.prod_id,
            pack_id: item.pack_id,
            quantity: item.quantity,
            price: item.price,
            pricetotal: item.price * item.quantity
        }));

        await trx(ETableNames.purchase_details).insert(purchaseDetailsToInsert);
        await trx.commit();
        return purchase.id;
    } catch (e: unknown) {
        const postError = e as PostgresError;
        if (postError.code == '23503')
        {
            if (postError.detail?.includes('pack_id'))
                return new Error('Pack ID not found');
            if (postError.detail?.includes('prod_id'))
                return new Error('Product ID not found');
        }
        console.log(e);
        return new Error('Register Failed');
    }
};

interface PostgresError extends Error {
    code?: string;
    detail?: string;
}
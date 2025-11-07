import AppError, { NotFoundError, ValidationError } from '../../../server/shared/Errors';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { EPurchaseType } from '../../../server/database/models/Purchase_details';

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

export const editPurchase = async (purchase_id: number, request: IRequestBody): Promise<void> => {
    try {
        if (request.purchases.length === 0) {
            throw new ValidationError('At least one purchase item is required');
        }
        await Knex.transaction(async (trx) => {
            const purchaseExists = await trx(ETableNames.purchases).where({ id: purchase_id }).forUpdate().first();
            if (!purchaseExists) {
                throw new NotFoundError('Purchase not found');
            }

            const supplierExists = await trx(ETableNames.suppliers).where({ id: request.supplier_id }).first();
            if (!supplierExists) {
                throw new NotFoundError('Supplier not found');
            }


            const total_value = request.purchases.reduce((sum, item) => sum + item.price * item.quantity, 0);


            const combinations = request.purchases
                .filter(p => p.pack_id != null)
                .map(p => [p.pack_id!, p.prod_id]);


            if (combinations.length > 0) {
                const exists = await trx(ETableNames.prod_packs)
                    .whereIn(['pack_id', 'prod_id'], combinations);

                if (exists.length !== combinations.length) {
                    throw new ValidationError('Invalid product-pack combination');
                }
            }

            const purchaseDetailsToInsert = request.purchases.map(item => ({
                purchase_id: purchase_id,
                type: item.type,
                prod_id: item.prod_id,
                pack_id: item.pack_id,
                quantity: item.quantity,
                price: item.price,
                pricetotal: item.price * item.quantity
            }));


            await trx(ETableNames.purchase_details).where({ purchase_id }).del();
            await trx(ETableNames.purchase_details).insert(purchaseDetailsToInsert);
            await trx(ETableNames.purchases)
                .where({ id: purchase_id })
                .update({
                    supplier_id: request.supplier_id,
                    total_value,
                    effected: false,
                    updated_at: Knex.fn.now(),
                });
        });


    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        const postError = e as PostgresError;
        if (postError.code == '23503') {
            if (postError.detail?.includes('pack_id'))
                throw new NotFoundError('Pack ID not found');
            if (postError.detail?.includes('prod_id'))
                throw new NotFoundError('Product ID not found');
        }
        console.log(e);
        throw new AppError('Edit Failed', 500);
    }
};

interface PostgresError extends Error {
    code?: string;
    detail?: string;
}
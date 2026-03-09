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

export const create = async (request: IRequestBody): Promise<number> => {
    try {
        return await Knex.transaction(async (trx) => {
            // Verifica se o fornecedor existe
            const supplierExists = await trx(ETableNames.suppliers)
                .where({ id: request.supplier_id })
                .first();

            if (!supplierExists) {
                throw new NotFoundError('Supplier not found');
            }

            // Calcula o total da compra
            let total_value = 0;
            for (const item of request.purchases) {
                total_value += item.price * item.quantity;
            }

            // Valida combinações pack-produto
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


            // Cria a compra principal
            const [purchase] = await trx(ETableNames.purchases)
                .insert({
                    supplier_id: request.supplier_id,
                    total_value,
                    effected: false,
                })
                .returning('id');

            // Prepara detalhes da compra
            const purchaseDetailsToInsert = request.purchases.map(item => ({
                purchase_id: purchase.id,
                type: item.type,
                prod_id: item.prod_id,
                pack_id: item.pack_id,
                quantity: item.quantity,
                price: item.price,
                pricetotal: item.price * item.quantity,
            }));

            // Insere detalhes
            await trx(ETableNames.purchase_details).insert(purchaseDetailsToInsert);

            return purchase.id;
        });

    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        const postError = e as PostgresError;
        if (postError.code === '23503') {
            if (postError.detail?.includes('pack_id'))
                throw new NotFoundError('Pack ID not found');
            if (postError.detail?.includes('prod_id'))
                throw new NotFoundError('Product ID not found');
        }

        console.error(e);
        throw new AppError('Register Failed', 500);
    }
};

interface PostgresError extends Error {
    code?: string;
    detail?: string;
}

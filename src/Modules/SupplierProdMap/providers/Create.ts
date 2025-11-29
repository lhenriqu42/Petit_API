import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISupplierProdMap } from '../../../server/database/models';
import AppError, { NotFoundError } from '../../../server/shared/Errors';

export interface IRequestCreateBody {
    supplier_id: number,
    prod_id: number,
    pack_id?: number,
    supplier_prod_id: string,

    supplier_prod_code: string,
    supplier_prod_name: string,
}

type ICreateResponse = ISupplierProdMap & {
    prod_name: string;
    pack_qtt: number | null;
};

export const create = async (req: IRequestCreateBody): Promise<ICreateResponse> => {
    try {
        const obj = await Knex.transaction(async trx => {

            // 🔹 1. Verifica se supplier_id, prod_id e pack_id existem
            const supplierExists = await trx(ETableNames.suppliers).where('id', req.supplier_id).first('id');
            if (!supplierExists) throw new NotFoundError('Supplier not found');

            const prodExists = await trx(ETableNames.products).where('id', req.prod_id).first('name');
            if (!prodExists) throw new NotFoundError('Product not found');

            let packExists = null;
            if (req.pack_id) {
                packExists = await trx(ETableNames.packs).where('id', req.pack_id).first('prod_qnt');
                if (!packExists) throw new NotFoundError('Pack not found');
            }


            // 🔹 2. Cria uma nova entrada no mapeamento de produtos do fornecedor
            // Caso já exista uma entrada com o mesmo supplier_id e supplier_prod_id, atualiza a entrada existente
            const [obj] = await trx(ETableNames.supplier_prod_map)
                .insert({
                    supplier_id: req.supplier_id,
                    prod_id: req.prod_id,
                    pack_id: req.pack_id || null,
                    supplier_prod_id: req.supplier_prod_id,
                    supplier_prod_code: req.supplier_prod_code,
                    supplier_prod_name: req.supplier_prod_name,
                })
                .onConflict(['supplier_id', 'supplier_prod_id'])
                .merge()
                .returning('*');
            return { ...obj, prod_name: prodExists.name, pack_qtt: req.pack_id ? packExists!.prod_qnt : null };
        });
        return obj;
    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        console.error(e);
        throw new AppError('Error creating supplier product map');
    }
};
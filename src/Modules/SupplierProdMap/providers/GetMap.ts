import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISupplierProdMap } from '../../../server/database/models';
import AppError from '../../../server/shared/Errors';

interface IGetMapResponse extends ISupplierProdMap {
    prod_name: string;
    pack_qtt: number | null;
}

export const getMap = async (supplier_id: number, supplier_prod_id: string): Promise<IGetMapResponse | null> => {
    try {
        const result = await Knex(ETableNames.supplier_prod_map)
            .select(
                '*',
                `${ETableNames.products}.name as prod_name`,
                `${ETableNames.packs}.prod_qnt as pack_qtt`,
            )
            .leftJoin(ETableNames.products, `${ETableNames.products}.id`, '=', `${ETableNames.supplier_prod_map}.prod_id`)
            .leftJoin(ETableNames.packs, `${ETableNames.packs}.id`, '=', `${ETableNames.supplier_prod_map}.pack_id`
            )
            .where({
                supplier_id,
                supplier_prod_id,
            })
            .first();
        return result || null;

    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        console.error(e);
        throw new AppError('Error getting supplier product map');
    }
};
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { ISaleDetails, IStock } from '../../../server/database/models';


export const create = async (saleDetails: Omit<ISaleDetails, 'id' | 'created_at' | 'updated_at' | 'pricetotal' | 'sale_id'>[], obs?: string | null): Promise<number | Error> => {
    try {
        const fincash = await Knex(ETableNames.fincashs).select('id').where('isFinished', false).andWhere('deleted_at', null).first();
        if (fincash) {

            const productIds = saleDetails.flat().map(detail => Number(detail.prod_id));

            const productsExist = await Knex(ETableNames.products)
                .whereIn('id', productIds)
                .select('id')
                .catch(() => []);

            if (productsExist.length === productIds.length) {

                const sale = await Knex(ETableNames.sales).insert({ fincash_id: fincash.id, obs: obs as string }).returning('id');
                if (sale) {

                    const resultPromises = saleDetails.flat().map(async (element) => {
                        const [saleDetailId] = await Knex(ETableNames.saleDetails)
                            .insert({ ...element, sale_id: sale[0].id, pricetotal: (element.price * element.quantity) })
                            .returning('id');

                        let Stock = await Knex<Omit<IStock, 'created_at' | 'id' | 'updated_at'>>(ETableNames.stocks).select('*').where('prod_id', element.prod_id).first();
                        if (!Stock) {
                            Stock = { prod_id: element.prod_id, stock: 0 };
                            await Knex(ETableNames.stocks).insert(Stock as IStock);
                        }
                        await Knex(ETableNames.stocks).update({ stock: (Stock.stock - element.quantity), updated_at: Knex.fn.now() }).where('prod_id', element.prod_id);

                        return saleDetailId;
                    });

                    const saleDetailIds = await Promise.all(resultPromises);

                    return saleDetailIds.length;
                } else {
                    return new Error('Unknown Error');
                }


            } else {
                return new Error('One or more products not found, check the product IDs');
            }
        } else {
            return new Error('No open fincash found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
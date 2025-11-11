import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IStock } from '../../../server/database/models';

export const create = async (stock: Omit<IStock, 'id' | 'created_at' | 'updated_at'>): Promise<number | Error> => {
    try {
        const product = await Knex(ETableNames.products).select('id').where('id', stock.prod_id).andWhere('deleted_at', null).first();
        if (product) {
            const stock_product = await Knex(ETableNames.stocks).select('*').where('prod_id', stock.prod_id).first();
            if (stock_product) {
                const result = await Knex(ETableNames.stocks)
                    .update({ stock: (stock_product.stock + stock.stock), updated_at: Knex.fn.now() })
                    .where('id', stock_product.id);
                if (typeof result === 'number') {
                    return result;
                }
                return new Error('Register Failed');
            }
            else {
                const [result] = await Knex(ETableNames.stocks)
                    .insert(stock)
                    .returning('id');

                if (typeof result === 'object') {
                    return result.id;

                } else if (typeof result === 'number') {
                    return result;
                }

                return new Error('Register Failed');
            }
        } else {
            return new Error('Product not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};
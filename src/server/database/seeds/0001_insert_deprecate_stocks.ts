import { randNumberRange } from '../../shared/services';
import { Knex } from '../knex';
import { Products } from '@/../../AllProducts.json';


export const seed = async () => {
    const min = 5;
    const max = 200;
    randNumberRange(min, max);
    const stocksToInsert: { prod_id: number, stock: number }[] = [];
    for (const product of Products) {
        const stockQuantity = randNumberRange(min, max);
        stocksToInsert.push({
            prod_id: Number(product.id),
            stock: stockQuantity
        });
    }
    await Knex('stocks').insert(stocksToInsert);
};

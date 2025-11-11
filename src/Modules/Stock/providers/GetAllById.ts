import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IStock } from '../../../server/database/models';

// Define a new type that includes both stock data and product name
type StockWithProductName = {
    prod_id: number;
    prod_name: string;
    stockData: IStock[];
};

export const getAllById = async (page: number, limit: number, prod_id: number): Promise<StockWithProductName | Error> => {
    try {
        const product = await Knex(ETableNames.products).select('*').where('id', prod_id).andWhere('deleted_at', null).first();
        if (product) {
            const result = await Knex(ETableNames.stocks)
                .select('*')
                .where('prod_id', prod_id)
                .offset((page - 1) * limit)
                .limit(limit);

            // Return a new object that includes both prod_name and stockData
            return { prod_id: product.id, prod_name: product.name, stockData: result };
        } else {
            return new Error('Product not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

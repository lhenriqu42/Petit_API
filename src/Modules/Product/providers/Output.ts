import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProdOutput } from '../../../server/database/models';


export const output = async (prod_output: Omit<IProdOutput, 'id' | 'created_at' | 'updated_at'>): Promise<number | Error> => {
    try {

        const Stock = await Knex(ETableNames.stocks).select('*').where('prod_id', prod_output.prod_id).first();
        if (!Stock) return Error('Stock not Found');

        const result = await Knex(ETableNames.prod_output).insert(prod_output);
        if (!result) return Error('Insert Error');

        const output = await Knex(ETableNames.stocks).update({ stock: (Stock.stock - prod_output.quantity), updated_at: Knex.fn.now() }).where('prod_id', prod_output.prod_id);
        if (!output) return Error('Update Stock Error');

        return output;

    } catch (e) {
        console.log(e);
        return new Error('Fincash not Found');
    }
};
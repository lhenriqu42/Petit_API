import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export interface IRequestBody {
    prod_id: number;
    description: string;
    prod_qnt: number;

}

export const create = async (request: IRequestBody): Promise<number | Error> => {
    try {
        const product = await Knex(ETableNames.products).where('id', request.prod_id).first();
        if (!product) return new Error('Product not found');

        const [result] = await Knex(ETableNames.packs).insert({ ...request }).returning('id');
        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }
        return new Error('Register Failed');
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};

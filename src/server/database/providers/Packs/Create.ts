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

        const [id] = await Knex(ETableNames.packs).insert({ ...request });
        if (id) return id;
        return new Error('Register Failed');
    } catch (e) {
        console.log(e);
        return new Error('Register Failed');
    }
};

import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const create = async (prod_qnt: number): Promise<number | Error> => {
    try {
        const existing = await Knex(ETableNames.packs).where({ prod_qnt }).first();
        if (existing) {
            return new Error('Pack with this product quantity already exists');
        }
        const description = `Embalagem com ${prod_qnt} itens`;
        const [result] = await Knex(ETableNames.packs).insert({ description, prod_qnt }).returning('id');
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

import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';

interface IProductWithValidity extends IProduct {
    validity: Date,
    created_at: Date,
    updated_at: Date,
}

export const getAllById = async (page: number, limit: number, prod_id: number): Promise<IProductWithValidity[] | Error> => {
    try {
        const product = await Knex(ETableNames.products).select('*').where('id', prod_id).andWhere('deleted_at', null).first();
        if (product) {
            const result = await Knex(ETableNames.products)
                .join(ETableNames.validities, `${ETableNames.products}.id`, '=', `${ETableNames.validities}.prod_id`)
                .select('*')
                .where(`${ETableNames.products}.id`, prod_id)
                .andWhere(`${ETableNames.products}.deleted_at`, null)
                .offset((page - 1) * limit)
                .limit(limit)
                .orderBy(`${ETableNames.validities}.validity`);

            return result;
        } else {
            return new Error('Product not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

export const countById = async (prod_id: number) => {
    try {
        const [{ count }] = await Knex(ETableNames.validities)
            .where('prod_id', prod_id)
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};

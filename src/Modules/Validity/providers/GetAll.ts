import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';


interface IProductWithValidity extends IProduct {
    validity: Date,
    created_at: Date,
    updated_at: Date,
}

export const getAll = async (page: number, limit: number): Promise<IProductWithValidity[] | Error> => {
    try {
        const result = await Knex(ETableNames.products)
            .join(ETableNames.validities, `${ETableNames.products}.id`, '=', `${ETableNames.validities}.prod_id`)
            .select('*')
            .where(`${ETableNames.products}.deleted_at`, null)
            .offset((page - 1) * limit)
            .limit(limit)
            .orderBy(`${ETableNames.validities}.validity`);

        return result;

    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

export const countAll = async () => {
    try {
        const [{ count }] = await Knex(ETableNames.validities)
            .count<[{ count: number }]>('* as count');
        if (Number.isInteger(Number(count))) return Number(count);

        return new Error('Count Failed');
    } catch (e) {
        console.log(e);
        return new Error('Count Failed');
    }
};
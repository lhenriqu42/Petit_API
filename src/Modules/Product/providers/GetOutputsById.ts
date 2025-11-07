import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export interface IResponse {
    output_id: number,
    fincash_id?: number,
    quantity: number,
    reason: string,
    desc?: string,
    created_at: Date,
    updated_at: Date,

    prod_id: number,
    prod_code: string,
    prod_name: string,
    prod_sector: number,
    prod_price: number
}

export const getOutputById = async (id: number): Promise<IResponse | Error> => {
    try {

        const result = await Knex(ETableNames.prod_output)
            .join(ETableNames.products, `${ETableNames.products}.id`, `${ETableNames.prod_output}.prod_id`)
            .select(
                `${ETableNames.prod_output}.id as output_id`,
                `${ETableNames.prod_output}.fincash_id`,
                `${ETableNames.prod_output}.quantity`,
                `${ETableNames.prod_output}.reason`,
                `${ETableNames.prod_output}.desc`,
                `${ETableNames.prod_output}.created_at`,
                `${ETableNames.prod_output}.updated_at`,

                `${ETableNames.products}.id as prod_id`,
                `${ETableNames.products}.code as prod_code`,
                `${ETableNames.products}.name as prod_name`,
                `${ETableNames.products}.sector as prod_sector`,
                `${ETableNames.products}.price as prod_price`,
            )
            .where(`${ETableNames.prod_output}.id`, id)
            .first();
        if (result) return result;
        return Error('Get Failed');

    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
import { Knex } from '../../../../server/database/knex';
import { ETableNames } from '../../../../server/database/ETableNames';

export interface IResponse {
    day: Date;
    first_id: number;
    total_card_value: number;
    total_registered_value: number;
    total_invoicing: number;
}

export const getDataByDate = async (init: Date, end: Date): Promise<IResponse[] | Error> => {
    try {
        const result = await Knex<IResponse>(ETableNames.fincashs)
            .select(
                Knex.raw('DATE(created_at) AS day'),
                Knex.raw('MIN(id) AS first_id'),
                Knex.raw('SUM("cardValue") AS total_card_value'),
                Knex.raw('SUM("totalValue") AS total_registered_value'),
                Knex.raw('SUM(invoicing) AS total_invoicing')
            )
            .whereBetween('created_at', [init, end])
            .groupBy(Knex.raw('DATE(created_at)'))
            .orderBy('day');

        return result;
    } catch (e) {
        console.error(e); // Logue o erro para depuração
        return new Error('Get Failed');
    }
};

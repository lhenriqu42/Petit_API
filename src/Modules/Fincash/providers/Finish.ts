import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';

type TFincashParam = Omit<IFincash, 'id' | 'created_at' | 'updated_at' | 'opener' | 'value' | 'finalDate' | 'isFinished'>;

export const finish = async (id: number, fincash: TFincashParam): Promise<void | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.fincashs).where('id', id).count<[{ count: number }]>('* as count');
        if (count === 0) return Error('Fincash not found');

        const finished = await Knex(ETableNames.fincashs).select('*').where('id', id).andWhere('isFinished', true).first();
        if (!finished) {

            const totalValue = await getTotalValue(id);
            const result = await Knex(ETableNames.fincashs)
                .update({
                    ...fincash,
                    finalDate: Knex.fn.now(),
                    isFinished: true,
                    totalValue
                })
                .where('id', id);

            if (result > 0) {
                return;
            } else {
                return new Error('Finish Failed: INTERNAL ERROR');
            }
        } else {
            return new Error('FinCash already Finished');
        }

    } catch (e) {
        console.log(e);
        return new Error('Finish Failed');
    }
};


const getTotalValue = async (fincash_id: number) => {
    const response: { sum: number }[] = await Knex(ETableNames.sales)
        .join(ETableNames.saleDetails, `${ETableNames.sales}.id`, `${ETableNames.saleDetails}.sale_id`)
        .where(`${ETableNames.sales}.fincash_id`, fincash_id)
        .andWhere(`${ETableNames.sales}.deleted_at`, null)
        .sum(`${ETableNames.saleDetails}.pricetotal`);
    return response[0].sum;
};
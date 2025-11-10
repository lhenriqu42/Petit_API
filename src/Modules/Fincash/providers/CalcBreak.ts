import { Knex as def_knex } from 'knex';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';
import { CashOutflowProvider } from '../../CashOutflow/providers';

export const calcBreak = async (cardValue: number, fincash_id: number): Promise<number | Error> => {
    try {
        const fincash = await Knex(ETableNames.fincashs).select('*').where('id', fincash_id).first();
        if (fincash) {
            if (fincash.isFinished) {
                const breakCalc = await getBreak(fincash, cardValue);
                if (!(breakCalc instanceof Error)) {

                    const { realBreak, invoicing } = breakCalc;

                    const result = await Knex(ETableNames.fincashs)
                        .update({
                            cardValue,
                            invoicing,
                            break: realBreak,
                        })
                        .where('id', fincash_id);

                    if (result > 0) {
                        return realBreak;
                    } else {
                        return Error('Internal Server Error');
                    }
                } else {
                    return breakCalc; // ERROR
                }

            } else {
                return new Error('Fincash is not finished');
            }
        } else {
            return new Error('Fincash not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Update Failed');
    }
};


export const getBreak = async (fincash: IFincash, cardValue: number, trx?: def_knex.Transaction): Promise<{ realBreak: number, invoicing: number } | Error> => {
    if ((fincash.finalValue || fincash.finalValue == null) && (fincash.totalValue || fincash.totalValue == null)) {
        if (fincash.finalValue == null) fincash.finalValue = 0;
        if (fincash.totalValue == null) fincash.totalValue = 0;
        const total = await CashOutflowProvider.getTotalById(fincash.id, trx);
        if (!(total instanceof Error)) {
            const TotalCash = Number((fincash.finalValue - fincash.value)) + Number(total);
            const invoicing = TotalCash + Number(cardValue);
            const realBreak = invoicing - Number(fincash.totalValue);
            return { realBreak, invoicing };
        }
        return total;
    }
    return new Error('Get break error (provider)');
};
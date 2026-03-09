import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const markWithPaid = async (payment_id: number): Promise<void | Error> => {
    try {
        const alreadyPaid = await Knex(ETableNames.payments).select('paid').where('id', payment_id).first();
        if (!alreadyPaid) return new Error('Payment not found');
        if (alreadyPaid.paid) return new Error('This Payment has already been marked with paid');

        await Knex(ETableNames.payments)
            .update('paid', new Date())
            .where('id', '=', payment_id);

        return;

    } catch (e) {
        console.log(e);
        return new Error('Delete Failed');
    }
};

export const unmarkWithPaid = async (payment_id: number): Promise<void | Error> => {
    try {
        const alreadyPaid = await Knex(ETableNames.payments).select('paid').where('id', payment_id).first();
        if (!alreadyPaid) return new Error('Payment not found');
        if (!alreadyPaid.paid) return new Error('This Payment has not been marked with paid');

        await Knex(ETableNames.payments)
            .update('paid', null)
            .where('id', '=', payment_id);

        return;

    } catch (e) {
        console.log(e);
        return new Error('Delete Failed');
    }
};
import { IBodyOutflow } from '../controllers/types';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { getBreak } from '../../Fincash/providers/CalcBreak';

export const EditById = {
    update: async (outflow_id: number, outflow: IBodyOutflow) => {
        try {
            const outflowExist = await Knex(ETableNames.cashOutflows)
                .select('*')
                .where('id', outflow_id)
                .first();
            if (!outflowExist) return new Error('Outflow not found');
            const result = await Knex(ETableNames.cashOutflows)
                .update({
                    ...outflow,
                    updated_at: Knex.fn.now(),
                })
                .where('id', '=', outflow_id);

            if (result > 0) {
                const fincash_id = outflowExist.fincash_id;
                const breakUpdate = await updateFincash(fincash_id);
                if (breakUpdate instanceof Error) return breakUpdate;
                return;
            }

            return new Error('Update Failed');
        } catch (e) {
            console.log(e);
            return new Error('Update Failed');
        }
    },
    add: async (fincash_id: number, outflowBody: IBodyOutflow) => {
        try {
            const fincash = await Knex(ETableNames.fincashs)
                .select('*')
                .where('id', fincash_id)
                .first();
            if (!fincash) return new Error('Fincash not found');
            if (fincash.deleted_at) return new Error('This Fincash has been deleted');
            const outflow = { ...outflowBody, fincash_id, };
            const [result] = await Knex(ETableNames.cashOutflows)
                .insert(outflow)
                .returning('id');

            if (result) {
                const breakUpdate = await updateFincash(fincash_id);
                if (breakUpdate instanceof Error) return breakUpdate;
                return;
            }

            return new Error('Register Failed');
        } catch (e) {
            console.log(e);
            return new Error('Add Failed');
        }
    },
    hardDelete: async (outflow_id: number) => {
        try {
            const outflowExist = await Knex(ETableNames.cashOutflows)
                .select('*')
                .where('id', outflow_id)
                .first();
            if (!outflowExist) return new Error('Outflow not found');
            const result = await Knex(ETableNames.cashOutflows)
                .where('id', '=', outflow_id)
                .del();

            if (result > 0) {
                const breakUpdate = await updateFincash(outflowExist.fincash_id);
                if (breakUpdate instanceof Error) return breakUpdate;
                return;
            }

            return new Error('Delete Failed');
        } catch (e) {
            console.log(e);
            return new Error('Delete Failed');
        }
    },
    // softDelete: async (outflow_id: number) => {
    //     try {
    //         const result = await Knex(ETableNames.cashOutflows)
    //             .update({
    //                 deleted_at: Knex.fn.now(),
    //             })
    //             .where('id', '=', outflow_id);

    //         if (result > 0) {
    //             return;
    //         }

    //         return new Error('Delete Failed');
    //     } catch (e) {
    //         console.log(e);
    //         return new Error('Delete Failed');
    //     }
    // },
};

const updateFincash /* Break & Invoicing */ = async (fincash_id: number) => {
    const fincash = await Knex(ETableNames.fincashs).select('*').where('id', fincash_id).first();
    if (!fincash) return Error('Fincash not found');
    if (fincash.deleted_at) return Error('This Fincash has been deleted');
    if (!fincash.cardValue) return 0; //dont need to update

    const breakCalc = await getBreak(fincash, fincash.cardValue);
    if (breakCalc instanceof Error) return breakCalc;

    const { realBreak, invoicing } = breakCalc;

    const result = await Knex(ETableNames.fincashs)
        .update({
            invoicing,
            break: realBreak,
        })
        .where('id', fincash_id);

    if (result > 0)
        return realBreak;
    else
        return Error('Internal Server Error');

};
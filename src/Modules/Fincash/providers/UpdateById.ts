import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';
import { getBreak } from './CalcBreak';

export const updateById = async (fincash_id: number, content: { opener: string, value: number, finalValue: number, cardValue: number, obs?: string }): Promise<void | Error> => {
    try {
        const fincash = await Knex(ETableNames.fincashs)
            .select('*')
            .where('id', '=', fincash_id)
            .first();
        if (!fincash) return new Error('Fincash not found');

        const obj = await reCalc(fincash, content);
        if (obj instanceof Error) return obj;

        const result = await Knex(ETableNames.fincashs)
            .update({
                ...obj,
                updated_at: Knex.fn.now(),
            })
            .where('id', '=', fincash_id);

        if (result > 0) {
            return;
        }

        return new Error('Update Failed');
    } catch (e) {
        console.log(e);
        return new Error('Update Failed');
    }
};

const reCalc = async (fincash: IFincash, content: { opener: string, value: number, finalValue: number, cardValue: number, obs?: string }) => {
    const previousFincash: Error | IFincash = await getPreviousFincash(fincash.id);
    if (previousFincash instanceof Error) return previousFincash;
    if (!previousFincash.finalValue) previousFincash.finalValue = 0;

    fincash.value = content.value;
    fincash.finalValue = content.finalValue;

    let diferenceLastFincash = null;
    const r = fincash.value - previousFincash.finalValue;
    if (r !== 0) {
        diferenceLastFincash = r;
    }
    const result = await getBreak(fincash, content.cardValue);
    if (result instanceof Error) return result;
    const { realBreak, invoicing } = result;

    return { break: realBreak, diferenceLastFincash, invoicing, ...content };
};

const getPreviousFincash = async (atualFincashId: number): Promise<IFincash | Error> => {
    const previousFincash = await Knex(ETableNames.fincashs)
        .select('*')
        .where('id', '<', atualFincashId)
        .orderBy('id', 'desc')
        .first();

    if (!previousFincash) return new Error('Last Fincash not found');
    return previousFincash;
};
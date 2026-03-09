import { Knex as def_knex } from 'knex';
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';
import AppError, { NotFoundError } from '../../../server/shared/Errors';
import { getBreak } from './CalcBreak';

export const updateById = async (fincash_id: number, content: { opener: string, value: number, finalValue: number, cardValue: number, obs?: string }): Promise<void> => {
    try {
        await Knex.transaction(async trx => {
            // 🔹 1. Busca o caixa
            const fincash = await trx(ETableNames.fincashs)
                .select('*')
                .where('id', '=', fincash_id)
                .first();
            if (!fincash) throw new NotFoundError('Fincash not found');



            // 🔹 2. Recalcula os valores
            const obj = await reCalc(trx, fincash, content);



            // 🔹 3. Atualiza o caixa
            await trx(ETableNames.fincashs)
                .update({
                    ...obj,
                    updated_at: Knex.fn.now(),
                })
                .where('id', '=', fincash_id);
        });
    } catch (e) {
        console.log(e);
        if (e instanceof AppError) {
            throw e;
        }
        throw new AppError('ReOpen Failed');
    }
};

const reCalc = async (trx: def_knex.Transaction, fincash: IFincash, content: { opener: string, value: number, finalValue: number, cardValue: number, obs?: string }) => {
    // 🔹 1. Tenta pegar o caixa anterior e o próximo
    const previousFincash: IFincash | undefined = await getPreviousFincash(trx, fincash.id);
    const nextFincash: IFincash | undefined = await getNextFincash(trx, fincash.id);

    // 🔹 2. Atualiza os valores do caixa atual
    fincash.value = content.value;
    fincash.finalValue = content.finalValue;

    // 🔹 3. Calcula a diferenceLastFincash do caixa atual
    const diferenceLastFincash = (fincash.value - (previousFincash?.finalValue ?? 0)) || null;

    // 🔹 4. Se houver caixa próximo, atualiza a diferenceLastFincash do próximo caixa
    if (nextFincash) {
        const nextDiferenceLastFincash = (nextFincash.value - fincash.finalValue) || null;
        await trx(ETableNames.fincashs).update({ diferenceLastFincash: nextDiferenceLastFincash, updated_at: Knex.fn.now() }).where('id', '=', nextFincash.id);
    }

    // 🔹 5. Calcula o break do caixa atual
    const result = await getBreak(fincash, content.cardValue, trx);
    if (result instanceof Error) throw new AppError('Error calculating break');
    const { realBreak, invoicing } = result;
    return { break: realBreak, diferenceLastFincash, invoicing, ...content };
};

export async function getPreviousFincash(trx: def_knex.Transaction, atualFincashId: number): Promise<IFincash | undefined> {
    const previousFincash = await trx(ETableNames.fincashs)
        .select('*')
        .where('id', '<', atualFincashId)
        .orderBy('id', 'desc')
        .first();
    return previousFincash;
}

export async function getNextFincash(trx: def_knex.Transaction, atualFincashId: number): Promise<IFincash | undefined> {
    const nextFincash = await trx(ETableNames.fincashs)
        .select('*')
        .where('id', '>', atualFincashId)
        .orderBy('id', 'asc')
        .first();
    return nextFincash;
}
import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { INFEmitter } from '../../../server/database/models';
import AppError from '../../../server/shared/Errors';

export const getByCnpj = async (cnpj: string): Promise<INFEmitter | undefined> => {
    try {
        const emitter = await Knex(ETableNames.nf_emitters).select('*').where('cnpj', cnpj).first();
        return emitter;
    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        console.error(e);
        throw new AppError('Error getting NF emitter by CNPJ');
    }
};
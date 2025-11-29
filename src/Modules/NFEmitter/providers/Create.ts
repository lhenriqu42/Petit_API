import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { INFEmitter } from '../../../server/database/models';
import AppError, { ConflictError } from '../../../server/shared/Errors';

export interface IRequestCreateBody {
    cnpj: string,
    x_nome: string,
    x_fant: string,
    ie?: string,
    cep?: string,
    uf?: string,
    city?: string,
    district?: string,
    street?: string,
    number?: string,
    complemento?: string,
    // address_str: string,  // Adicionado automaticamente via trigger no banco de dados
}

export const create = async (req: IRequestCreateBody): Promise<INFEmitter> => {
    try {
        const emitter = await Knex.transaction(async trx => {
            // 🔹 1. Verifica se ja existe registro com cnpj
            const emitterExists = await trx(ETableNames.nf_emitters).where('cnpj', req.cnpj).first();
            if (emitterExists) throw new ConflictError('NF Emitter with this CNPJ already exists');

            // 🔹 2. Cria uma nova entrada no nf_emitters
            const [emitter] = await trx(ETableNames.nf_emitters)
                .insert({
                    cnpj: req.cnpj,
                    x_nome: req.x_nome,
                    x_fant: req.x_fant,
                    ie: req.ie,
                    cep: req.cep,
                    uf: req.uf,
                    city: req.city,
                    district: req.district,
                    street: req.street,
                    number: req.number,
                    complemento: req.complemento,
                })
                .returning('*');

            return emitter;
        });
        return emitter;
    } catch (e: unknown) {
        if (e instanceof AppError) {
            throw e;
        }
        console.error(e);
        throw new AppError('Error creating NF emitter');
    }
};
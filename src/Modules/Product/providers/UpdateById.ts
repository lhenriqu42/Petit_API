import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import AppError, { BadRequestError, NotFoundError } from '../../../server/shared/Errors';

export interface IUpdateBody {
    prod?: {
        name: string,
        sector: number,
        price: number,
    }
    prod_costs?: {
        avg_cost: number;
        last_cost: number;
    }
}

export const updateById = async (prod_id: number, data: IUpdateBody): Promise<void> => {
    try {
        Knex.transaction(async trx => {
            // 🔹 1. Valida se foram passados dados para atualizar
            if (!data.prod && !data.prod_costs) throw new BadRequestError('No data provided for update');

            // 🔹 2. Verifica se o produto existe e está ativo
            const prod = await trx(ETableNames.products).select('deleted_at').where({ id: prod_id }).first();
            if (!prod) throw new NotFoundError('Product not found');
            if (prod.deleted_at) throw new BadRequestError('Product is inactive');
            
            // 🔹 3. Atualiza dados do produto
            if (data.prod) {
                await trx(ETableNames.products).update({
                    ...data.prod,
                    updated_at: Knex.fn.now(),
                }).where({ id: prod_id });
            }

            // 🔹 4. Atualiza dados de custos do produto
            if (data.prod_costs) {
                await trx(ETableNames.product_costs).update({
                    ...data.prod_costs,
                    updated_at: Knex.fn.now(),
                }).where({ prod_id });
            }
        });
    } catch (error) {
        if (!(error instanceof AppError)) {
            console.log(error);
        }
        throw new AppError('Erro ao atualizar produto');
    }
};

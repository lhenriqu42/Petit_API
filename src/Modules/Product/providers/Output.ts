import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProdOutput } from '../../../server/database/models';
import AppError from '../../../server/shared/Errors';
import { movementStock } from '../../Stock/utils/MovementStock';

export const output = async (prod_output: Omit<IProdOutput, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
    try {
        const result = await Knex.transaction(async (trx) => {
            const [output] = await trx(ETableNames.prod_output).insert(prod_output).returning('id');
            await movementStock(
                trx,
                {
                    direction: 'out',
                    prod_id: prod_output.prod_id,
                    quantity: prod_output.quantity,
                    notes: `Output ID: ${output.id} - Reason: ${prod_output.reason} - Desc: ${prod_output.desc || 'No description'}`,
                    origin_id: output.id,
                    origin_type: 'prod_output'
                }
            );
            return output.id;
        });
        return result;
    } catch (e) {
        if (e instanceof AppError) {
            throw e;
        }
        console.log(e);
        throw new AppError('Output Failed');
    }
};
import * as create from './Create';
import * as getAllById from './GetAllById';
import * as getAll from './GetAll';
import * as count from './Count';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';

export const StockProvider = {
    ...create,
    ...getAll,
    ...getAllById,
    ...count,
    ...updateById,
    ...deleteById,

};
import * as create from './Create';
import * as getAllById from './GetAllById';
import * as getAll from './GetAll';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';

export const StockController = {
    ...create,
    ...getAll,
    ...getAllById,
    ...updateById,
    ...deleteById,

};
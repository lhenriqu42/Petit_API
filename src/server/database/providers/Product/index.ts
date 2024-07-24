import * as count from './Count';
import * as create from './Create';
import * as getAll from './GetAll';
import * as getById from './GetById';
import * as getByCode from './GetByCode';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
import * as getSectorQuantity from './query/getSectorQuantity';

export const ProductProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...getByCode,
    ...updateById,
    ...deleteById,
    ...getSectorQuantity,
};
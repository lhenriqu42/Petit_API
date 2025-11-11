import * as create from './Create';
import * as getAll from './GetAll';
import * as output from './Output';
import * as getById from './GetById';
import * as getByCode from './GetByCode';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
import * as getOutputs from './getOutputs';
import * as getOutputById from './GetOutputById';
import * as getSectorValue from './query/GetSectorValue';
import * as getSectorStock from './query/GetSectorStock';
import * as getSectorQuantity from './query/GetSectorQuantity';
import * as getSectorStockValue from './query/GetSectorStockValue';

export const ProductController = {
    ...create,
    ...getAll,
    ...output,
    ...getById,
    ...getByCode,
    ...updateById,
    ...deleteById,
    ...getOutputs,
    ...getOutputById,
    ...getSectorValue,
    ...getSectorStock,
    ...getSectorQuantity,
    ...getSectorStockValue,
};
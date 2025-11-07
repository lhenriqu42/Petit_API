import * as count from './Count';
import * as create from './Create';
import * as getAll from './GetAll';
import * as output from './Output';
import * as getById from './GetById';
import * as getByCode from './GetByCode';
import * as getOutput from './GetOutputs';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
import * as outputCount from './outputCount';
import * as getOutputById from './GetOutputsById';
import * as getSectorStock from './query/getSectorStock';
import * as getSectorValue from './query/getSectorValue';
import * as getSectorQuantity from './query/getSectorQuantity';
import * as getSectorStockValue from './query/getSectorStockValue';

export const ProductProvider = {
    ...count,
    ...create,
    ...getAll,
    ...output,
    ...getById,
    ...getByCode,
    ...getOutput,
    ...updateById,
    ...deleteById,
    ...outputCount,
    ...getOutputById,
    ...getSectorStock,
    ...getSectorValue,
    ...getSectorQuantity,
    ...getSectorStockValue,
};
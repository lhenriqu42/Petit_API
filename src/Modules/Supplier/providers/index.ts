import * as count from './Count';
import * as create from './Create';
import * as getAll from './GetAll';
import * as getById from './GetById';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
// import * as getByCode from './GetByCode';

export const SupplierProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...updateById,
    ...deleteById,
    // ...getByCode,
};
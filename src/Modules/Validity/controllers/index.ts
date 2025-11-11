import * as create from './Create';
import * as getAll from './GetAll';
import * as getAllById from './GetAllById';
import * as deleteById from './DeleteById';
// import * as getById from './GetById';
// import * as getByCode from './GetByCode';
// import * as updateById from './UpdateById';

export const ValidityController = {
    ...create,
    ...getAll,
    ...getAllById,
    ...deleteById,
    // ...getById,
    // ...getByCode,
    // ...updateById,
};
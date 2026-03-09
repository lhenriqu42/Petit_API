import * as create from './Create';
import * as getAll from './GetAll';
import * as getAllById from './GetAllById';
import * as deleteById from './DeleteById';
// import * as updateById from './UpdateById';
// import * as count from './Count';

export const ValidityProvider = {
    ...create,
    ...getAll,
    ...getAllById,
    ...deleteById,
    // // ...getById,
    // // ...updateById,
    // ...count,
};
import * as create from './Create';
import * as getByEmail from './GetByEmail';
import * as createSuperUser from './CreateSuperUser';
// import * as getAll from './GetAll';
// import * as updateById from './UpdateById';
// import * as deleteById from './DeleteById';
// import * as count from './Count';
// import * as getAllById from './GetAllById';

export const UserProvider = {
    ...create,
    ...getByEmail,
    ...createSuperUser,
    // ...getAll,
    // // ...getById,
    // // ...updateById,
    // // ...deleteById,
    // ...count,
};
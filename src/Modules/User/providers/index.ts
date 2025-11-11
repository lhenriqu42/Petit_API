import * as count from './Count';
import * as getAll from './GetAll';
import * as create from './Create';
import * as deleteById from './DeleteById';
import * as getByEmail from './GetByEmail';
import * as createSuperUser from './CreateSuperUser';
// import * as updateById from './UpdateById';
// import * as getAllById from './GetAllById';

export const UserProvider = {
    ...count,
    ...getAll,
    ...create,
    ...getByEmail,
    ...deleteById,
    ...createSuperUser,
    // // ...getById,
    // // ...updateById,
};
import * as getAll from './GetAll';
import * as signIn from './SignIn';
import * as signUp from './SignUp';
import * as getRole from './GetRole';
import * as deleteById from './DeleteById';
import * as createSuperUser from './CreateSuperUser';

export const UserController = {
    ...getAll,
    ...signIn,
    ...signUp,
    ...getRole,
    ...deleteById,
    ...createSuperUser,
    
};
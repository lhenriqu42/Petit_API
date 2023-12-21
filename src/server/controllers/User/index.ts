import * as signIn from './SignIn';
import * as signUp from './SignUp';
import * as createSuperUser from './CreateSuperUser';

export const UserController = {
    ...signIn,
    ...signUp,
    ...createSuperUser,
    
};
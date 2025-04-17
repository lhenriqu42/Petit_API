import * as jwt from 'jsonwebtoken';
import { EUserRole } from '../Auth/EUserRole';

interface IJwtData {
    uid: number;
    role: EUserRole;
}

const sign = (data: IJwtData) => {


    if (!process.env.JWT_KEY) return 'JWT_KEY_NOT_FOUND';


    return jwt.sign(data, process.env.JWT_KEY);
};


const verify = (token: string): IJwtData | 'JWT_KEY_NOT_FOUND' | 'INVALID_TOKEN' => {
    if (!process.env.JWT_KEY) return 'JWT_KEY_NOT_FOUND';
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (typeof decoded === 'string') {
            return 'INVALID_TOKEN';
        }

        return decoded as IJwtData;
    } catch (e) {
        return 'INVALID_TOKEN';
    }
};


export const JWTService = {
    sign,
    verify,

};
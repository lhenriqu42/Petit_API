import { Request, RequestHandler, Response } from 'express';
import { UserProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

export const createSuperUser: RequestHandler = async (req: Request, res: Response) => {
    const result = await UserProvider.createSuperUser();
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
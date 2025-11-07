import { Request, RequestHandler, Response } from 'express';
import { ProdGroupProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

export const getShowGroups: RequestHandler = async (req: Request, res: Response) => {
    const result = await ProdGroupProvider.getShowGroups();

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
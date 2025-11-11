import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FincashProvider } from '../providers';


export const getLastFincash = async (req: Request, res: Response) => {

    const result = await FincashProvider.getLastFincash();

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
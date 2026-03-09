import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FincashProvider } from '../../providers';
import { endOfMonth, startOfMonth } from 'date-fns';

export const getCurrentMonth = async (req: Request, res: Response) => {

    const today = new Date();
    const fday = startOfMonth(today);
    const day = endOfMonth(today);

    const result = await FincashProvider.getDataByDate(fday, day);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ProductProvider } from '../../providers';

export const getSectorStock = async (req: Request, res: Response) => {

    const result = await ProductProvider.getSectorStock();

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
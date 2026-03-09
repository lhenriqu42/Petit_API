import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ProductProvider } from '../../providers';

export const getSectorStockValue = async (req: Request, res: Response) => {

    const result = await ProductProvider.getSectorStockValue();

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { SaleDetailProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import AppError from '../../../server/shared/Errors';

interface IParamProps {
    id?: number,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

export const cancelSaleValidation = validation({
    params: paramsValidation,
});

export const cancelSale = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    try {
        await SaleDetailProvider.cancelSale(req.params.id);
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        const appError = error as AppError;
        return res.status(appError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message || 'Internal server error'
            }
        });
    }
};
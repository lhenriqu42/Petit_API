import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { PurchaseProvider } from '../../database/providers/purchases';
import AppError from '../../shared/Errors';

interface IParamsProps { purchase_id?: number; }


const paramsValidation: yup.Schema<IParamsProps> = yup.object().shape({
    purchase_id: yup.number().integer().positive().required(),
});

export const completePurchaseValidation = validation({
    params: paramsValidation,
});

export const completePurchase: RequestHandler = async (req: Request<IParamsProps, {}, {}>, res: Response) => {
    const { purchase_id } = req.params;
    if (!purchase_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { id: 'ID is required' }
        });
    }
    try {
        const result = await PurchaseProvider.completePurchase(purchase_id);
        return res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
        const appError = error as AppError;
        return res.status(appError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message
            }
        });
    }
};
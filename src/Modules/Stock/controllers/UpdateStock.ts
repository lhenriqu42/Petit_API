import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { StatusCodes } from 'http-status-codes';
import { StockProvider } from '../providers';
import AppError from '../../../server/shared/Errors';

interface IBodyProps {
    quantity: number;
    desc?: string;
}

interface IParamsProps {
    prod_id?: number;
}

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    quantity: yup.number().required().min(0),
    desc: yup.string(),
});

const paramsValidation: yup.Schema<IParamsProps> = yup.object().shape({
    prod_id: yup.number().required().positive(),
});

export const updateValidation = validation({
    body: bodyValidation,
    params: paramsValidation,
});





export const update: RequestHandler = async (req: Request<IParamsProps, {}, IBodyProps>, res: Response) => {
    const { prod_id } = req.params;
    if (!prod_id) return res.status(StatusCodes.BAD_REQUEST).json({
        errors: {
            default: 'Product ID is required'
        }
    });
    try {
        await StockProvider.updateStock(prod_id, req.body.quantity, req.body.desc);
        return res.status(StatusCodes.OK).send();
    } catch (error) {
        const appError = error as AppError;
        return res.status(appError.statusCode).json({
            errors: {
                default: appError.message
            }
        });
    }
};


export const updateTo: RequestHandler = async (req: Request<IParamsProps, {}, IBodyProps>, res: Response) => {
    const { prod_id } = req.params;
    if (!prod_id) return res.status(StatusCodes.BAD_REQUEST).json({
        errors: {
            default: 'Product ID is required'
        }
    });
    try {
        await StockProvider.updateStockRaw(prod_id, req.body.quantity, req.body.desc);
        return res.status(StatusCodes.OK).send();
    } catch (error) {
        const appError = error as AppError;
        return res.status(appError.statusCode).json({
            errors: {
                default: appError.message
            }
        });
    }
};
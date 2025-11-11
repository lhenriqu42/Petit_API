import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { ISaleDetails } from '../../../server/database/models';
import { SaleDetailProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../server/shared/Errors';

interface IBodyProps {
    data: Omit<ISaleDetails, 'id' | 'created_at' | 'updated_at' | 'pricetotal' | 'sale_id'>[];
    obs?: string | null; // Usando union type para representar que pode ser string ou null
}
const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    data: yup.array().of(
        yup.object().shape({
            prod_id: yup.number().positive().required().integer(),
            quantity: yup.number().positive().required().integer(),
            price: yup.number().required().positive(),
        })
    ).required(),
    obs: yup.string().nullable()
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    try {
        const result = await SaleDetailProvider.create(req.body.data, req.body.obs);
        return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        const appError = error as AppError;
        return res.status(appError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message
            }
        });
    }
};
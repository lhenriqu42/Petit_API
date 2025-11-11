import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { IProduct } from '../../../server/database/models';
import { ProductProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

interface IBodyProps extends Omit<IProduct, 'id' | 'created_at' | 'updated_at'> { }

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    code: yup.string().required().min(1).max(20),
    name: yup.string().required().min(3).max(50),
    sector: yup.number().required().min(1).max(4),
    price: yup.number().required().min(0),
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await ProductProvider.create(req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
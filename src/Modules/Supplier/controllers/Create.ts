import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { ISupplier } from '../../../server/database/models';
import { SupplierProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

interface IBodyProps extends Omit<ISupplier, 'id' | 'created_at' | 'updated_at'> { }

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    name: yup.string().required().min(3).max(50),
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await SupplierProvider.create(req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
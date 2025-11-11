import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { IValidity } from '../../../server/database/models';
import { ValidityProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

interface IBodyProps extends Omit<IValidity, 'id' | 'created_at' | 'updated_at'> { }

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    prod_id: yup.number().moreThan(0).required().integer(),
    validity: yup.date().required(),
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await ValidityProvider.create(req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { PackProvider } from '../../database/providers/Packs';

interface IBodyProps { 
    prod_qnt: number;
}

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    prod_qnt: yup.number().required().moreThan(0),
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await PackProvider.create(req.body.prod_qnt);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
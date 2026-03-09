import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { IFincash } from '../../../server/database/models';
import { FincashProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

interface IBodyProps extends Omit<IFincash, 'id' | 'created_at' | 'updated_at' | 'isFinished'> { }

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    opener: yup.string().required().min(3).max(30),
    value: yup.number().required().min(0),
    obs: yup.string().nullable(),

});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await FincashProvider.create(req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
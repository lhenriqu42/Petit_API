import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { NFEmitterProvider } from '../providers';
import { IRequestCreateBody } from '../providers/Create';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../server/shared/Errors';

interface IBodyProps extends IRequestCreateBody { }

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    cnpj: yup.string().required(),
    x_nome: yup.string().required(),
    x_fant: yup.string().required(),
    ie: yup.string(),
    cep: yup.string(),
    uf: yup.string(),
    city: yup.string(),
    district: yup.string(),
    street: yup.string(),
    number: yup.string(),
    complemento: yup.string(),
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    try {
        const emitter = await NFEmitterProvider.create(req.body);
        return res.status(StatusCodes.CREATED).json(emitter);
    } catch (e) {
        const appError = e as AppError;
        return res.status(appError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: appError.message });
    }
};
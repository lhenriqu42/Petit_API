import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { NFEmitterProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../server/shared/Errors';

interface IParamProps {
    cnpj?: string,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    cnpj: yup.string().required(),
});

export const getByCnpjValidation = validation({
    params: paramsValidation,
});

export const getByCnpj: RequestHandler = async (req: Request<IParamProps, {}, {}>, res: Response) => {
    if (!req.params.cnpj) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'cnpj param is required' });

    try {
        const emitter = await NFEmitterProvider.getByCnpj(req.params.cnpj);
        return res.status(emitter ? StatusCodes.OK : StatusCodes.NO_CONTENT).json(emitter);
    } catch (e) {
        const appError = e as AppError;
        return res.status(appError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: appError.message });
    }
};
import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { NFEmitterProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../server/shared/Errors';

interface IBodyProps {
    supplier_id: number,
}

interface IParamProps {
    emitter_id?: number,
}

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    supplier_id: yup.number().required().positive(),
});

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    emitter_id: yup.number().required().positive(),
});

export const linkToSupplierValidation = validation({
    body: bodyValidation,
    params: paramsValidation,
});

export const linkToSupplier: RequestHandler = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.emitter_id) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'emitter_id param is required' });

    try {
        const id = await NFEmitterProvider.linkToSupplier(req.params.emitter_id, req.body.supplier_id);
        return res.status(StatusCodes.CREATED).json({ id });
    } catch (e) {
        const appError = e as AppError;
        return res.status(appError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: appError.message });
    }
};
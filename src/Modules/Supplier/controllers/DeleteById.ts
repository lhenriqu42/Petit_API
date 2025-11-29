import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { SupplierProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import AppError from '../../../server/shared/Errors';

interface IParamProps {
    id?: number,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

export const deleteByIdValidation = validation({
    params: paramsValidation,
});

export const deleteById = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }

    try {
        await SupplierProvider.deleteById(req.params.id);
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (e) {
        const appError = e as AppError;
        return res.status(appError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: appError.message });
    }

};
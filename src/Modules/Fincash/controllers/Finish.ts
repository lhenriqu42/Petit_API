import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { FincashProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import AppError from '../../../server/shared/Errors';

interface IParamProps {
    id?: number,
}

interface IBodyProps {
    finalValue: number,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    finalValue: yup.number().required()
});

export const finishValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
});

export const finish = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }

    try {
        await FincashProvider.finish(req.params.id, req.body.finalValue);
        return res.status(StatusCodes.OK).send();
    } catch (e) {
        const AppError = e as AppError;
        return res.status(AppError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: AppError.message
            }
        });
    }
};
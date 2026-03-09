import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { FincashProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import AppError from '../../../server/shared/Errors';

interface IParamProps {
    fincash_id?: number,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    fincash_id: yup.number().integer().required().moreThan(0),
});

export const reOpenFincashValidation = validation({
    params: paramsValidation,
});

export const reOpenFincash = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.fincash_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"fincash_id" not found'
            }
        });
    }
    try {
        await FincashProvider.reOpenFincash(req.params.fincash_id);
        return res.status(StatusCodes.OK).send();
    } catch (error) {
        const appError = error as AppError;
        return res.status(appError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message
            }
        });
    }
};
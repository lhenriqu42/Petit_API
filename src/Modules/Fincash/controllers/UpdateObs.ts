import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../../server/shared/middleware';
import { FincashProvider } from '../providers';

interface IParamProps {
    id?: number,
}

interface IBodyProps {
    obs: string
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    obs: yup.string().required(),
});

export const updateObsValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
});

export const updateObs = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    const result = await FincashProvider.updateObs(req.params.id, req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);
};
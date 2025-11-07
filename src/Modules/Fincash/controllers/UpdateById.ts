import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { FincashProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';

interface IParamProps {
    id?: number,
}

interface IBodyProps {
    opener: string,
    value: number,
    finalValue: number,
    cardValue: number,
    obs?: string
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    opener: yup.string().required().max(100),
    value: yup.number().required(),
    finalValue: yup.number().required(),
    cardValue: yup.number().required(),
    obs: yup.string().max(200)
});

export const updateByIdValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
});

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    const result = await FincashProvider.updateById(req.params.id, req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);
};
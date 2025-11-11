import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { FincashProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';

interface IParamProps {
    id?: number,
}

interface IBodyProps {
    cardValue: number,
}

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    cardValue: yup.number().required(),
});

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

export const calcBreakValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
});

export const calcBreak = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    const result = await FincashProvider.calcBreak(req.body.cardValue, req.params.id);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
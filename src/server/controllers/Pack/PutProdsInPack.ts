import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { PackProvider } from '../../database/providers/Packs';
import { IRequestBody } from '../../database/providers/Packs/PutProdsInPack';

interface IBodyProps extends Omit<IRequestBody, 'pack_id'> { }

interface IParamProps {
    packId?: number,
}

const paramValidation: yup.Schema<IParamProps> = yup.object().shape({
    packId: yup.number().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    prods: yup.array().of(yup.number().required().moreThan(0)).required(),
});

export const putProdsInPackValidation = validation({
    body: bodyValidation,
    params: paramValidation
});

export const putProdsInPack: RequestHandler = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.packId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Pack id is required'
            }
        });
    }
    const result = await PackProvider.putProdsInPack({ prods: req.body.prods, pack_id: req.params.packId });
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
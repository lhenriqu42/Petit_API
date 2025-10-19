import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { PackProvider } from '../../database/providers/Packs';
import { IRequestBody } from '../../database/providers/Packs/PutPacksInProd';

interface IBodyProps extends Omit<IRequestBody, 'prod_id'> { }

interface IParamProps {
    prodId?: number,
}

const paramValidation: yup.Schema<IParamProps> = yup.object().shape({
    prodId: yup.number().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    packs: yup.array().of(yup.number().required().moreThan(0)).required(),
});

export const putPacksInProdValidation = validation({
    body: bodyValidation,
    params: paramValidation
});

export const putPacksInProd: RequestHandler = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.prodId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Product id is required'
            }
        });
    }
    const result = await PackProvider.putPacksInProd({ packs: req.body.packs, prod_id: req.params.prodId });
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
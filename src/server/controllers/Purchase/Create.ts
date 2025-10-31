import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { PurchaseProvider } from '../../database/providers/purchases';
import { IRequestBody } from '../../database/providers/purchases/Create';
import { EPurchaseType } from '../../database/models';

interface IBodyProps extends IRequestBody { }

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    supplier_id: yup.number().positive().required().integer(),
    purchases: yup.array().of(
        yup.object().shape({
            type: yup.mixed<EPurchaseType>().required().oneOf(Object.values(EPurchaseType)),
            prod_id: yup.number().positive().required().integer(),
            pack_id: yup.number().nullable().default(null).when('type', {
                is: EPurchaseType.PACK,
                then: () => yup.number().positive().required().integer(),
                otherwise: () =>  yup.number().nullable().oneOf([null])
            }),
            quantity: yup.number().positive().required().integer(),
            price: yup.number().positive().required()
        })
    ).required()
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await PurchaseProvider.create(req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
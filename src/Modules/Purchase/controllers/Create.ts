import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { PurchaseProvider } from '../../../Modules/Purchase/providers';
import { IRequestBody } from '../../../Modules/Purchase/providers/Create';
import { EPurchaseType } from '../../../server/database/models';
import AppError from '../../../server/shared/Errors';

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
                otherwise: () => yup.number().nullable().oneOf([null])
            }),
            quantity: yup.number().positive().required().integer(),
            price: yup.number().min(0).required()
        })
    ).required()
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    try {
        const result = await PurchaseProvider.create(req.body);
        return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        const appError = error as AppError;
        return res.status(appError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message
            }
        });
    }
};
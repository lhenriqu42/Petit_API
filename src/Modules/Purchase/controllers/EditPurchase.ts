import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { PurchaseProvider } from '../../../Modules/Purchase/providers';
import { IRequestBody } from '../../../Modules/Purchase/providers/Create';
import { EPurchaseType } from '../../../server/database/models';
import AppError from '../../../server/shared/Errors';

interface IBodyProps extends IRequestBody { }
interface IParamsProps { purchase_id?: number; }

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
const paramsValidation: yup.Schema<IParamsProps> = yup.object().shape({
    purchase_id: yup.number().integer().positive().required(),
});

export const editPurchaseValidation = validation({
    body: bodyValidation,
    params: paramsValidation,
});

export const editPurchase: RequestHandler = async (req: Request<IParamsProps, {}, IBodyProps>, res: Response) => {
    const { purchase_id } = req.params;
    if (!purchase_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { id: 'ID is required' }
        });
    }
    try {
        const result = await PurchaseProvider.editPurchase(purchase_id, req.body);
        return res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
        const appError = error as AppError;
        return res.status(appError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message
            }
        });
    }
};
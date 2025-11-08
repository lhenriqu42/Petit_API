import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { PurchaseProvider } from '../../../Modules/Purchase/providers';
import { StatusCodes } from 'http-status-codes';

interface IParamsProps {
    purchase_id?: number,
}


const paramsValidation: yup.Schema<IParamsProps> = yup.object().shape({
    purchase_id: yup.number().integer().positive().required(),
});


export const getPurchaseDetailsValidation = validation({
    params: paramsValidation,
});

export const getPurchaseDetails: RequestHandler = async (req: Request<IParamsProps, {}, {}, {}>, res: Response) => {
    const { purchase_id } = req.params;
    if (!purchase_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { id: 'ID is required' }
        });
    }
    const result = await PurchaseProvider.getPurchaseDetails(purchase_id);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result.purchase);
};
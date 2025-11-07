import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { PurchaseProvider } from '../../../Modules/Purchase/providers';
import { StatusCodes } from 'http-status-codes';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

interface IParamsProps {
    purchase_id?: number,
}

interface IQueryProps {
    page?: number,
    limit?: number,
}

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
});
const paramsValidation: yup.Schema<IParamsProps> = yup.object().shape({
    purchase_id: yup.number().integer().positive().required(),
});


export const getPurchaseDetailsValidation = validation({
    query: queryValidation,
    params: paramsValidation,
});

export const getPurchaseDetails: RequestHandler = async (req: Request<IParamsProps, {}, {}, IQueryProps>, res: Response) => {
    const { purchase_id } = req.params;
    if (!purchase_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { id: 'ID is required' }
        });
    }
    const result = await PurchaseProvider.getPurchaseDetails(purchase_id, req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', result.purchase.details.total_count);

    return res.status(StatusCodes.OK).json(result.purchase);
};
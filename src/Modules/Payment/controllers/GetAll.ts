import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { PaymentProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';
import { OrderByObj } from '../providers/GetAll';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

interface IQueryProps {
    page?: number,
    limit?: number,
}

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
});


const bodyValidation: yup.Schema<OrderByObj> = yup.object().shape({
    column: yup.string().oneOf(['expiration', 'created_at']).required(),
    order: yup.string().oneOf(['asc', 'desc']).required(),
    supplier_id: yup.number(),
    show: yup.object().shape({
        PAID: yup.boolean(),
        EXPIRED: yup.boolean(),
    }),
});

export const getAllValidation = validation({
    query: queryValidation,
    body: bodyValidation,
});

export const getAll: RequestHandler = async (req: Request<{}, {}, OrderByObj, IQueryProps>, res: Response) => {
    const result = await PaymentProvider.getAll(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT, req.body);
    const count = await PaymentProvider.count(req.body);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    } else if (count instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: count.message
            }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};
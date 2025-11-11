import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { SupplierProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;
const DEFAULT_FILTER = '';

interface IQueryProps {
    page?: number,
    limit?: number,
    filter?: string,
}

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
    filter: yup.string(),
});

export const getAllValidation = validation({
    query: queryValidation,
});

export const getAll: RequestHandler = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const result = await SupplierProvider.getAll(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT, req.query.filter || DEFAULT_FILTER);
    const count = await SupplierProvider.count(req.query.filter);

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
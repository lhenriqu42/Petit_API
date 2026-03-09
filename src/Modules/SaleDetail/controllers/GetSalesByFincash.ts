import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { SaleDetailProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

interface IQueryProps {
    page?: number,
    limit?: number,
}

interface IParamProps {
    id?: number;
}

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
});

const paramValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().moreThan(0).required().integer(),
});

export const getSalesByFincashValidation = validation({
    query: queryValidation,
    params: paramValidation,
});

export const getSalesByFincash: RequestHandler = async (req: Request<IParamProps, {}, {}, IQueryProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }

    const result = await SaleDetailProvider.getSalesByFincash(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT, req.params.id);
    const count = await SaleDetailProvider.countSalesByFincash(req.params.id);

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
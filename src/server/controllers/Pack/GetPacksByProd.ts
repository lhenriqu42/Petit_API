import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { PackProvider } from '../../database/providers/Packs';
import { StatusCodes } from 'http-status-codes';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

interface IParamProps {
    prodId?: number,
}

interface IQueryProps {
    page?: number,
    limit?: number,
}

const paramValidation: yup.Schema<IParamProps> = yup.object().shape({
    prodId: yup.number().required().moreThan(0),
});

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
});

export const getPacksByProdValidation = validation({
    query: queryValidation,
    params: paramValidation
});

export const getPacksByProd: RequestHandler = async (req: Request<IParamProps, {}, {}, IQueryProps>, res: Response) => {
    if (!req.params.prodId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Product id is required'
            }
        });
    }

    const result = await PackProvider.getPacksByProd(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT, req.params.prodId);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', result.totalCount);

    return res.status(StatusCodes.OK).json(result.packs);
};
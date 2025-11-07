import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { ProdGroupProvider } from '../providers';
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

interface IParamProps {
    id?: number,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
    filter: yup.string(),

});

export const getProductsByIdValidation = validation({
    query: queryValidation,
    params: paramsValidation,

});

export const getProductsById: RequestHandler = async (req: Request<IParamProps, {}, {}, IQueryProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }

    const result = await ProdGroupProvider.getProductsById(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT, req.query.filter || DEFAULT_FILTER, req.params.id);
    const count = await ProdGroupProvider.countProd(req.params.id, req.query.filter || DEFAULT_FILTER);

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
import * as yup from 'yup';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { validation } from '../../../../server/shared/middleware';
import { FincashProvider } from '../../providers';
import { EColumnsOrderBy, OrderByObj } from '../../providers/querry/GetDataById';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;
const DEFAULT_FILTER = '';

interface IParamProps {
    id?: number,
}

interface IQueryProps {
    page?: number,
    limit?: number,
    filter?: string,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<OrderByObj> = yup.object().shape({
    column: yup.string().oneOf(Object.values(EColumnsOrderBy)).required(),
    order: yup.string().oneOf(['asc', 'desc']).required(),
    sectors: yup.array().of(yup.number().required()).required(),
});

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
    filter: yup.string(),
});

export const getDataByIdValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
    query: queryValidation,
});

export const getDataById = async (req: Request<IParamProps, {}, OrderByObj, IQueryProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }


    const result = await FincashProvider.getDataById(
        req.params.id,
        req.body,
        req.query.page || DEFAULT_PAGE,
        req.query.limit || DEFAULT_LIMIT,
        req.query.filter || DEFAULT_FILTER,
    );

    const count = await FincashProvider.countData(req.params.id, req.query.filter || DEFAULT_FILTER, req.body.sectors, req.body.group_id);
    
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
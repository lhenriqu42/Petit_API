import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { PackProvider } from '../../database/providers/Packs';
import { StatusCodes } from 'http-status-codes';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

interface IParamProps {
    packId?: number,
}

interface IQueryProps {
    page?: number,
    limit?: number,
    prodName?: string,
}

const paramValidation: yup.Schema<IParamProps> = yup.object().shape({
    packId: yup.number().required().moreThan(0),
});

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
    prodName: yup.string(),
});

export const getProdsByPackValidation = validation({
    query: queryValidation,
    params: paramValidation
});

export const getProdsByPack: RequestHandler = async (req: Request<IParamProps, {}, {}, IQueryProps>, res: Response) => {
    if (!req.params.packId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Pack id is required'
            }
        });
    }

    const result = await PackProvider.getProdsByPack(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT, req.params.packId, req.query.prodName);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', result.totalCount);

    return res.status(StatusCodes.OK).json(result.products);
};
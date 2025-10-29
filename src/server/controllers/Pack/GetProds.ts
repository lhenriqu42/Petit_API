import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { PackProvider } from '../../database/providers/Packs';
import { StatusCodes } from 'http-status-codes';

// ENV
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 7;

interface IQueryProps {
    page?: number,
    limit?: number,
    excludePackId?: number,
    prodName?: string
}

const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
    excludePackId: yup.number().moreThan(0),
    prodName: yup.string().max(100),
});

export const getProdsValidation = validation({
    query: queryValidation,
});

export const getProds: RequestHandler = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {

    const result = await PackProvider.getProds(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT, {
        excludePackId: req.query.excludePackId,
        name: req.query.prodName
    });

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
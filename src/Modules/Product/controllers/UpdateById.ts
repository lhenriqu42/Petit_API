import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ProductProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import { IProduct } from '../../../server/database/models';

interface IParamProps {
    id?: number,
}

interface IBodyProps extends Omit<IProduct, 'id' | 'created_at' | 'updated_at' | 'code'> { }

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    name: yup.string().required().min(3).max(50),
    sector: yup.number().required().min(1).max(4),
    price: yup.number().required().min(0),
});

export const updateByIdValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
});

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    const result = await ProductProvider.updateById(req.params.id, req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);
};
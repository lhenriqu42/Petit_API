import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { SaleDetailProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import { ISale } from '../../../server/database/models';

interface IParamProps {
    id?: number,
}

interface IBodyProps extends Omit<ISale, 'id' | 'created_at' | 'updated_at' | 'fincash_id'> { }

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    obs: yup.string().required()
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
    const result = await SaleDetailProvider.updateById(req.params.id, req.body);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);
};
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { SaleDetailProvider } from '../../database/providers/SaleDetail';
import { validation } from '../../shared/middleware';

interface IParamProps {
    id?: number,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

export const getByIdValidation = validation({
    params: paramsValidation,
});

export const getById = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    const result = await SaleDetailProvider.getById(req.params.id);
    if (result instanceof Error) {
        console.log('inner controller: ');
        console.log(result);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
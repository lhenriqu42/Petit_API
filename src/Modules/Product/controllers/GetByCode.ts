import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ProductProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';

interface IParamProps {
    code?: string,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    code: yup.string().required().max(50),
});

export const getByCodeValidation = validation({
    params: paramsValidation,
});

export const getByCode = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.code) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    const result = await ProductProvider.getByCode(req.params.code);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};
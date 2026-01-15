import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ProductProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import AppError from '../../../server/shared/Errors';
import { IUpdateBody } from '../providers/UpdateById';

interface IParamProps {
    id?: number,
}

interface IBodyProps extends IUpdateBody { }

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    prod: yup.object().shape({
        name: yup.string().min(3).max(255).required(),
        sector: yup.number().integer().moreThan(0).required(),
        price: yup.number().min(0).required(),
    }),
    prod_costs: yup.object().shape({
        avg_cost: yup.number().min(0).required(),
        last_cost: yup.number().min(0).required(),
    }),
});

export const updateByIdValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
});

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    try {
        await ProductProvider.updateById(req.params.id!, req.body);
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        const appError = error as AppError;
        return res.status(appError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message
            }
        });
    }
};
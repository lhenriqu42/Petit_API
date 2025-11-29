import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { SupplierProdMapProvider } from '../providers';
import { IRequestCreateBody } from '../providers/Create';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../server/shared/Errors';

interface IBodyProps extends IRequestCreateBody { }

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    supplier_id: yup.number().positive().required().integer(),
    prod_id: yup.number().positive().required().integer(),
    pack_id: yup.number().positive().optional().integer(),
    supplier_prod_id: yup.string().required(),
    supplier_prod_code: yup.string().required(),
    supplier_prod_name: yup.string().required(),
});

export const createValidation = validation({
    body: bodyValidation,
});

export const create: RequestHandler = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    try {
        const obj = await SupplierProdMapProvider.create(req.body);
        return res.status(StatusCodes.CREATED).json(obj);
    } catch (e) {
        const appError = e as AppError;
        return res.status(appError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: appError.message });
    }
};
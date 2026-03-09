import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { SupplierProdMapProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../server/shared/Errors';

interface IParamProps {
    supplier_id?: number,
    supplier_prod_id?: string,
}

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    supplier_id: yup.number().required().positive(),
    supplier_prod_id: yup.string().required(),
});

export const getMapValidation = validation({
    params: paramsValidation,
});

export const getMap: RequestHandler = async (req: Request<IParamProps, {}, {}>, res: Response) => {
    if (!req.params.supplier_id) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'supplier_id param is required' });
    if (!req.params.supplier_prod_id) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'supplier_prod_id param is required' });

    try {
        const map = await SupplierProdMapProvider.getMap(req.params.supplier_id, req.params.supplier_prod_id);
        return res.status(map ? StatusCodes.OK : StatusCodes.NO_CONTENT).json(map);
    } catch (e) {
        const appError = e as AppError;
        return res.status(appError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: appError.message });
    }
};
import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';
import { IProduct_group } from '../../../server/database/models';
import { ProdGroupProvider } from '../providers';
import { StatusCodes } from 'http-status-codes';

interface IParamProps {
    id?: number,
}

interface IBodyProps extends Omit<IProduct_group, 'id' | 'group_id' | 'created_at'> { }

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0)
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    prod_id: yup.number().moreThan(0).required().integer()
});

export const putProdInGroupValidation = validation({
    body: bodyValidation,
    params: paramsValidation,
});

export const putProdInGroup: RequestHandler = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    
    const result = await ProdGroupProvider.putProdInGroup(req.body.prod_id, req.params.id);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
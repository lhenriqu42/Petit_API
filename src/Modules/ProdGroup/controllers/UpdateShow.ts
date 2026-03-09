import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ProdGroupProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import { IGroup } from '../../../server/database/models';

interface IParamProps {
    id?: number,
}

interface IBodyProps extends Omit<IGroup, 'id' | 'name'> { }

const paramsValidation: yup.Schema<IParamProps> = yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
});

const bodyValidation: yup.Schema<IBodyProps> = yup.object().shape({
    show: yup.boolean().required(),
});

export const updateShowValidation = validation({
    params: paramsValidation,
    body: bodyValidation,
});

export const updateShow = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: '"id" not found'
            }
        });
    }
    const result = await ProdGroupProvider.updateShow(req.params.id, req.body.show);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);
};
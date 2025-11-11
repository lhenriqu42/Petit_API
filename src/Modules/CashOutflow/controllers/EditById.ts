import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { CashOutflowProvider } from '../providers';
import { validation } from '../../../server/shared/middleware';
import { TEditBodyProps } from './types';

const typeValidation = yup.object().shape({
    type: yup.mixed().oneOf(['add', 'update', 'delete']).required()
});

const bodyValidation = yup.object().shape({
    type: yup.string().required().min(1).max(15),
    value: yup.number().required(),
    desc: yup.string().nullable().max(200),
    supplier_id: yup.number().nullable().moreThan(0)
});

const addContent = yup.object().shape({
    fincash_id: yup.number().integer().required().moreThan(0),
    body: bodyValidation,
});

const updateContent = yup.object().shape({
    outflow_id: yup.number().integer().required().moreThan(0),
    body: bodyValidation,
});

const deleteContent = yup.object().shape({
    outflow_id: yup.number().integer().required().moreThan(0),
});

const validateContent = (type: 'add' | 'delete' | 'update', content: unknown): Record<string, string> /*ERRORS*/ | undefined => {
    const errors: Record<string, string> = {};

    try {
        if (type === 'add') {
            addContent.validateSync(content, { abortEarly: false });
        } else if (type === 'update') {
            updateContent.validateSync(content, { abortEarly: false });
        } else if (type === 'delete') {
            deleteContent.validateSync(content, { abortEarly: false });
        }
    } catch (e) {
        const ye = e as yup.ValidationError;
        ye.inner.forEach(e => {

            if (!e.path) return;

            errors[e.path] = e.message;
        });
        return errors;
    }
    return undefined;
};

export const editByIdValidation = validation({
    body: typeValidation,
});

export const editById: RequestHandler = async (req, res) => {

    const { type, content } = req.body as TEditBodyProps;
    const contentErrors: Record<string, string> | undefined = validateContent(type, content);
    if (contentErrors) return res.status(StatusCodes.BAD_REQUEST).json({ content: contentErrors });

    let result;
    if (!contentErrors) {
        if (type === 'delete') {
            result = await CashOutflowProvider.EditById.hardDelete(content.outflow_id);
        } else if (type === 'add') {
            result = await CashOutflowProvider.EditById.add(content.fincash_id, content.body);
        } else if (type === 'update') {
            result = await CashOutflowProvider.EditById.update(content.outflow_id, content.body);
        }
    }
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.ACCEPTED).json(result);
};
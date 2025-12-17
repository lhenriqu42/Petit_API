import { Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { validation } from '../../../server/shared/middleware';

import { StatusCodes } from 'http-status-codes';
import { ReportProvider } from '../providers';
import AppError from '../../../server/shared/Errors';

interface IQueryProps {
    start?: Date;
    end?: Date;
}


const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
    start: yup.date().required(),
    end: yup.date().required(),
});

export const getReportDataValidation = validation({
    query: queryValidation,
});

export const getReportData: RequestHandler = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    if (!req.query.start || !req.query.end) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Start and end dates are required'
            }
        });
    }
    try {
        const result = await ReportProvider.getReportData({start: req.query.start, end: req.query.end});
        return res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
        const appError = error as AppError;
        return res.status(appError.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: appError.message
            }
        });
    }
};
// import { Request, RequestHandler, Response } from 'express';
// import * as yup from 'yup';
// import { validation } from '../../shared/middleware';
// import { PurchaseProvider } from '../../database/providers/purchases';
// import { StatusCodes } from 'http-status-codes';

// // ENV
// const DEFAULT_PAGE = 1;
// const DEFAULT_LIMIT = 7;

// interface IQueryProps {
//     page?: number,
//     limit?: number,
// }

// const queryValidation: yup.Schema<IQueryProps> = yup.object().shape({
//     page: yup.number().moreThan(0),
//     limit: yup.number().moreThan(0),
// });

// export const getPurchasesValidation = validation({
//     query: queryValidation,
// });

// export const getPurchases: RequestHandler = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {

//     const result = await PurchaseProvider.getPurchases(req.query.page || DEFAULT_PAGE, req.query.limit || DEFAULT_LIMIT);

//     if (result instanceof Error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             errors: {
//                 default: result.message
//             }
//         });
//     }

//     res.setHeader('access-control-expose-headers', 'x-total-count');
//     res.setHeader('x-total-count', result.totalCount);

//     return res.status(StatusCodes.OK).json(result.purchases);
// };
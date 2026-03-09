import * as create from './Create';
import * as getAll from './GetAll';
import * as getById from './GetById';
import * as deleteById from './DeleteById';
import * as markWithPaid from './MarkWithPaid';
import * as getTotalByDate from './GetTotalByDate';

export const PaymentController = {
    ...create,
    ...getAll,
    ...getById,
    ...deleteById,
    ...markWithPaid,
    ...getTotalByDate,
};
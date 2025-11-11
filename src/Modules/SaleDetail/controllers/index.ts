import * as create from './Create';
import * as getAll from './GetAll';
import * as getById from './GetById';
import * as getSales from './GetSales';
import * as updateById from './UpdateById';
import * as getAllById from './GetAllById';
import * as cancelSale from './CancelSale';
import * as getAllByFincash from './GetAllByFincash';
import * as getSalesByFincash from './GetSalesByFincash';
// import * as deleteById from './DeleteById';

export const SaleDetailController = {
    ...create,
    ...getAll,
    ...getById,
    ...getSales,
    ...updateById,
    ...cancelSale,
    ...getAllById,
    ...getAllByFincash,
    ...getSalesByFincash,
    // ...deleteById,

};
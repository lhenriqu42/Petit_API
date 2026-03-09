import * as count from './Count';
import * as create from './Create';
import * as getAll from './GetAll';
import * as getById from './GetById';
import * as getSales from './GetSales';
import * as countSales from './CountSales';
import * as getAllById from './GetAllById';
import * as updateById from './UpdateById';
import * as cancelSale from './CancelSale';
import * as getAllByFincash from './GetAllByFincash';
import * as countSaleDetails from './CountSaleDetails';
import * as getSalesByFincash from './GetSalesByFincash';

// import * as countAllByFincash from './CountAllByFincash';
// import * as deleteById from './DeleteById';

export const SaleDetailProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...getSales,
    ...countSales,
    ...getAllById,
    ...updateById,
    ...cancelSale,
    ...getAllByFincash,
    ...countSaleDetails,
    ...getSalesByFincash,

    // ...countAllByFincash,
    // ...deleteById,
};
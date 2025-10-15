import * as create from './Create';
import * as getPurchases from './GetPurchases';

export const PurchaseController = {
    ...create,
    ...getPurchases
};
import * as create from './Create';
import * as getPurchases from './GetPurchases';
import * as editPurchase from './EditPurchase';
import * as completePurchase from './CompletePurchase';

export const PurchaseController = {
    ...create,
    ...getPurchases,
    ...editPurchase,
    ...completePurchase
};
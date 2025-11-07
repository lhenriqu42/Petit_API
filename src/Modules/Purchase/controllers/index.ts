import * as create from './Create';
import * as getPurchases from './GetPurchases';
import * as editPurchase from './EditPurchase';
import * as completePurchase from './CompletePurchase';
import * as getPurchaseDetails from './GetPurchseDetails';

export const PurchaseController = {
    ...create,
    ...getPurchases,
    ...editPurchase,
    ...completePurchase,
    ...getPurchaseDetails
};
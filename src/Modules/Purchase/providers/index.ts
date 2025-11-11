import * as create from './Create';
import * as deleteById from './DeleteById';
import * as getPurchases from './GetPurchases';
import * as editPurchase from './EditPurchase';
import * as completePurchase from './CompletePurchase';
import * as GetPurchseDetails from './GetPurchseDetails';

export const PurchaseProvider = {
    ...create,
    ...deleteById,
    ...getPurchases,
    ...editPurchase,
    ...completePurchase,
    ...GetPurchseDetails,
};
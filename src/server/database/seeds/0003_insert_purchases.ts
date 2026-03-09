import { ETableNames } from '../ETableNames';
import { Knex } from '../knex';
import { Products } from '@/../../AllProducts.json';
import { EPurchaseType, IPurchaseDetails, IPurchases } from '../models';
import { randNumberRange } from '../../shared/services';

export const seed = async () => {
    const numOfPurchases = 200;
    const prodInterval = Math.floor(Products.length / numOfPurchases);
    const purchasesToInsert: Omit<IPurchases, 'id' | 'created_at'>[] = [];
    const purchaseDetailsToInsert: Omit<IPurchaseDetails, 'id' | 'created_at'>[] = [];
    for (let i = 0; i < numOfPurchases; i++) {
        const purchaseId = i + 1;
        purchasesToInsert.push({
            supplier_id: Math.floor(Math.random() * 10) + 1,
            total_value: 0,
            effected: true,
            updated_at: new Date(),
        });
        const numOfDetails = Math.floor(Math.random() * 10) + 1;
        for (let j = 0; j < numOfDetails; j++) {
            const prodIndex = (i * prodInterval + j) % Products.length;
            const quantity = Math.floor(Math.random() * 10) + 1;
            const price = parseFloat(Products[prodIndex].price);
            const cost = price / randNumberRange(1.5, 3);
            purchaseDetailsToInsert.push({
                purchase_id: purchaseId,
                type: EPurchaseType.PRODUCT,
                prod_id: Number(Products[prodIndex].id),
                pack_id: null,
                pack_deleted_qnt: null,
                quantity: quantity,
                price: cost,
                pricetotal: cost * quantity,
                updated_at: new Date(),
            });
        }
    }
    await Knex(ETableNames.purchases).insert(purchasesToInsert);
    await Knex(ETableNames.purchase_details).insert(purchaseDetailsToInsert);
};

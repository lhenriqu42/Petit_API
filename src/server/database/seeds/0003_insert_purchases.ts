import { ETableNames } from '../ETableNames';
import { Knex } from '../knex';
import { Products } from '@/../../AllProducts.json';
import { EPurchaseType, IPurchaseDetails, IPurchases } from '../models';

export const seed = async () => {
    const numOfPurchases = 30;
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
        const numOfDetails = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < numOfDetails; j++) {
            const prodIndex = (i * prodInterval + j) % Products.length;
            const quantity = Math.floor(Math.random() * 10) + 1;
            const price = parseFloat(Products[prodIndex].price);
            purchaseDetailsToInsert.push({
                purchase_id: purchaseId,
                type: EPurchaseType.PRODUCT,
                prod_id: Number(Products[prodIndex].id),
                pack_id: null,
                pack_deleted_qnt: null,
                quantity: quantity,
                price: price,
                pricetotal: price * quantity,
                updated_at: new Date(),
            });
        }
    }
    await Knex(ETableNames.purchases).insert(purchasesToInsert);
    await Knex(ETableNames.purchase_details).insert(purchaseDetailsToInsert);
};

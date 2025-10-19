// import { ETableNames } from '../../ETableNames';
// import { Knex } from '../../knex';

// export interface IRequestBody {
//     supplier_id: number;
//     prods: { prod_id: number, quantity: number, price: number }[];
// }

// export const create = async (request: IRequestBody): Promise<number | Error> => {
//     try {
//         const productIds = request.prods.map(detail => Number(detail.prod_id));
//         if (productIds.length === 0) return new Error('No products provided');
        
//         const productsExist = await Knex(ETableNames.products)
//             .whereIn('id', productIds)
//             .select('id')
//             .catch(() => []);

//         if (productsExist.length !== productIds.length)
//             return new Error('One or more products not found, check the product IDs');

//         const purchase = await Knex(ETableNames.purchases).insert({ supplier_id: request.supplier_id }).returning('id');
//         if (purchase) {
//             const resultPromises = request.prods.map(async (element) => {
//                 const [purchaseDetailId] = await Knex(ETableNames.purchase_details)
//                     .insert({ ...element, purchase_id: purchase[0].id, pricetotal: (element.price * element.quantity) })
//                     .returning('id');

//                 return purchaseDetailId;
//             });

//             const purchaseDetailIds = await Promise.all(resultPromises);

//             const total_value = request.prods.reduce((acc, item) => acc + (item.price * item.quantity), 0);

//             await Knex(ETableNames.purchases).update({ total_value }).where('id', purchase[0].id);

//             return purchaseDetailIds.length;
//         } else {
//             return new Error('Purchase registration Failed');
//         }
//     } catch (e) {
//         console.log(e);
//         return new Error('Register Failed');
//     }
// };
// import { ETableNames } from '../ETableNames';
// import { IProduct } from '../models';
// import { randString, randNumber } from '../../shared/services';
// import { Knex } from '../knex';

// const NumberOfInsertions = 500;

// const productCode: string[] = [];
// const productName: string[] = [];
// const productSector: number[] = [];
// const productPrice: number[] = [];

// for (let i = 0; i < NumberOfInsertions; i++) {
//     productCode.push(randNumber(10).toString());
//     productName.push(randString(10));
//     productSector.push(Math.floor(Math.random() * 4) + 1);
//     productPrice.push(randNumber(3) / 100);
// }

// const generateRandomTimestamp = () => {
//     const now = new Date().getTime();
//     const randomOffset = Math.floor(Math.random() * 1000 * 60 * 60 * 24); // Random offset within 24 hours
//     return new Date(now + randomOffset);
// };

// export const seed = async () => {
//     // const [{ count }] = await Knex(ETableNames.products).count<[{ count: number }]>('* as count');

//     // if (!Number.isInteger(count) || count > 0) return;

//     const productsToInsert: Omit<IProduct, 'id' | 'created_at'>[] = [];

//     for (let i = 0; i < NumberOfInsertions; i++) {
//         const updatedAt = generateRandomTimestamp();
//         productsToInsert.push({
//             code: productCode[i],
//             name: productName[i],
//             sector: productSector[i],
//             price: productPrice[i],
//             updated_at: updatedAt,

//         });
//     }
//     await Knex(ETableNames.products).insert(productsToInsert);
// };

import { ETableNames } from '../ETableNames';
import { IProduct } from '../models';
import { Knex } from '../knex';

import { Products } from '@/../../AllProducts.json';

export const seed = async () => {
    // const [{ count }] = await Knex(ETableNames.products).count<[{ count: number }]>('* as count');
    // if (!Number.isInteger(count) || count > 0) return;

    const productsToInsert: Omit<IProduct, 'id' | 'created_at'>[] = Products.map(product => ({
        id: Number(product.id),
        code: product.code,
        name: product.name,
        sector: product.sector,
        price: parseFloat(product.price), // Convert string to number
        updated_at: new Date(product.updated_at), // Convert string to Date
    }));

    await Knex(ETableNames.products).insert(productsToInsert);
};

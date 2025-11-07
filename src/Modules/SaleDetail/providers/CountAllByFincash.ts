// import { ETableNames } from '../../../server/database/ETableNames';
// import { Knex } from '../../../server/database/knex';

// export const countAllByFincash = async (fincash_id: number): Promise<number | Error> => {
//     try {
//         const [{ count }] = await Knex(ETableNames.sales)
//             .join(ETableNames.saleDetails, `${ETableNames.sales}.id`, `${ETableNames.saleDetails}.sale_id`)
//             .join(ETableNames.products, `${ETableNames.products}.id`, `${ETableNames.saleDetails}.prod_id`)
//             .where(`${ETableNames.sales}.fincash_id`, fincash_id)
//             .groupBy(`${ETableNames.sales}.id`)
//             .groupBy(`${ETableNames.sales}.id`)
//             .count<[{ count: number }]>('* as count');
//         if (Number.isInteger(Number(count))) return Number(count);

//         return new Error('Count Failed');
//     } catch (e) {
//         console.log(e);
//         return new Error('Count Failed');
//     }
// };
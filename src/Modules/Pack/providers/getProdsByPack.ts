import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';

interface IResponse {
    totalCount: number,
    products: IProduct[]
}

const count = async (productIds: number[], prodName: string): Promise<number> => {
    const result = await Knex(ETableNames.products)
        .whereIn('id', productIds)
        .andWhere('name', 'ilike', `%${prodName}%`)
        .count<{ count: string }[]>('* as count');

    return Number(result[0]?.count ?? 0);
};

export const getProdsByPack = async (page: number, limit: number, packId: number, prodName: string = ''): Promise<IResponse | Error> => {
    try {

        const productIds: number[] = await Knex(ETableNames.prod_packs)
            .select('prod_id')
            .where('pack_id', packId)
            .then(rows => rows.map(row => row.prod_id));
        if (productIds.length === 0) {
            return { totalCount: 0, products: [] };
        }
        const prods = await Knex<IProduct>(ETableNames.products)
            .select('*')
            .whereIn('id', productIds)
            .andWhere('name', 'ilike', `%${prodName}%`)
            .orderBy('id', 'desc')
            .offset((page - 1) * limit)
            .limit(limit);
        const total = await count(productIds, prodName);
        return { totalCount: total, products: prods };
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

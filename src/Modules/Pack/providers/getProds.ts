import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';

interface IResponse {
    totalCount: number,
    products: IProduct[]
}

interface IFilter {
    excludePackId?: number;
    name?: string;
}


const count = async (filter?: IFilter): Promise<number> => {
    const query = Knex(ETableNames.products).count<[{ count: number }]>('* as count');
    if (filter?.excludePackId) {
        query.whereNotExists(function () {
            this.select('*')
                .from(ETableNames.prod_packs)
                .whereRaw(`${ETableNames.prod_packs}.prod_id = ${ETableNames.products}.id`)
                .andWhere(`${ETableNames.prod_packs}.pack_id`, filter.excludePackId!);
        });
    }
    if (filter?.name) {
        query.where(ETableNames.products + '.name', 'ilike', `%${filter.name}%`);
    }
    const result = await query;

    return Number(result[0]?.count ?? 0);
};

export const getProds = async (page: number, limit: number, filter?: IFilter): Promise<IResponse | Error> => {
    try {
        const query = Knex(ETableNames.products)
            .select('*');

        if (filter?.excludePackId) {
            query.whereNotExists(function () {
                this.select('*')
                    .from(ETableNames.prod_packs)
                    .whereRaw(`${ETableNames.prod_packs}.prod_id = ${ETableNames.products}.id`)
                    .andWhere(`${ETableNames.prod_packs}.pack_id`, filter.excludePackId!);
            });
        }
        if (filter?.name) {
            query.where(ETableNames.products + '.name', 'ilike', `%${filter.name}%`);
        }

        const result = await query
            .orderBy(`${ETableNames.products}.id`, 'desc')
            .offset((page - 1) * limit)
            .limit(limit);
        const total = await count(filter);
        return { totalCount: total, products: result };
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
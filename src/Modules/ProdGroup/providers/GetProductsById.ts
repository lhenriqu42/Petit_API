import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IProduct } from '../../../server/database/models';


interface IReturn {
    data: IProduct[]
    show: boolean;
}


export const getProductsById = async (page: number, limit: number, filter: string, group_id: number): Promise<IReturn | Error> => {
    try {
        const group = await Knex(ETableNames.groups).select('*').where('id', group_id).first();
        if (group) {
            const result = await Knex(ETableNames.products)
                .select('products.*')
                .join(ETableNames.product_groups, 'products.id', '=', 'product_groups.prod_id')
                .where('product_groups.group_id', group_id)
                .andWhere('products.name', 'ilike', `%${filter}%`)
                .andWhere('products.deleted_at', null)
                .orderBy('product_groups.created_at', 'desc')
                .offset((page - 1) * limit)
                .limit(limit);

            if (result) return { data: result, show: group.show };

            return new Error('Get Failed');
        } else {
            return new Error('Group not found');
        }
    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};
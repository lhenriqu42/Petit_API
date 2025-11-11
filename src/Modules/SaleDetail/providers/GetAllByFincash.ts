import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';
import { IFincash } from '../../../server/database/models';

interface IItem {
    id: number,
    fincash_id: number,
    obs: string,
    code: string,
    name: string,
    prod_price: number,
    sector: number,
    quantity: number,
    solded_price: number,
    pricetotal: number,
    created_at: string,
    updated_at: string
}

interface IComplete {
    fincash: IFincash,
    sales: ISaleComplete[]
}

interface ISaleComplete {
    sale_id: number,
    obs: string,
    products: {
        code: string,
        name: string,
        prod_price: number,
        sector: number,
        quantity: number,
        solded_price: number,
        price_total_per_product: number,
    }[],
    pricetotal_all_products: number,
    created_at: string,
    updated_at: string
}

interface IResponse {
    data: IComplete;
    totalFincashValue: number;
}

export const getAllByFincash = async (page: number, limit: number, fincash_id: number): Promise<IResponse | Error> => {
    try {
        const fincash = await Knex(ETableNames.fincashs).select('*').where('id', fincash_id).first();
        if (fincash) {
            const data: IItem[] = await Knex(ETableNames.sales)
                .join(ETableNames.saleDetails, `${ETableNames.sales}.id`, `${ETableNames.saleDetails}.sale_id`)
                .join(ETableNames.products, `${ETableNames.products}.id`, `${ETableNames.saleDetails}.prod_id`)
                .where(`${ETableNames.sales}.fincash_id`, fincash_id)
                .offset((page - 1) * limit)
                .limit(limit)
                .select(
                    `${ETableNames.sales}.id`,
                    `${ETableNames.sales}.obs`,

                    `${ETableNames.products}.code`,
                    `${ETableNames.products}.name`,
                    `${ETableNames.products}.price as prod_price`,
                    `${ETableNames.products}.sector`,

                    `${ETableNames.saleDetails}.quantity`,
                    `${ETableNames.saleDetails}.price as solded_price`,
                    `${ETableNames.saleDetails}.pricetotal`,

                    `${ETableNames.sales}.created_at`,
                    `${ETableNames.sales}.updated_at`,
                );

            const result = groupById(data);
            const totalFincashValue = result.reduce((a, b) => a + b.pricetotal_all_products, 0);

            return {
                data: {
                    fincash,
                    sales: result,
                },
                totalFincashValue
            };
        } else {
            return new Error('Fincash Not Found');
        }

    } catch (e) {
        console.log(e);
        return new Error('Get Failed');
    }
};

const groupById = (arr: IItem[]): ISaleComplete[] => {
    const grouped: Record<number, ISaleComplete> = {};

    arr.forEach(obj => {
        if (!grouped[obj.id]) {
            grouped[obj.id] = {
                sale_id: obj.id,
                obs: obj.obs,
                products: [],
                pricetotal_all_products: 0,
                created_at: obj.created_at,
                updated_at: obj.updated_at
            };
        }

        grouped[obj.id].products.push({
            code: obj.code,
            name: obj.name,
            prod_price: obj.prod_price,
            sector: obj.sector,
            quantity: obj.quantity,
            solded_price: obj.solded_price,
            price_total_per_product: obj.pricetotal
        });

        grouped[obj.id].pricetotal_all_products += Number(obj.pricetotal);
    });
    const data = Object.values(grouped);

    return data;
};
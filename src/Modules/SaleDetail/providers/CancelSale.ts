import { ETableNames } from '../../../server/database/ETableNames';
import { Knex } from '../../../server/database/knex';

export const cancelSale = async (sale_id: number): Promise<void | Error> => {
    try {
        // VERIFICAR SE A VENDA EXISTE OU JÁ FOI EXCLUÍDA
        const exists = await Knex(ETableNames.sales).select('fincash_id', 'deleted_at').where('id', sale_id).first();
        if (!exists) return new Error('Sale not found');
        if (exists.deleted_at) return new Error('Sale already canceled');

        // VERIFICAR SE O CAIXA EXISTE OU SE ESTÁ ABERTO
        const fincash = await Knex(ETableNames.fincashs).select('*').where('id', exists.fincash_id).first();
        if (!fincash) return new Error('Fincash not found');
        if (fincash.isFinished) return new Error('Fincash is finished');

        // VERIFICAR SE A VENDA ESTÁ VAZIA
        const saleDetails = await Knex(ETableNames.saleDetails)
            .select('id', 'quantity', 'prod_id')
            .where('sale_id', sale_id);
        if (saleDetails.length <= 0) return new Error('Sale empty');

        // VERIFICAR SE TODOS OS PRODUTOS TÊM UM ESTOQUE REGISTRADO E ADICIONAR O ESTOQUE
        const stockPromises = saleDetails.map(item =>
            Knex(ETableNames.stocks).select('*').where('prod_id', item.prod_id).first()
        );
        const stocks = await Promise.all(stockPromises);

        const stockRecord: Record<number, number> = {}; // Objeto para armazenar o estoque atualizado
        stocks.forEach((stock, index) => {
            if (!stock) {
                return new Error(`Stock not found for product ID: ${saleDetails[index].prod_id}`);
            }
            stockRecord[stock.prod_id] = stock.stock + saleDetails[index].quantity;
        });

        const updatePromises = saleDetails.map(item =>
            Knex(ETableNames.stocks)
                .update({ stock: stockRecord[item.prod_id] })
                .where('prod_id', item.prod_id)
        );
        await Promise.all(updatePromises);

        // OPERAÇÃO: MARCAR A VENDA COMO CANCELADA
        await Knex(ETableNames.sales)
            .update({
                deleted_at: Knex.fn.now()
            })
            .where('id', sale_id);


    } catch (e) {
        console.log(e);
        return new Error('Cancel Failed');
    }
};

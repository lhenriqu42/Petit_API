import {
    IUser,
    ISale,
    IPack,
    IGroup,
    IStock,
    IProduct,
    IFincash,
    IPayment,
    ISupplier,
    IValidity,
    IProdPack,
    INFEmitter,
    IPurchases,
    IProdOutput,
    ICashOutflow,
    ISaleDetails,
    IProduct_group,
    IPurchaseDetails,
    ISupplierProdMap,
    IProductCosts,
    IStockMovements

} from '../../models';

declare module 'knex/types/tables' {
    interface Tables {
        users: IUser;
        sales: ISale;
        packs: IPack;
        groups: IGroup;
        stocks: IStock;
        products: IProduct;
        fincashs: IFincash;
        payments: IPayment;
        suppliers: ISupplier;
        nf_emitters: INFEmitter;
        prod_packs: IProdPack;
        validities: IValidity;
        purchases: IPurchases;
        prod_output: IProdOutput;
        sale_details: ISaleDetails;
        cash_outflows: ICashOutflow;
        product_groups: IProduct_group;
        purchase_details: IPurchaseDetails;
        supplier_prod_map: ISupplierProdMap;
        stock_movements: IStockMovements;
        product_costs: IProductCosts;
    }
}
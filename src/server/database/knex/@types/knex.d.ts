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
    IPurchases,
    IProdOutput,
    ICashOutflow,
    ISaleDetails,
    IProduct_group,
    IPurchaseDetails
} from '../../../server/database/models';

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
        prod_packs: IProdPack;
        validities: IValidity;
        purchases: IPurchases;
        prod_output: IProdOutput;
        sale_details: ISaleDetails;
        cash_outflows: ICashOutflow;
        product_groups: IProduct_group;
        purchase_details: IPurchaseDetails;
    }
}
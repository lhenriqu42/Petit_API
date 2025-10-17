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
    IPurchases,
    IProdOutput,
    ICashOutflow,
    ISaleDetails,
    IProduct_group,
    IPurchaseDetails
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
        validities: IValidity;
        purchases: IPurchases;
        prod_output: IProdOutput;
        sale_details: ISaleDetails;
        cash_outflows: ICashOutflow;
        product_groups: IProduct_group;
        purchase_details: IPurchaseDetails;
    }
}
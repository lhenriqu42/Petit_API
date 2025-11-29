export interface ISupplierProdMap {
    id: number,
    supplier_prod_code: string,
    supplier_prod_name: string,

    supplier_prod_id: string,
    supplier_id: number,

    prod_id: number,
    pack_id: number | null,

    created_at: Date,
    updated_at: Date,

}
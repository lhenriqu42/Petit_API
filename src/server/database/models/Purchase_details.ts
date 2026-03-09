export enum EPurchaseType {
    PRODUCT = 'PRODUCT',
    PACK = 'PACK',
}

export interface IPurchaseDetails {
    id: number,
    purchase_id: number,
    type: EPurchaseType,
    prod_id: number,
    pack_id: number | null,
    pack_deleted_qnt: number | null,
    quantity: number,
    price: number,
    pricetotal: number,
    created_at: Date,
    updated_at: Date,

}
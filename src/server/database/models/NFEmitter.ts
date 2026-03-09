import { Maybe } from 'yup';

export interface INFEmitter {
    cnpj: string,
    supplier_id: Maybe<number>,
    x_nome?: string,
    x_fant?: string,
    ie?: string,
    cep?: string,
    uf?: string,
    city?: string,
    district?: string,
    street?: string,
    number?: string,
    complemento?: string,
    address_str?: string,
}
import * as create from './Create';
import * as getPacks from './GetPacks';
import * as getPacksByProd from './GetPacksByProd';
import * as getProdsByPack from './GetProdsByPack';

export const PackController = {
    ...create,
    ...getPacks,
    ...getPacksByProd,
    ...getProdsByPack
};
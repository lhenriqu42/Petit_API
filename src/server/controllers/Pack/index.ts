import * as create from './Create';
import * as getPacks from './GetPacks';
import * as getPacksByProd from './GetPacksByProd';
import * as getProdsByPack from './GetProdsByPack';
import * as putProdsInPack from './PutProdsInPack';
import * as putPacksInProd from './PutPacksInProd';

export const PackController = {
    ...create,
    ...getPacks,
    ...getPacksByProd,
    ...getProdsByPack,
    ...putProdsInPack,
    ...putPacksInProd
};
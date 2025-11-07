import * as create from './Create';
import * as getPacks from './GetPacks';
import * as getProds from './getProds';
import * as getPacksByProd from './getPacksByProd';
import * as getProdsByPack from './getProdsByPack';
import * as putProdsInPack from './PutProdsInPack';
import * as putPacksInProd from './PutPacksInProd';
import * as removePacksByProd from './removePacksByProd';
import * as removeProdsByPack from './removeProdsByPack';

export const PackProvider = {
    ...create,
    ...getPacks,
    ...getProds,
    ...getPacksByProd,
    ...getProdsByPack,
    ...putProdsInPack,
    ...putPacksInProd,
    ...removePacksByProd,
    ...removeProdsByPack,
};
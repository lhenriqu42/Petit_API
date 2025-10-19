import * as create from './Create';
import * as getPacks from './GetPacks';
import * as getPacksByProd from './getPacksByProd';
import * as getProdsByPack from './getProdsByPack';
import * as putProdsInPack from './PutProdsInPack';
import * as putPacksInProd from './PutPacksInProd';

export const PackProvider = {
    ...create,
    ...getPacks,
    ...getPacksByProd,
    ...getProdsByPack,
    ...putProdsInPack,
    ...putPacksInProd
};
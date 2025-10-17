import * as create from './Create';
import * as getPacks from './GetPacks';
import * as getPacksByProd from './getPacksByProd';
import * as getProdsByPack from './getProdsByPack';

export const PackProvider = {
    ...create,
    ...getPacks,
    ...getPacksByProd,
    ...getProdsByPack
};
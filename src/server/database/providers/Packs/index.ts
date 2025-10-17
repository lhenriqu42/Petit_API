import * as create from './Create';
import * as getPacks from './GetPacks';
import * as getPacksByProd from './getPacksByProd';

export const PackProvider = {
    ...create,
    ...getPacks,
    ...getPacksByProd
};
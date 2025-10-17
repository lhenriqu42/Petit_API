import * as create from './Create';
import * as getPacks from './GetPacks';
import * as getPacksByProd from './GetPacksByProd';

export const PackController = {
    ...create,
    ...getPacks,
    ...getPacksByProd
};
import * as create from './Create';
import * as getPacks from './GetPacks';

export const PackController = {
    ...create,
    ...getPacks
};
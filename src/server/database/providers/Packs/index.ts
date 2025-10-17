import * as create from './Create';
import * as getPacks from './GetPacks';

export const PackProvider = {
    ...create,
    ...getPacks
};
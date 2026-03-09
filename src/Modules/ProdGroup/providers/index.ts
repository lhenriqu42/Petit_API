import * as count from './Count';
import * as getAll from './GetAll';
import * as create from './Create';
import * as countProd from './CountProd';
import * as updateShow from './UpdateShow';
import * as getShowGroups from './GetShowGroups';
import * as putProdInGroup from './PutProdInGroup';
import * as getProductsById from './GetProductsById';
import * as deleteGroupById from './DeleteGroupById';
import * as deleteByProductId from './DeleteProductById';

export const ProdGroupProvider = {
    ...count,
    ...getAll,
    ...create,
    ...countProd,
    ...updateShow,
    ...getShowGroups,
    ...putProdInGroup,
    ...getProductsById,
    ...deleteGroupById,
    ...deleteByProductId,

};
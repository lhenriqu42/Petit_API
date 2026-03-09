import * as create from './Create';
import * as getAll from './GetAll';
import * as updateShow from './UpdateShow';
import * as getShowGroups from './GetShowGroups';
import * as putProdInGroup from './PutProdInGroup';
import * as deleteGroupById from './DeleteGroupById';
import * as getProductsById from './GetProductsById';
import * as deleteProductById from './DeleteProductById';

export const ProdGroupController = {
    ...create,
    ...getAll,
    ...updateShow,
    ...getShowGroups,
    ...putProdInGroup,
    ...deleteGroupById,
    ...getProductsById,
    ...deleteProductById,

};
import * as create from './Create';
import * as getById from './GetById';
import * as EditById from './EditById';
import * as getAllById from './GetAllById';
import * as updateById from './UpdateById';
import * as countAllById from './CountAllById';
import * as getTotalById from './GetTotalByid';

// import * as deleteById from './DeleteById';
// import * as finish from './Finish';

export const CashOutflowProvider = {
    ...create,
    ...getById,
    ...EditById,
    ...getAllById,
    ...updateById,
    ...countAllById,
    ...getTotalById,
    // ...deleteById,
    // ...finish,

};
import * as create from './Create';
import * as getAll from './GetAll';
import * as finish from './Finish';
import * as getById from './GetById';
import * as updateObs from './UpdateObs';
import * as calcBreak from './CalcBreak';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
import * as getByFinished from './GetByFinished';
import * as getDataById from './query/GetDataById';
import * as getLastFincash from './GetLastFincash';
import * as getDataByDate from './query/getDataByDate';
import * as getTotalByFincash from './GetTotalByFincash';
import * as getCurrentMonth from './query/getCurrentMonth';

export const FincashController = {
    ...create,
    ...getAll,
    ...finish,
    ...getById,
    ...updateObs,
    ...calcBreak,
    ...deleteById,
    ...updateById,
    ...getDataById,
    ...getByFinished,
    ...getDataByDate,
    ...getLastFincash,
    ...getCurrentMonth,
    ...getTotalByFincash,

};
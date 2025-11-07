import * as count from './Count';
import * as create from './Create';
import * as getAll from './GetAll';
import * as finish from './Finish';
import * as getById from './GetById';
import * as updateObs from './UpdateObs';
import * as calcBreak from './CalcBreak';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
import * as countData from './querry/CountData';
import * as getByFinished from './GetByFinished';
import * as getLastFincash from './GetLastFincash';
import * as getDataById from './querry/GetDataById';
import * as getDataByDate from './querry/GetDataByDate';
import * as getTotalByFincash from './GetTotalByFincash';


export const FincashProvider = {
    ...count,
    ...create,
    ...getAll,
    ...finish,
    ...getById,
    ...countData,
    ...updateObs,
    ...calcBreak,
    ...updateById,
    ...deleteById,
    ...getDataById,
    ...getByFinished,
    ...getDataByDate,
    ...getLastFincash,
    ...getTotalByFincash,
    
};
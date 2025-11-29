import * as create from './Create';
import * as getByCnpj from './GetByCnpj';
import * as linkToSupplier from './LinkToSuplier';

export const NFEmitterProvider = {
    ...create,
    ...linkToSupplier,
    ...getByCnpj,
};
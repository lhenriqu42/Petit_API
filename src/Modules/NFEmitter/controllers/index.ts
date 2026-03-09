import * as create from './Create';
import * as linkToSupplier from './LinkToSupplier';
import * as getByCnpj from './GetByCnpj';

export const NFEmitterController = {
    ...create,
    ...linkToSupplier,
    ...getByCnpj,
};
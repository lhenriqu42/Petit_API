import { ETableNames } from '../ETableNames';
import { Knex } from '../knex';


export const seed = async () => {
    const suppliersToInsert: { name: string }[] = [
        { name: 'Supplier A' },
        { name: 'Supplier B' },
        { name: 'Supplier C' },
        { name: 'Supplier D' },
        { name: 'Supplier E' },
        { name: 'Supplier F' },
        { name: 'Supplier G' },
        { name: 'Supplier H' },
        { name: 'Supplier I' },
        { name: 'Supplier J' }
    ];

    await Knex(ETableNames.suppliers).insert(suppliersToInsert);
};

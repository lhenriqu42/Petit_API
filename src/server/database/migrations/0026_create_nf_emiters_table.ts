import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';


export async function up(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Cria a tabela nf_emitters
        await trx.schema.createTable(ETableNames.nf_emitters, table => {
            table.increments('id').primary();
            table.string('cnpj', 20).notNullable().unique();
            table.string('x_nome', 100).notNullable();
            table.string('x_fant', 100).notNullable();
            table.integer('supplier_id').nullable().references('id').inTable(ETableNames.suppliers).onDelete('CASCADE');
            table.string('ie', 20).nullable().defaultTo(null);
            table.string('cep', 20).nullable().defaultTo(null);
            table.string('uf', 2).nullable().defaultTo(null);
            table.string('city', 100).nullable().defaultTo(null);
            table.string('district', 100).nullable().defaultTo(null);
            table.string('street', 100).nullable().defaultTo(null);
            table.string('number', 20).nullable().defaultTo(null);
            table.string('complemento', 100).nullable().defaultTo(null);
            table.string('address_str', 255).nullable().defaultTo(null);
        });

        // 🔹 2. Cria a função do trigger para address_str
        await trx.raw(`
            CREATE OR REPLACE FUNCTION fill_nf_emitter_address_str()
            RETURNS TRIGGER AS $$
            DECLARE
                clean_cep TEXT;
            BEGIN
                -- Limpa CEP para só números
                clean_cep := regexp_replace(NEW.cep, '\\D', '', 'g');

                NEW.address_str := TRIM(CONCAT_WS(
                    ' - ',

                    CONCAT_WS('|', 
                        -- Rua, Número
                        CONCAT_WS(', ', NEW.street, NEW.number),

                        -- Complemento
                        NEW.complemento
                    ),
                    
                    -- Bairro
                    NEW.district,

                    -- Cidade/UF
                    CONCAT_WS('/', NEW.city, NEW.uf),

                    -- CEP formatado
                    CASE 
                        WHEN clean_cep ~ '^[0-9]{8}$' 
                            THEN 'CEP: ' || SUBSTRING(clean_cep, 1, 5) || '-' || SUBSTRING(clean_cep, 6, 3)
                        WHEN NEW.cep IS NOT NULL
                            THEN 'CEP: ' || NEW.cep
                    END
                ));

                -- Remove múltiplos espaços
                NEW.address_str := regexp_replace(NEW.address_str, '\\s+', ' ', 'g');

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 🔹 3. Cria o trigger
        await trx.raw(`
            CREATE TRIGGER trg_fill_nf_emitter_address
            BEFORE INSERT OR UPDATE ON ${ETableNames.nf_emitters}
            FOR EACH ROW
            EXECUTE FUNCTION fill_nf_emitter_address_str();
        `);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        // 🔹 1. Remove o trigger
        await trx.raw(`
            DROP TRIGGER IF EXISTS trg_fill_nf_emitter_address ON ${ETableNames.nf_emitters};
        `);

        // 🔹 2. Remove a função do trigger
        await trx.raw(`
            DROP FUNCTION IF EXISTS fill_nf_emitter_address_str();
        `);

        // 🔹 3. Remove a tabela criada
        await trx.schema.dropTableIfExists(ETableNames.nf_emitters);

    });
}
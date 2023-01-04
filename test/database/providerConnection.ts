import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { newDb } from 'pg-mem';

export async function providerConnection(entities: EntityClassOrSchema[]): Promise<any[]> {
    try {

        // Create the database in memory
        const db = newDb({
            autoCreateForeignKeyIndices: true
        });

        // Register Functions
        db.public.registerFunction({
            implementation: () => 'test',
            name: 'current_database',
        });
        db.public.registerFunction({
            implementation: () => 'version',
            name: 'version',
        });

        // Create the Typeorm Connection with the provided entities
        const connection = await db.adapters.createTypeormConnection({
            type: 'postgres',
            entities: [...entities]
        });

        // Create the tables
        await connection.synchronize();
        let providers: { provide: any, useValue: any }[] = [];

        // For each entity creates a provider
        for (let entity of entities) {

            const token = getRepositoryToken(entity as any);
            const repository = await connection.getRepository(entity);

            providers.push({
                provide: token,
                useValue: repository
            });
        }
        // return the providers
        return providers;
    } catch (err) {
        throw new Error(`Cant create database, error: ${err}`);
    }

}
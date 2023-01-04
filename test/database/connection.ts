import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { newDb } from 'pg-mem';

export async function providerConnection(entities: EntityClassOrSchema[]): Promise<any[]> {
    try {

        // Cria o banco em memória
        const db = newDb({
            autoCreateForeignKeyIndices: true
        });

        // Registra as funções faltantes
        db.public.registerFunction({
            implementation: () => 'test',
            name: 'current_database',
        });
        db.public.registerFunction({
            implementation: () => 'version',
            name: 'version',
        });

        // Cria a connection Typeorm com as entities fornecidas
        const connection = await db.adapters.createTypeormConnection({
            type: 'postgres',
            entities: [...entities]
        });

        // Cria as tabelas
        await connection.synchronize();
        let providers: { provide: any, useValue: any }[] = [];

        // Para cada entity cria um objeto de provider correnspondente
        for (let entity of entities) {

            const token = getRepositoryToken(entity as any);
            const repository = await connection.getRepository(entity);

            providers.push({
                provide: token,
                useValue: repository
            });
        }
        // retorna os providers prontos para uso
        return providers;
    } catch (err) {
        throw new Error(`Cant create database, error: ${err}`);
    }

}
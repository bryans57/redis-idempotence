import { StatusModel } from '../domain/models';
import { RedisService } from '../infrastructure/db';

export async function createStatus(collection: string, id: string, db: RedisService): Promise<void> {
    try {
        const status: StatusModel = {
            retry: 0,
            status: 'procesando',
        };
        await db.set(`${collection}-${id}`, status);
    } catch (error) {
        console.log('Error al crear el estado de la petición en redis');
        throw error;
    }
}

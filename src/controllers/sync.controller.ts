import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import { SyncLog } from '../entities/SyncLog';
import { BaseModel } from '../entities/BaseModel';

type Constructor<T> = new (...args: any[]) => T;

type EntityMap = {
    [key: string]: typeof BaseModel;
};

/**
 * Controlador de sincronización offline
 */
export class SyncController {
    private static entityMap: EntityMap = {};

    /**
     * Registra entidades para sincronización
     */
    public static registerEntities(entities: EntityMap) {
        Object.assign(SyncController.entityMap, entities);
    }

    /**
     * Inicializa una sesión de sincronización
     */
    public static async initSync(req: Request, res: Response) {
        const { deviceId } = req.body;

        if (!deviceId) {
            return res.status(400).json({ error: 'deviceId es requerido' });
        }

        const syncToken = new Date().toISOString();

        res.json({
            success: true,
            syncToken,
            message: 'Sesión de sincronización iniciada'
        });
    }

    /**
     * Envía cambios del dispositivo al servidor
     */
    public static async pushChanges(req: Request, res: Response) {
        const { deviceId, changes } = req.body;

        if (!deviceId || !changes) {
            return res.status(400).json({ error: 'deviceId y changes son requeridos' });
        }

        const entityManager = getManager();
        const results: Array<{ id: number; status: 'created' | 'updated' | 'error'; error?: string }> = [];

        try {
            await entityManager.transaction(async transactionalEntityManager => {
                for (const change of changes) {
                    try {
                        const { entity, operation, data } = change;
                        const entityClass = SyncController.entityMap[entity];

                        if (!entityClass) {
                            throw new Error(`Entidad desconocida: ${entity}`);
                        }

                        let record: any;
                        let status: 'created' | 'updated' = 'updated';

                        if (operation === 'create') {
                            const repository = transactionalEntityManager.getRepository(entityClass);
                            record = repository.create();
                            status = 'created';
                        } else {
                            record = await transactionalEntityManager.findOne(entityClass, data.id);
                            if (!record) {
                                throw new Error(`Registro no encontrado: ${entity} con id ${data.id}`);
                            }
                        }

                        // Aplicar cambios
                        Object.assign(record, data);
                        record.deviceId = deviceId;
                        record.lastSyncedAt = new Date();

                        if (operation === 'delete') {
                            record.isDeleted = true;
                        }

                        await transactionalEntityManager.save(record);

                        results.push({ id: data.id, status });
                    } catch (error) {
                        results.push({
                            id: change.data?.id || -1,
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Error desconocido'
                        });
                    }
                }
            });

            res.json({
                success: true,
                results,
                message: 'Cambios enviados exitosamente'
            });
        } catch (error) {
            console.error('Error al enviar cambios:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error al enviar cambios'
            });
        }
    }

    /**
     * Obtiene cambios del servidor para el dispositivo
     */
    public static async pullChanges(req: Request, res: Response) {
        const { deviceId, lastSyncToken } = req.body;

        if (!deviceId) {
            return res.status(400).json({ error: 'deviceId es requerido' });
        }

        try {
            const lastSyncDate = lastSyncToken ? new Date(lastSyncToken) : new Date(0);

            // Obtener cambios desde la última sincronización
            const changes = await getManager()
                .createQueryBuilder(SyncLog, 'log')
                .where('log.createdAt > :lastSyncDate', { lastSyncDate })
                .andWhere('log.deviceId != :deviceId', { deviceId })
                .andWhere('log.isSynced = :isSynced', { isSynced: false })
                .getMany();

            // Agrupar cambios por tipo de entidad
            const groupedChanges: Record<string, any[]> = {};

            for (const change of changes) {
                if (!groupedChanges[change.entityName]) {
                    groupedChanges[change.entityName] = [];
                }
                groupedChanges[change.entityName].push(change);
            }

            // Marcar cambios como sincronizados
            await getManager()
                .createQueryBuilder()
                .update(SyncLog)
                .set({ isSynced: true })
                .whereInIds(changes.map(c => c.id))
                .execute();

            res.json({
                success: true,
                changes: groupedChanges,
                syncToken: new Date().toISOString(),
                message: 'Cambios obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener cambios:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener cambios'
            });
        }
    }
}

import { Request, Response } from 'express';
import { getManager, In, getRepository } from 'typeorm';
import { SyncLog } from '../entities/SyncLog';
import { BaseModel } from '../entities/BaseModel';

// Helper type for entity constructors
type Constructor<T> = new (...args: any[]) => T;

type EntityMap = {
    [key: string]: typeof BaseModel;
};

export class SyncController {
    // Map entity names to their respective model classes
    private static entityMap: EntityMap = {};

    // Register all entities that need synchronization
    public static registerEntities(entities: EntityMap) {
        Object.assign(SyncController.entityMap, entities);
    }

    // Initialize sync session
    public static async initSync(req: Request, res: Response) {
        const { deviceId } = req.body;
        
        if (!deviceId) {
            return res.status(400).json({ error: 'deviceId is required' });
        }

        // Return the current server timestamp as sync token
        const syncToken = new Date().toISOString();
        
        res.json({
            success: true,
            syncToken,
            message: 'Sync session initialized'
        });
    }

    // Push changes from device to server
    public static async pushChanges(req: Request, res: Response) {
        const { deviceId, changes } = req.body;
        
        if (!deviceId || !changes) {
            return res.status(400).json({ error: 'deviceId and changes are required' });
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
                            throw new Error(`Unknown entity: ${entity}`);
                        }

                        let record: any;
                        let status: 'created' | 'updated' = 'updated';

                        if (operation === 'create') {
                            // Use repository.create() which handles the instantiation properly
                            const repository = transactionalEntityManager.getRepository(entityClass);
                            record = repository.create();
                            status = 'created';
                        } else {
                            record = await transactionalEntityManager.findOne(entityClass, data.id);
                            if (!record) {
                                throw new Error(`Record not found: ${entity} with id ${data.id}`);
                            }
                        }

                        // Apply changes
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
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });
                    }
                }
            });

            res.json({
                success: true,
                results,
                message: 'Changes pushed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to push changes'
            });
        }
    }

    // Pull changes from server to device
    public static async pullChanges(req: Request, res: Response) {
        const { deviceId, lastSyncToken } = req.body;
        
        if (!deviceId) {
            return res.status(400).json({ error: 'deviceId is required' });
        }

        try {
            const lastSyncDate = lastSyncToken ? new Date(lastSyncToken) : new Date(0);
            
            // Get all changes since last sync, excluding those made by this device
            const changes = await getManager()
                .createQueryBuilder(SyncLog, 'log')
                .where('log.createdAt > :lastSyncDate', { lastSyncDate })
                .andWhere('log.deviceId != :deviceId', { deviceId })
                .andWhere('log.isSynced = :isSynced', { isSynced: false })
                .getMany();

            // Group changes by entity type
            const groupedChanges: Record<string, any[]> = {};
            
            for (const change of changes) {
                if (!groupedChanges[change.entityName]) {
                    groupedChanges[change.entityName] = [];
                }
                groupedChanges[change.entityName].push(change);
            }

            // Mark these changes as synced
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
                message: 'Changes pulled successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to pull changes'
            });
        }
    }
}

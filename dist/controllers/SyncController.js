"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncController = void 0;
const typeorm_1 = require("typeorm");
const SyncLog_1 = require("../entities/SyncLog");
class SyncController {
    // Register all entities that need synchronization
    static registerEntities(entities) {
        Object.assign(SyncController.entityMap, entities);
    }
    // Initialize sync session
    static async initSync(req, res) {
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
    static async pushChanges(req, res) {
        const { deviceId, changes } = req.body;
        if (!deviceId || !changes) {
            return res.status(400).json({ error: 'deviceId and changes are required' });
        }
        const entityManager = (0, typeorm_1.getManager)();
        const results = [];
        try {
            await entityManager.transaction(async (transactionalEntityManager) => {
                for (const change of changes) {
                    try {
                        const { entity, operation, data } = change;
                        const entityClass = SyncController.entityMap[entity];
                        if (!entityClass) {
                            throw new Error(`Unknown entity: ${entity}`);
                        }
                        let record;
                        let status = 'updated';
                        if (operation === 'create') {
                            // Use repository.create() which handles the instantiation properly
                            const repository = transactionalEntityManager.getRepository(entityClass);
                            record = repository.create();
                            status = 'created';
                        }
                        else {
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
                    }
                    catch (error) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to push changes'
            });
        }
    }
    // Pull changes from server to device
    static async pullChanges(req, res) {
        const { deviceId, lastSyncToken } = req.body;
        if (!deviceId) {
            return res.status(400).json({ error: 'deviceId is required' });
        }
        try {
            const lastSyncDate = lastSyncToken ? new Date(lastSyncToken) : new Date(0);
            // Get all changes since last sync, excluding those made by this device
            const changes = await (0, typeorm_1.getManager)()
                .createQueryBuilder(SyncLog_1.SyncLog, 'log')
                .where('log.createdAt > :lastSyncDate', { lastSyncDate })
                .andWhere('log.deviceId != :deviceId', { deviceId })
                .andWhere('log.isSynced = :isSynced', { isSynced: false })
                .getMany();
            // Group changes by entity type
            const groupedChanges = {};
            for (const change of changes) {
                if (!groupedChanges[change.entityName]) {
                    groupedChanges[change.entityName] = [];
                }
                groupedChanges[change.entityName].push(change);
            }
            // Mark these changes as synced
            await (0, typeorm_1.getManager)()
                .createQueryBuilder()
                .update(SyncLog_1.SyncLog)
                .set({ isSynced: true })
                .whereInIds(changes.map(c => c.id))
                .execute();
            res.json({
                success: true,
                changes: groupedChanges,
                syncToken: new Date().toISOString(),
                message: 'Changes pulled successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to pull changes'
            });
        }
    }
}
exports.SyncController = SyncController;
// Map entity names to their respective model classes
SyncController.entityMap = {};

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';

/**
 * Entidad 'SyncLog'
 * Registro de sincronización para controlar cambios entre dispositivos y servidor.
 * Almacena operaciones (CREATE, UPDATE, DELETE) pendientes o realizadas.
 */
@Entity('sync_logs')
export class SyncLog extends BaseModel {
    @Column({ type: 'varchar', length: 255 })
    entityName!: string;

    @Column({ type: 'int' })
    entityId!: number;

    @Column({ type: 'varchar', length: 20 })
    operation!: 'CREATE' | 'UPDATE' | 'DELETE';

    @Column({ type: 'json', nullable: true })
    changes?: Record<string, any>;

    @Column({ type: 'varchar', length: 100 })
    deviceId!: string;

    @Column({ type: 'boolean', default: false })
    isSynced!: boolean;
}

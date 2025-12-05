import { BaseEntity as TypeOrmBaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseModel extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'last_synced_at', type: 'timestamp', nullable: true })
    lastSyncedAt?: Date;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean = false;

    @Column({ name: 'device_id', type: 'varchar', length: 100, nullable: true })
    deviceId?: string;
}
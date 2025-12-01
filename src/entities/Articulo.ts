import { Entity, Column, Index } from 'typeorm';
import { BaseModel } from './BaseModel';

@Entity('articulos')
export class Articulo extends BaseModel {
    @Column({ name: 'ccod', type: 'varchar', length: 30, nullable: false })
    @Index({ unique: true })
    codigo!: string;  
    
    @Column({ name: 'cdet', type: 'varchar', length: 100, nullable: false })
    descripcion!: string;

    @Column({ name: 'ncan1', type: 'decimal', precision: 18, scale: 2, default: 0 })
    cantidad!: number;

    @Column({ name: 'npre1', type: 'decimal', precision: 18, scale: 2, nullable: false })
    precio!: number;

    @Column({ name: 'cmar', type: 'varchar', length: 40, nullable: true })
    marca?: string;

    @Column({ name: 'ccla', type: 'varchar', length: 50, nullable: true })
    clase?: string;
}
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Empresa } from './Empresa';

@Entity('articulos')
@Index(['empresaId', 'codigo'], { unique: true })
export class Articulo extends BaseModel {
    @Column({ name: 'ccod', type: 'varchar', length: 30, nullable: false })
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

    @Column({ name: 'empresa_id', type: 'int', nullable: true })
    empresaId!: number;

    @ManyToOne(() => Empresa, (empresa) => empresa.articulos, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'empresa_id' })
    empresa!: Empresa;
}
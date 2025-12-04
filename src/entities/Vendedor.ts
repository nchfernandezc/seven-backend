import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Empresa } from './Empresa';
import { Cliente } from './Cliente';

@Entity('vendedores')
@Index(['empresaId', 'codigo'], { unique: true })
export class Vendedor extends BaseModel {
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombre!: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    codigo!: string; // N° Vendedor

    @Column({ type: 'varchar', length: 50, nullable: true })
    telefono?: string;

    @Column({ name: 'empresa_id', type: 'int', nullable: true })
    empresaId!: number;

    @ManyToOne(() => Empresa, (empresa) => empresa.vendedores, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'empresa_id' })
    empresa!: Empresa;

    @OneToMany(() => Cliente, (cliente) => cliente.vendedor)
    clientes!: Cliente[];
}

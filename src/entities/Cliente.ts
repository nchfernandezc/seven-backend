import { Entity, Column, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Cxcobrar } from './Cxcobrar';
import { Pedido } from './Pedido';
import { Vendedor } from './Vendedor';
import { Empresa } from './Empresa';

/**
 * Entidad 'Cliente'
 * Representa a los clientes de la empresa.
 * Mapea a la tabla 'clientes' y tiene relaciones con Vendedor, Empresa, Pedidos y CxC.
 */
@Entity('clientes')
@Index(['empresaId', 'codigo'], { unique: true })
export class Cliente extends BaseModel {
    @Column({ name: 'ccod', type: 'varchar', length: 20, nullable: false })
    codigo!: string;

    @Column({ name: 'cdet', type: 'varchar', length: 100, nullable: false })
    nombre!: string;

    @Column({ name: 'cdir', type: 'varchar', length: 100, nullable: true })
    direccion?: string;

    @Column({ name: 'ctel', type: 'varchar', length: 50, nullable: true })
    telefono?: string;

    @Column({ name: 'cven', type: 'varchar', length: 10, nullable: false })
    vendedorCodigo!: string;

    @Column({ name: 'empresa_id', type: 'int', nullable: false })
    empresaId!: number;

    @ManyToOne(() => Empresa)
    @JoinColumn({ name: 'empresa_id' })
    empresa!: Empresa;

    @ManyToOne(() => Vendedor, (vendedor) => vendedor.clientes)
    @JoinColumn([
        { name: 'empresa_id', referencedColumnName: 'empresaId' },
        { name: 'cven', referencedColumnName: 'codigo' }
    ])
    vendedor!: Vendedor;

    @OneToMany(() => Cxcobrar, (cxc) => cxc.cliente, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    cuentasPorCobrar!: Cxcobrar[];

    @OneToMany(() => Pedido, (pedido) => pedido.cliente, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    pedidos!: Pedido[];
}
import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Cxcobrar } from './Cxcobrar';
import { Pedido } from './Pedido';

@Entity('clientes')
export class Cliente extends BaseModel {
    @Column({ name: 'ccod', type: 'varchar', length: 20, nullable: false })
    @Index({ unique: true })
    codigo!: string;

    @Column({ name: 'cdet', type: 'varchar', length: 100, nullable: false })
    nombre!: string;

    @Column({ name: 'cdir', type: 'varchar', length: 100, nullable: true })
    direccion?: string;

    @Column({ name: 'ctel', type: 'varchar', length: 50, nullable: true })
    telefono?: string;

    @Column({ name: 'cven', type: 'varchar', length: 10, nullable: false })
    vendedorId!: string;

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
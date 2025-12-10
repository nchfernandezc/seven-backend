import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Cliente } from './Cliente';
import { Articulo } from './Articulo';

/**
 * Entidad 'Pedido'
 * Representa las órdenes de compra generadas por los clientes.
 * Contiene detalles como cantidad, precio y estado del pedido.
 */
@Entity('pedidos')
export class Pedido extends BaseModel {
    @Column({ name: 'num', type: 'varchar', length: 20, nullable: false })
    @Index({ unique: true })
    numero!: string;

    @Column({ name: 'cod', type: 'varchar', length: 30, nullable: false })
    articuloCodigo!: string;

    @Column({ name: 'can', type: 'decimal', precision: 10, scale: 2, nullable: false })
    cantidad!: number;

    @Column({ name: 'pvp', type: 'decimal', precision: 10, scale: 2, nullable: false })
    precioVenta!: number;

    @Column({ name: 'ccli', type: 'varchar', length: 20, nullable: false })
    clienteCodigo!: string;

    @Column({ name: 'ista', type: 'int', default: 1 })
    estado!: number; // 1: Pendiente, 2: Procesado, 3: Anulado

    @Column({ name: 'dfec', type: 'timestamp', nullable: false })
    fecha!: Date;

    @Column({ name: 'cusu', type: 'varchar', length: 30, nullable: false })
    usuario!: string;

    @Column({ name: 'idx', type: 'int', default: 0 })
    indice!: number;

    @Column({ name: 'empresa_id', type: 'int', nullable: false })
    empresaId!: number;

    @ManyToOne(() => Cliente, { createForeignKeyConstraints: false })
    @JoinColumn([
        { name: 'empresa_id', referencedColumnName: 'empresaId' },
        { name: 'ccli', referencedColumnName: 'codigo' }
    ])
    cliente!: Cliente;

    @ManyToOne(() => Articulo, { createForeignKeyConstraints: false })
    @JoinColumn([
        { name: 'empresa_id', referencedColumnName: 'empresaId' },
        { name: 'cod', referencedColumnName: 'codigo' }
    ])
    articulo!: Articulo;
}
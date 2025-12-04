import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Cliente } from './Cliente';

export type EstadoCxc = 'pendiente' | 'vencido' | 'pagado' | 'anulado';

@Entity('cxcobrar')
export class Cxcobrar extends BaseModel {
    @Column({ name: 'cdoc', type: 'varchar', length: 3, nullable: false })
    tipoDocumento!: string;

    @Column({ name: 'inum', type: 'int', nullable: false })
    numero!: number;

    @Column({ name: 'monto', type: 'decimal', precision: 12, scale: 2, nullable: false })
    monto!: number;

    @Column({ name: 'nsal', type: 'decimal', precision: 12, scale: 2, nullable: false })
    saldo!: number;

    @Column({ name: 'ccli', type: 'varchar', length: 20, nullable: false })
    clienteCodigo!: string;

    @Column({ name: 'dfec', type: 'datetime', nullable: false })
    fecha!: Date;

    @Column({ name: 'fecha_vencimiento', type: 'datetime', nullable: true })
    fechaVencimiento?: Date;

    @Column({ name: 'fecha_pago', type: 'datetime', nullable: true })
    fechaPago?: Date;

    @Column({ 
        name: 'estado',
        type: 'varchar',
        length: 20,
        default: 'pendiente'
    })
    estado!: EstadoCxc;

    @Column({ name: 'observaciones', type: 'text', nullable: true })
    observaciones?: string;

    @ManyToOne(() => Cliente, cliente => cliente.cuentasPorCobrar, { 
        eager: true,
        onDelete: 'CASCADE' 
    })
    @JoinColumn([
        { name: 'empresa_id', referencedColumnName: 'empresaId' },
        { name: 'ccli', referencedColumnName: 'codigo' }
    ])
    cliente!: Cliente;

    @Column({ name: 'empresa_id', type: 'int', nullable: false })
    empresaId!: number;
}
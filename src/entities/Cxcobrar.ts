import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Cliente } from './Cliente';

@Entity('cxcobrar')
export class Cxcobrar extends BaseModel {
    @Column({ name: 'cdoc', type: 'varchar', length: 3, nullable: false })
    tipoDocumento!: string;

    @Column({ name: 'inum', type: 'int', nullable: false })
    numero!: number;

    @Column({ name: 'nsal', type: 'decimal', precision: 10, scale: 2, nullable: false })
    saldo!: number;

    @Column({ name: 'ccli', type: 'varchar', length: 20, nullable: false })
    clienteCodigo!: string;

    @Column({ name: 'dfec', type: 'datetime', nullable: false })
    fecha!: Date;

    @ManyToOne(() => Cliente, cliente => cliente.cuentasPorCobrar)
    @JoinColumn({ name: 'ccli', referencedColumnName: 'codigo' })
    cliente!: Cliente;
}
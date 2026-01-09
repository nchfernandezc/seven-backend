import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from './Cliente';

/**
 * Entidad 'Cxcobrar' -> 'cxc'
 * Representa las Cuentas por Cobrar (Legacy 071_cxc).
 */
export type EstadoCxc = 'pendiente' | 'pagado';

@Entity('cxcobrar')
export class Cxcobrar {
    @PrimaryGeneratedColumn({ name: 'xxx' })
    internalId!: number;

    @Column({ name: 'id', type: 'int', nullable: false })
    empresaId!: number;

    @Column({ name: 'cdoc', type: 'varchar', length: 10, nullable: false })
    tipoDocumento!: string;

    @Column({ name: 'ccli', type: 'varchar', length: 20, nullable: false })
    clienteCodigo!: string;

    @Column({ name: 'inum', type: 'int', nullable: false })
    numero!: number;

    @Column({ name: 'nnet', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nnet!: number;

    @Column({ name: 'niva', type: 'decimal', precision: 12, scale: 2, default: 0 })
    niva!: number;

    @Column({ name: 'dfec', type: 'datetime', nullable: false })
    fecha!: Date;

    @Column({ name: 'nsal', type: 'decimal', precision: 12, scale: 2, nullable: false })
    saldo!: number;

    @Column({ name: 'idia', type: 'int', default: 0 })
    dias!: number;

    @Column({
        name: 'ista',
        type: 'int',
        default: 0,
        transformer: {
            to: (value: EstadoCxc) => value === 'pagado' ? 1 : 0,
            from: (value: number) => value === 1 ? 'pagado' : 'pendiente'
        }
    })
    estado!: EstadoCxc;

    @Column({ name: 'ival', type: 'int', default: 0 })
    ival!: number;

    @Column({ name: 'iprt', type: 'int', default: 0 })
    iprt!: number;

    @Column({ name: 'ifis', type: 'int', default: 0 })
    ifis!: number;

    @Column({ name: 'ccon', type: 'varchar', length: 50, default: '' })
    ccon!: string;

    @Column({ name: 'cven', type: 'varchar', length: 10, default: '' })
    cven!: string;

    @Column({ name: 'iafe', type: 'int', default: 0 })
    iafe!: number;

    @Column({ name: 'cafe', type: 'varchar', length: 10, default: '' })
    cafe!: string;

    @Column({ name: 'ifor', type: 'int', default: 0 })
    ifor!: number;

    @Column({ name: 'cinf', type: 'varchar', length: 50, default: '' })
    cinf!: string;

    @Column({ name: 'cnro', type: 'varchar', length: 20, default: '' })
    cnro!: string;

    @Column({ name: 'nret1', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nret1!: number;

    @Column({ name: 'nret2', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nret2!: number;

    @Column({ name: 'cnro1', type: 'varchar', length: 20, default: '' })
    cnro1!: string;

    @Column({ name: 'cnro2', type: 'varchar', length: 20, default: '' })
    cnro2!: string;

    @Column({ name: 'ipp', type: 'int', default: 0 })
    ipp!: number;

    @Column({ name: 'isube', type: 'int', default: 0 })
    isube!: number;

    @Column({ name: 'nexe', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nexe!: number;

    @Column({ name: 'nnetyx', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nnetyx!: number;

    @Column({ name: 'nivax', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nivax!: number;

    @Column({ name: 'nsalx', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nsalx!: number;

    @Column({ name: 'nexex', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nexex!: number;

    @Column({ name: 'itip', type: 'int', default: 0 })
    itip!: number;

    @Column({ name: 'ipag', type: 'int', default: 0 })
    ipag!: number;

    @Column({ name: 'imon', type: 'int', default: 0 })
    imon!: number;

    @Column({ name: 'idoc', type: 'int', default: 0 })
    idoc!: number;

    @Column({ name: 'imar', type: 'int', default: 0 })
    imar!: number;

    @Column({ name: 'cfac', type: 'varchar', length: 20, default: '' })
    cfac!: string;

    @Column({ name: 'cnum', type: 'varchar', length: 20, default: '' })
    cnum!: string;

    @Column({ name: 'cche', type: 'varchar', length: 20, default: '' })
    cche!: string;

    @Column({ name: 'cfr1', type: 'varchar', length: 20, default: '' })
    cfr1!: string;

    @Column({ name: 'cfr2', type: 'varchar', length: 20, default: '' })
    cfr2!: string;

    @Column({ name: 'cdet', type: 'varchar', length: 100, nullable: true })
    cdet?: string;

    @Column({ name: 'dven', type: 'datetime', nullable: true })
    fechaVencimiento?: Date;

    @Column({ name: 'dfac', type: 'datetime', nullable: true })
    fechaFactura?: Date;

    @Column({ name: 'nsal2', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nsal2!: number;

    @Column({ name: 'nbolivar', type: 'decimal', precision: 12, scale: 2, default: 0 })
    nbolivar!: number;

    @Column({ name: 'ndolar', type: 'decimal', precision: 12, scale: 4, default: 0 })
    ndolar!: number;

    @Column({ name: 'crel', type: 'varchar', length: 20, default: '' })
    crel!: string;

    @Column({ name: 'cusu', type: 'varchar', length: 20, default: '' })
    cusu!: string;

    @Column({ name: 'csuc', type: 'varchar', length: 10, default: '' })
    csuc!: string;

    // App required fields
    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean = false;

    @Column({ name: 'last_synced_at', type: 'datetime', nullable: true })
    lastSyncedAt?: Date;

    @Column({ name: 'device_id', type: 'varchar', length: 100, nullable: true })
    deviceId?: string;

    @ManyToOne(() => Cliente, cliente => cliente.cuentasPorCobrar, {
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn([
        { name: 'id', referencedColumnName: 'empresaId' },
        { name: 'ccli', referencedColumnName: 'codigo' }
    ])
    cliente!: Cliente;
}
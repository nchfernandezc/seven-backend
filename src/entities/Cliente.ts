import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cxcobrar } from './Cxcobrar';
import { Pedido } from './Pedido';
import { Vendedor } from './Vendedor';
import { Empresa } from './Empresa';

@Entity('clientes')
@Index(['empresaId', 'codigo'], { unique: true })
export class Cliente {
    @PrimaryGeneratedColumn({ name: 'xxx' })
    internalId!: number;

    @Column({ name: 'id', type: 'int', nullable: false })
    empresaId!: number;

    @Column({ name: 'ccod', type: 'varchar', length: 20, nullable: false })
    codigo!: string;

    @Column({ name: 'cdet', type: 'varchar', length: 200, nullable: false })
    nombre!: string;

    @Column({ name: 'cdir', type: 'varchar', length: 200, nullable: true })
    direccion?: string;

    @Column({ name: 'ctel', type: 'varchar', length: 100, nullable: true })
    telefono?: string;

    @Column({ name: 'crif', type: 'varchar', length: 20, default: '' })
    rif!: string;

    @Column({ name: 'cruc', type: 'varchar', length: 20, default: '' })
    ruc!: string;

    @Column({ name: 'cmai', type: 'varchar', length: 100, default: '' })
    email!: string;

    @Column({ name: 'ccon', type: 'varchar', length: 50, default: '' })
    contacto!: string;

    @Column({ name: 'ctvt', type: 'varchar', length: 10, default: '' })
    ctvt!: string;

    @Column({ name: 'czon', type: 'varchar', length: 10, default: '' })
    zona!: string;

    @Column({ name: 'cven', type: 'varchar', length: 10, nullable: false, default: '' })
    vendedorCodigo!: string;

    @Column({ name: 'ccir', type: 'varchar', length: 10, default: '' })
    ccir!: string;

    @Column({ name: 'csup', type: 'varchar', length: 10, default: '' })
    csup!: string;

    @Column({ name: 'csada', type: 'varchar', length: 20, default: '' })
    csada!: string;

    @Column({ name: 'iblo', type: 'int', default: 0 })
    iblo!: number;

    @Column({ name: 'imas', type: 'int', default: 0 })
    imas!: number;

    @Column({ name: 'itas', type: 'int', default: 0 })
    itas!: number;

    @Column({ name: 'dfecn', type: 'date', nullable: true })
    fechaNacimiento?: Date;

    @Column({ name: 'dfec', type: 'datetime', nullable: true })
    fecha!: Date;

    @Column({ name: 'nfle', type: 'decimal', precision: 18, scale: 2, default: 0 })
    nfle!: number;

    @Column({ name: 'ndes', type: 'decimal', precision: 18, scale: 2, default: 0 })
    ndes!: number;

    @Column({ name: 'icon', type: 'int', default: 0 })
    icon!: number;

    @Column({ name: 'idob', type: 'int', default: 0 })
    idob!: number;

    @Column({ name: 'igec', type: 'int', default: 0 })
    igec!: number;

    @Column({ name: 'iprt', type: 'int', default: 0 })
    iprt!: number;

    @Column({ name: 'isube', type: 'int', default: 0 })
    isube!: number;

    @Column({ name: 'ivip', type: 'int', default: 0 })
    ivip!: number;

    @Column({ name: 'ipag', type: 'int', default: 0 })
    ipag!: number;

    @Column({ name: 'ifor', type: 'int', default: 0 })
    ifor!: number;

    @Column({ name: 'iequ', type: 'int', default: 0 })
    iequ!: number;

    @Column({ name: 'ican', type: 'int', default: 0 })
    ican!: number;

    @Column({ name: 'ccoc', type: 'varchar', length: 50, default: '' })
    ccoc!: string;

    @Column({ name: 'cblo', type: 'varchar', length: 50, default: '' })
    cblo!: string;

    @Column({ name: 'icos', type: 'int', default: 0 })
    icos!: number;

    @Column({ name: 'ifre', type: 'int', default: 0 })
    ifre!: number;

    @Column({ name: 'isec', type: 'int', default: 0 })
    isec!: number;

    @Column({ name: 'clat', type: 'varchar', length: 20, default: '' })
    latitud!: string;

    @Column({ name: 'clon', type: 'varchar', length: 20, default: '' })
    longitud!: string;

    @Column({ name: 'cenc', type: 'varchar', length: 50, default: '' })
    cenc!: string;

    @Column({ name: 'nlim', type: 'decimal', precision: 18, scale: 2, default: 0 })
    limiteCredito!: number;

    @Column({ name: 'i_lun', type: 'int', default: 0 })
    iLun!: number;

    @Column({ name: 'i_mar', type: 'int', default: 0 })
    iMar!: number;

    @Column({ name: 'i_mie', type: 'int', default: 0 })
    iMie!: number;

    @Column({ name: 'i_jue', type: 'int', default: 0 })
    iJue!: number;

    @Column({ name: 'i_vie', type: 'int', default: 0 })
    iVie!: number;

    @Column({ name: 'cciu', type: 'varchar', length: 50, default: '' })
    ciudad!: string;

    @Column({ name: 'isup', type: 'int', default: 0 })
    isup!: number;

    @Column({ name: 'ccan', type: 'varchar', length: 50, default: '' })
    ccan!: string;

    @Column({ name: 'ccal', type: 'varchar', length: 50, default: '' })
    ccal!: string;

    @Column({ name: 'csec', type: 'varchar', length: 50, default: '' })
    sector!: string;

    @Column({ name: 'cmov', type: 'varchar', length: 50, default: '' })
    movil!: string;

    @Column({ name: 'cban1', type: 'varchar', length: 50, default: '' })
    banco1!: string;

    @Column({ name: 'cnum1', type: 'varchar', length: 50, default: '' })
    cuenta1!: string;

    @Column({ name: 'cban2', type: 'varchar', length: 50, default: '' })
    banco2!: string;

    @Column({ name: 'cnum2', type: 'varchar', length: 50, default: '' })
    cuenta2!: string;

    @Column({ name: 'cban3', type: 'varchar', length: 50, default: '' })
    banco3!: string;

    @Column({ name: 'cnum3', type: 'varchar', length: 50, default: '' })
    cuenta3!: string;

    @Column({ name: 'isuc', type: 'int', default: 0 })
    isuc!: number;

    @Column({ name: 'ise', type: 'int', default: 0 })
    ise!: number;

    @Column({ name: 'ista', type: 'int', default: 0 })
    ista!: number;

    @Column({ name: 'cpur', type: 'varchar', length: 50, default: '' })
    cpur!: string;

    @Column({ name: 'ccas', type: 'varchar', length: 50, default: '' })
    ccas!: string;

    @Column({ name: 'ific', type: 'int', default: 0 })
    ific!: number;

    @Column({ name: 'cvia1', type: 'varchar', length: 100, default: '' })
    cvia1!: string;

    @Column({ name: 'cvia2', type: 'varchar', length: 100, default: '' })
    cvia2!: string;

    @Column({ name: 'cpro', type: 'varchar', length: 50, default: '' })
    cpro!: string;

    @Column({ name: 'ipve', type: 'int', default: 0 })
    ipve!: number;

    @Column({ name: 'npve', type: 'decimal', precision: 18, scale: 2, default: 0 })
    npve!: number;

    @Column({ name: 'cpve', type: 'varchar', length: 50, default: '' })
    cpve!: string;

    @Column({ name: 'cven1', type: 'varchar', length: 10, default: '' })
    cven1!: string;

    @Column({ name: 'csup1', type: 'varchar', length: 10, default: '' })
    csup1!: string;

    @Column({ name: 'cent1', type: 'varchar', length: 10, default: '' })
    cent1!: string;

    @Column({ name: 'cven2', type: 'varchar', length: 10, default: '' })
    cven2!: string;

    @Column({ name: 'csup2', type: 'varchar', length: 10, default: '' })
    csup2!: string;

    @Column({ name: 'cent2', type: 'varchar', length: 10, default: '' })
    cent2!: string;

    @Column({ name: 'clave', type: 'varchar', length: 50, default: '' })
    clave!: string;

    @Column({ name: 'ncom1', type: 'decimal', precision: 18, scale: 2, default: 0 })
    ncom1!: number;

    // Campos App
    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean = false;

    @Column({ name: 'last_synced_at', type: 'datetime', nullable: true })
    lastSyncedAt?: Date;

    @Column({ name: 'device_id', type: 'varchar', length: 100, nullable: true })
    deviceId?: string;

    @ManyToOne(() => Empresa)
    @JoinColumn({ name: 'id' })
    empresa!: Empresa;

    @ManyToOne(() => Vendedor, (vendedor) => vendedor.clientes)
    @JoinColumn([
        { name: 'id', referencedColumnName: 'empresaId' },
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
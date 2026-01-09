import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Cliente } from './Cliente';
import { Articulo } from './Articulo';

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn({ name: 'xxx' })
    internalId!: number;

    @Column({ name: 'num', type: 'varchar', length: 30, nullable: false })
    @Index({ unique: false }) // Might not be unique across companies if not composed
    numero!: string;

    @Column({ name: 'ven', type: 'varchar', length: 10, default: '' })
    vendedorCodigo!: string;

    @Column({ name: 'fic', type: 'varchar', length: 20, default: '' })
    ficha!: string;

    @Column({ name: 'cod', type: 'varchar', length: 30, nullable: false })
    articuloCodigo!: string;

    @Column({ name: 'des', type: 'varchar', length: 100, default: '' })
    descripcion!: string;

    @Column({ name: 'obs', type: 'text', nullable: true })
    observaciones?: string;

    @Column({ name: 'ctra', type: 'varchar', length: 50, default: '' })
    transporte!: string;

    @Column({ name: 'ccho', type: 'varchar', length: 50, default: '' })
    chofer!: string;

    @Column({ name: 'cayu', type: 'varchar', length: 50, default: '' })
    ayudante!: string;

    @Column({ name: 'cche', type: 'varchar', length: 50, default: '' })
    chequeador!: string;

    @Column({ name: 'cdep', type: 'varchar', length: 10, default: '' })
    departamento!: string;

    @Column({ name: 'cdes', type: 'varchar', length: 50, default: '' })
    destino!: string;

    @Column({ name: 'rep', type: 'varchar', length: 10, default: '' })
    rep!: string;

    @Column({ name: 'ibul', type: 'int', default: 0 })
    bultos!: number;

    @Column({ name: 'ihor1', type: 'int', default: 0 })
    ihor1!: number;

    @Column({ name: 'cli', type: 'varchar', length: 20, nullable: false })
    clienteCodigo!: string;

    @Column({ name: 'cusu', type: 'varchar', length: 30, default: '' })
    usuario!: string;

    @Column({ name: 'can', type: 'decimal', precision: 12, scale: 2, default: 0 })
    cantidad!: number;

    @Column({ name: 'pre', type: 'decimal', precision: 18, scale: 2, default: 0 })
    precio!: number;

    @Column({ name: 'id', type: 'int', nullable: false })
    empresaId!: number;

    @Column({ name: 'ifac', type: 'int', default: 0 })
    ifac!: number;

    @Column({ name: 'nmon', type: 'decimal', precision: 18, scale: 2, default: 0 })
    nmon!: number;

    @Column({ name: 'ngra', type: 'decimal', precision: 18, scale: 2, default: 0 })
    ngra!: number;

    @Column({ name: 'ntax', type: 'decimal', precision: 18, scale: 2, default: 0 })
    ntax!: number;

    @Column({ name: 'pvp', type: 'decimal', precision: 18, scale: 2, default: 0 })
    pvp!: number;

    @Column({ name: 'pcli', type: 'decimal', precision: 18, scale: 2, default: 0 })
    pcli!: number;

    @Column({ name: 'pvol', type: 'decimal', precision: 18, scale: 2, default: 0 })
    pvol!: number;

    @Column({ name: 'bac', type: 'decimal', precision: 18, scale: 2, default: 0 })
    bac!: number;

    @Column({ name: 'ndolar', type: 'decimal', precision: 18, scale: 2, default: 0 })
    ndolar!: number;

    @Column({ name: 'dfec', type: 'datetime', nullable: false })
    fecha!: Date;

    @Column({ name: 'dgui', type: 'datetime', nullable: true })
    fechaGuia?: Date;

    @Column({ name: 'iprt', type: 'int', default: 0 })
    iprt!: number;

    @Column({ name: 'itip', type: 'int', default: 0 })
    tipo!: number;

    @Column({ name: 'ifor', type: 'int', default: 0 })
    ifor!: number;

    @Column({ name: 'imar', type: 'int', default: 0 })
    imar!: number;

    @Column({ name: 'igui', type: 'int', default: 0 })
    igui!: number;

    @Column({ name: 'iprefac', type: 'int', default: 0 })
    iprefac!: number;

    @Column({ name: 'imin1', type: 'int', default: 0 })
    imin1!: number;

    @Column({ name: 'iam1', type: 'int', default: 0 })
    iam1!: number;

    @Column({ name: 'ihor2', type: 'int', default: 0 })
    ihor2!: number;

    @Column({ name: 'imin2', type: 'int', default: 0 })
    imin2!: number;

    @Column({ name: 'iam2', type: 'int', default: 0 })
    iam2!: number;

    // App required fields
    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean = false;

    @Column({ name: 'last_synced_at', type: 'datetime', nullable: true })
    lastSyncedAt?: Date;

    @Column({ name: 'device_id', type: 'varchar', length: 100, nullable: true })
    deviceId?: string;

    @ManyToOne(() => Cliente, { createForeignKeyConstraints: false })
    @JoinColumn([
        { name: 'id', referencedColumnName: 'empresaId' },
        { name: 'cli', referencedColumnName: 'codigo' }
    ])
    cliente!: Cliente;

    @ManyToOne(() => Articulo, { createForeignKeyConstraints: false })
    @JoinColumn([
        { name: 'id', referencedColumnName: 'empresaId' },
        { name: 'cod', referencedColumnName: 'codigo' }
    ])
    articulo!: Articulo;
}
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';

@Entity('articulos')
@Index(['empresaId', 'codigo'], { unique: true })
export class Articulo {
    @PrimaryGeneratedColumn({ name: 'xxx' })
    internalId!: number;

    @Column({ name: 'id', type: 'int', nullable: false })
    empresaId!: number;

    @Column({ name: 'ccod', type: 'varchar', length: 50, nullable: false })
    codigo!: string;

    @Column({ name: 'ccodx', type: 'varchar', length: 50, nullable: false, default: '' })
    codigoAlterno!: string;

    @Column({ name: 'cdet', type: 'varchar', length: 200, nullable: false })
    descripcion!: string;

    @Column({ name: 'cuni', type: 'varchar', length: 20, default: '' })
    unidad!: string;

    @Column({ name: 'cmod', type: 'varchar', length: 50, default: '' })
    modelo!: string;

    @Column({ name: 'cusu', type: 'varchar', length: 50, default: '' })
    usuario!: string;

    @Column({ name: 'cmaq', type: 'varchar', length: 50, default: '' })
    maquina!: string;

    @Column({ name: 'npre1', type: 'decimal', precision: 18, scale: 3, default: 0 })
    precio1!: number;

    @Column({ name: 'npre2', type: 'decimal', precision: 18, scale: 3, default: 0 })
    precio2!: number;

    @Column({ name: 'npre3', type: 'decimal', precision: 18, scale: 3, default: 0 })
    precio3!: number;

    @Column({ name: 'npre4', type: 'decimal', precision: 18, scale: 3, default: 0 })
    precio4!: number;

    @Column({ name: 'npre5', type: 'decimal', precision: 18, scale: 3, default: 0 })
    precio5!: number;

    @Column({ name: 'npre6', type: 'decimal', precision: 18, scale: 3, default: 0 })
    precio6!: number;

    @Column({ name: 'npor1', type: 'decimal', precision: 10, scale: 2, default: 0 })
    porcentaje1!: number;

    @Column({ name: 'npor2', type: 'decimal', precision: 10, scale: 2, default: 0 })
    porcentaje2!: number;

    @Column({ name: 'ncos', type: 'decimal', precision: 18, scale: 2, default: 0 })
    costo!: number;

    @Column({ name: 'ncan1', type: 'decimal', precision: 18, scale: 3, default: 0 })
    cantidad!: number;

    @Column({ name: 'ncan2', type: 'decimal', precision: 18, scale: 3, default: 0 })
    cantidad2!: number;

    @Column({ name: 'ncan3', type: 'decimal', precision: 18, scale: 3, default: 0 })
    cantidad3!: number;

    @Column({ name: 'itip', type: 'int', default: 0 })
    tipo!: number;

    @Column({ name: 'cref', type: 'varchar', length: 50, default: '' })
    referencia!: string;

    @Column({ name: 'iiva', type: 'int', default: 0 })
    impuesto!: number;

    @Column({ name: 'cdep', type: 'varchar', length: 20, default: '' })
    departamento!: string;

    @Column({ name: 'ccla', type: 'varchar', length: 50, default: '' })
    clase!: string;

    @Column({ name: 'ccol', type: 'varchar', length: 50, default: '' })
    color!: string;

    @Column({ name: 'cmar', type: 'varchar', length: 50, nullable: true })
    marca?: string;

    @Column({ name: 'ncan4', type: 'decimal', precision: 18, scale: 3, default: 0 })
    cantidad4!: number;

    @Column({ name: 'npes', type: 'decimal', precision: 18, scale: 4, default: 0 })
    peso!: number;

    @Column({ name: 'ndolar', type: 'decimal', precision: 18, scale: 2, default: 0 })
    dolar!: number;

    @Column({ name: 'ivid', type: 'int', default: 0 })
    ivid!: number;

    @Column({ name: 'imix', type: 'int', default: 0 })
    imix!: number;

    @Column({ name: 'cpre', type: 'varchar', length: 50, default: '' })
    cpre!: string;

    @Column({ name: 'cubi', type: 'varchar', length: 50, default: '' })
    cubi!: string;

    @Column({ name: 'cest', type: 'varchar', length: 50, default: '' })
    cest!: string;

    @Column({ name: 'cniv', type: 'varchar', length: 50, default: '' })
    cniv!: string;

    @Column({ name: 'cpos', type: 'varchar', length: 50, default: '' })
    cpos!: string;

    @Column({ name: 'cfor1', type: 'varchar', length: 50, default: '' })
    cfor1!: string;

    @Column({ name: 'cfor2', type: 'varchar', length: 50, default: '' })
    cfor2!: string;

    @Column({ name: 'cfor3', type: 'varchar', length: 50, default: '' })
    cfor3!: string;

    @Column({ name: 'cfor4', type: 'varchar', length: 50, default: '' })
    cfor4!: string;

    @Column({ name: 'iroj', type: 'int', default: 0 })
    iroj!: number;

    @Column({ name: 'icon', type: 'int', default: 0 })
    icon!: number;

    @Column({ name: 'nroj', type: 'decimal', precision: 18, scale: 2, default: 0 })
    nroj!: number;

    @Column({ name: 'ncan5', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan5!: number;

    @Column({ name: 'ncan7', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan7!: number;

    @Column({ name: 'ncan8', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan8!: number;

    @Column({ name: 'ncan9', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan9!: number;

    @Column({ name: 'ncan10', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan10!: number;

    @Column({ name: 'ncan11', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan11!: number;

    @Column({ name: 'ncan12', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan12!: number;

    @Column({ name: 'ivac', type: 'int', default: 0 })
    ivac!: number;

    @Column({ name: 'ipal', type: 'int', default: 0 })
    ipal!: number;

    @Column({ name: 'ifis', type: 'int', default: 0 })
    ifis!: number;

    @Column({ name: 'ific', type: 'int', default: 0 })
    ific!: number;

    @Column({ name: 'ides', type: 'int', default: 0 })
    ides!: number;

    @Column({ name: 'ncan6', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan6!: number;

    @Column({ name: 'ihas', type: 'int', default: 0 })
    ihas!: number;

    @Column({ name: 'ista', type: 'int', default: 0 })
    ista!: number;

    @Column({ name: 'isube', type: 'int', default: 0 })
    isube!: number;

    // Campos de BaseModel que quizás necesitemos mantener para la app offline
    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean = false;

    @Column({ name: 'last_synced_at', type: 'datetime', nullable: true })
    lastSyncedAt?: Date;

    @Column({ name: 'device_id', type: 'varchar', length: 100, nullable: true })
    deviceId?: string;

    @Column({ name: 'dfec', type: 'datetime', nullable: true })
    fecha!: Date;

    @ManyToOne(() => Empresa, (empresa) => empresa.articulos, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'id' })
    empresa!: Empresa;
}
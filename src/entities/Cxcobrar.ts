import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

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
    id!: number;

    @Column({ name: 'cdoc', type: 'varchar', length: 10, nullable: false })
    cdoc!: string;

    @Column({ name: 'inum', type: 'int', nullable: false })
    inum!: number;

    @Column({ name: 'dfec', type: 'datetime', nullable: false })
    dfec!: Date;

    @Column({ name: 'nsal', type: 'decimal', precision: 12, scale: 2, nullable: false })
    nsal!: number;

    @Column({ name: 'ccli', type: 'varchar', length: 20, nullable: false })
    ccli!: string;

    @Column({ name: 'ista', type: 'int', default: 0 })
    ista!: number;

    @Column({ name: 'cven', type: 'varchar', length: 10, nullable: false })
    cven!: string;

}
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

@Entity('articulos')
@Index(['id', 'ccod'], { unique: true })
export class Articulo {
    @PrimaryGeneratedColumn({ name: 'xxx' })
    internalId!: number;

    @Column({ name: 'id', type: 'int', nullable: false })
    id!: number;

    @Column({ name: 'ccod', type: 'varchar', length: 50, nullable: false })
    ccod!: string;

    @Column({ name: 'cdet', type: 'varchar', length: 200, nullable: false })
    cdet!: string;

    @Column({ name: 'cuni', type: 'varchar', length: 20, default: '' })
    cuni!: string;

    @Column({ name: 'cref', type: 'varchar', length: 50, default: '' })
    cref!: string;

    @Column({ name: 'npre1', type: 'decimal', precision: 18, scale: 3, default: 0 })
    npre1!: number;

    @Column({ name: 'npre2', type: 'decimal', precision: 18, scale: 3, default: 0 })
    npre2!: number;

    @Column({ name: 'ncan1', type: 'decimal', precision: 18, scale: 3, default: 0 })
    ncan1!: number;

    @Column({ name: 'ides', type: 'int', default: 0 })
    ides!: number;
}